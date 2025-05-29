import dotenv from "dotenv";
import db from "../../../config/db";
import { DriverSalary, CostStatusFilter } from "../types";
import { PaginatedResponse } from "../../../types";

dotenv.config();

interface GetSalariesParams {
  month: number;
  year: number;
  pageSize: number;
  current: number;
  offset: number;
  driver_code?: string;
  status?: CostStatusFilter;
  name?: string;
}

async function getDriverMonthlyAttendanceSalary(): Promise<number> {
  const envSalary = parseFloat(
    process.env.DEFAULT_DRIVER_MONTHLY_ATTENDANCE_SALARY || "0"
  );

  const result = await db("variable_configs")
    .select("value")
    .where("key", "DRIVER_MONTHLY_ATTENDANCE_SALARY")
    .first();
  return result ? parseFloat(result.value) : envSalary;
}

export const fetchDriverSalaries = async (
  params: GetSalariesParams
): Promise<PaginatedResponse<DriverSalary>> => {
  const { month, year, pageSize, current, offset, driver_code, status, name } =
    params;

  /**
   * shipment_cost cost status: CONFIRMED, PENDING, PAID
   * shipment shipment_status: CANCELLED, RUNNING, DONE
   */

  const driverMonthlyAttendanceSalary = await getDriverMonthlyAttendanceSalary();

  let query = db("drivers as d")
    .select(
      "d.driver_code",
      "d.name",
      db.raw(`
      COALESCE(SUM(CASE WHEN sc.cost_status = 'PENDING' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) as total_pending
    `),
      db.raw(`
      COALESCE(SUM(CASE WHEN sc.cost_status = 'CONFIRMED' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) as total_confirmed
    `),
      db.raw(`
      COALESCE(SUM(CASE WHEN sc.cost_status = 'PAID' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) as total_paid
    `),
      db.raw(
        `
      (SELECT COUNT(*) 
       FROM driver_attendances da 
       WHERE da.driver_code = d.driver_code
         AND da.attendance_date >= TO_DATE(? || '-' || LPAD(?::TEXT, 2, '0'), 'YYYY-MM')
         AND da.attendance_date < (TO_DATE(? || '-' || LPAD(?::TEXT, 2, '0'), 'YYYY-MM') + INTERVAL '1 month')
         AND da.attendance_status = TRUE) * ? as total_attendance_salary
    `,
        [year, month, year, month, driverMonthlyAttendanceSalary]
      ),
      db.raw(
        `
      COALESCE((
        SELECT COUNT(DISTINCT s_count.shipment_no)
        FROM shipment_costs sc_count
        JOIN shipments s_count ON s_count.shipment_no = sc_count.shipment_no
        WHERE sc_count.driver_code = d.driver_code
          AND s_count.shipment_date >= TO_DATE(? || '-' || LPAD(?::TEXT, 2, '0'), 'YYYY-MM')
          AND s_count.shipment_date < (TO_DATE(? || '-' || LPAD(?::TEXT, 2, '0'), 'YYYY-MM') + INTERVAL '1 month')
          AND s_count.shipment_status <> 'CANCELLED'
      ), 0) as count_shipment
    `,
        [year, month, year, month]
      )
    )
    .leftJoin("shipment_costs as sc", "d.driver_code", "sc.driver_code")
    .leftJoin("shipments as s", function () {
      this.on("s.shipment_no", "=", "sc.shipment_no")
        .andOn(db.raw("s.shipment_date >= TO_DATE(? || '-' || LPAD(?::TEXT, 2, '0'), 'YYYY-MM')", [year, month]))
        .andOn(db.raw("s.shipment_date < (TO_DATE(? || '-' || LPAD(?::TEXT, 2, '0'), 'YYYY-MM') + INTERVAL '1 month')", [year, month]));
    })
    .groupBy("d.driver_code", "d.name")
    .having(
      db.raw(
        `
      (
        COALESCE(SUM(CASE WHEN sc.cost_status = 'PENDING' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) +
        COALESCE(SUM(CASE WHEN sc.cost_status = 'CONFIRMED' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) +
        COALESCE(SUM(CASE WHEN sc.cost_status = 'PAID' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) +
        (
          SELECT COUNT(*) 
          FROM driver_attendances da 
          WHERE da.driver_code = d.driver_code
            AND da.attendance_date >= TO_DATE(? || '-' || LPAD(?::TEXT, 2, '0'), 'YYYY-MM')
            AND da.attendance_date < (TO_DATE(? || '-' || LPAD(?::TEXT, 2, '0'), 'YYYY-MM') + INTERVAL '1 month')
            AND da.attendance_status = TRUE
        ) * ?
      ) > 0
    `,
        [year, month, year, month, driverMonthlyAttendanceSalary]
      )
    );

  if (driver_code) {
    query.where("d.driver_code", driver_code);
  }
  if (name) {
    query.where("d.name", "ILIKE", `%${name}%`);
  }

  if (status) {
    if (status === "PENDING") {
      query.having(
        db.raw(
          "COALESCE(SUM(CASE WHEN sc.cost_status = 'PENDING' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) > 0"
        )
      );
    } else if (status === "CONFIRMED") {
      query.having(
        db.raw(
          "COALESCE(SUM(CASE WHEN sc.cost_status = 'CONFIRMED' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) > 0"
        )
      );
    } else if (status === "PAID") {
      query
        .having(
          db.raw(
            "COALESCE(SUM(CASE WHEN sc.cost_status = 'PAID' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) > 0"
          )
        )
        .having(
          db.raw(
            "COALESCE(SUM(CASE WHEN sc.cost_status = 'CONFIRMED' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) = 0"
          )
        )
        .having(
          db.raw(
            "COALESCE(SUM(CASE WHEN sc.cost_status = 'PENDING' AND s.shipment_status <> 'CANCELLED' THEN sc.total_costs ELSE 0 END), 0) = 0"
          )
        );
    }
  }

  let baseQuery = query.clone();
  const totalQuery = db
    .from(baseQuery.as("sub"))
    .count("* as total")
    .first();
  
  const totalResult = await totalQuery;
  const total = (totalResult as any)?.total ?? "0";
  const total_row = parseInt(total, 0);

  query.limit(pageSize).offset(offset).orderBy("d.name");

  const results: any[] = await query;

  const data: DriverSalary[] = results.map((row) => ({
    driver_code: row.driver_code,
    name: row.name,
    total_pending: parseFloat(row.total_pending) || 0,
    total_confirmed: parseFloat(row.total_confirmed) || 0,
    total_paid: parseFloat(row.total_paid) || 0,
    total_attendance_salary: parseFloat(row.total_attendance_salary) || 0,
    total_salary:
      (parseFloat(row.total_pending) || 0) +
      (parseFloat(row.total_confirmed) || 0) +
      (parseFloat(row.total_paid) || 0) +
      (parseFloat(row.total_attendance_salary) || 0),
    count_shipment: parseInt(row.count_shipment, 10) || 0,
  }));

  return {
    data,
    total_row,
    current,
    page_size: pageSize,
  };
};
