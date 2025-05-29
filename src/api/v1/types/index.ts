export interface DriverSalary {
  driver_code: string;
  name: string;
  total_pending: number;
  total_confirmed: number;
  total_paid: number;
  total_attendance_salary: number;
  total_salary: number;
  count_shipment: number;
}

export type CostStatusFilter = 'PENDING' | 'CONFIRMED' | 'PAID';