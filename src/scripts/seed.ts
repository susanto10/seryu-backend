import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import db from '../config/db';

interface Driver {
  id: string;
  driver_code: string;
  name: string;
}

interface DriverAttendance {
  id: string;
  driver_id: string;
  attendance_date: string;
  attendance_status: boolean;
}

interface Shipment {
  id: string;
  driver_id: string;
  shipment_no: string;
  shipment_date: string;
  shipment_status: 'RUNNING' | 'DONE' | 'CANCELED';
  origin_id: number;
  destination_id: number;
}

interface ShipmentCost {
  id: string;
  shipment_id: string;
  total_costs: number;
  cost_status: 'PENDING' | 'CONFIRMED' | 'PAID';
}

interface VariableConfig {
  id: string;
  variable_name: string;
  value: string; // Store as string, parse when used
}

async function seedTable<T extends Record<string, any>>(tableName: string, csvFileName: string, transform?: (row: any) => T) {
  return new Promise<void>((resolve, reject) => {
    const results: T[] = [];
    const filePath = path.join(__dirname, '../../data', csvFileName);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Basic type conversions / transformations
        const transformedData = transform ? transform(data) : data;
        results.push(transformedData);
      })
      .on('end', async () => {
        try {
          if (results.length > 0) {
            // Clear existing data to make seeding idempotent
            await db(tableName).del(); 
            // Knex batchInsert is more efficient for large datasets
            await db.batchInsert(tableName, results as unknown as typeof results[], 100); 
            console.log(`Seeded ${results.length} records into ${tableName}`);
          } else {
            console.log(`No data to seed for ${tableName}`);
          }
          resolve();
        } catch (error) {
          console.error(`Error seeding ${tableName}:`, error);
          reject(error);
        }
      })
      .on('error', (error) => {
          console.error(`Error reading CSV ${csvFileName}:`, error);
          reject(error);
      });
  });
}

async function runSeed() {
  try {
    console.log('Starting seeding...');

    await seedTable<Driver>('drivers', 'drivers.csv', (row) => ({
        ...row,
    }));

    await seedTable<Shipment>('shipments', 'shipments.csv', (row) => ({
        ...row,
        shipment_date: new Date(row.shipment_date).toISOString().split('T')[0], // Ensure YYYY-MM-DD
    }));
    
    await seedTable<DriverAttendance>('driver_attendances', 'driver_attendances.csv', (row) => ({
        ...row,
        attendance_status: row.attendance_status.toLowerCase() === 'true',
        attendance_date: new Date(row.attendance_date).toISOString().split('T')[0], // Ensure YYYY-MM-DD
    }));

    await seedTable<ShipmentCost>('shipment_costs', 'shipment_costs.csv', (row) => ({
        ...row,
        total_costs: parseFloat(row.total_costs),
    }));

    await seedTable<VariableConfig>('variable_configs', 'variable_configs.csv', (row) => ({
        ...row,
    }));

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await db.destroy();
  }
}

runSeed();