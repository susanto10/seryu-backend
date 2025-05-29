import fs from 'fs';
import path from 'path';
import db from '../config/db';

async function runMigration() {
  try {
    console.log('Starting migration...');
    const migrationSql = fs.readFileSync(path.join(__dirname, '../../data/migration.sql'), 'utf-8');
    await db.raw(migrationSql);

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await db.destroy();
  }
}

runMigration();