import { Request, Response, NextFunction } from "express";
import { fetchDriverSalaries } from "../services/salaryService";
import { validateMonthYear, validatePagination } from "../../../utils/validators";
import { validateStatus } from "../validators";

export const getDriverSalaries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      month: monthStr,
      year: yearStr,
      page_size: pageSizeStr = "10",
      current: currentStr = "1",
      driver_code,
      status,
      name,
    } = req.query;

    if (!monthStr || !yearStr) {
      return res.status(400).json({ message: "Month and year are required." });
    }

    let month: number, year: number, pageSize: number, current: number, validatedStatus;

    try {
      ({ month, year } = validateMonthYear(monthStr as string, yearStr as string));
      ({ pageSize, current } = validatePagination(pageSizeStr as string, currentStr as string));
      validatedStatus = validateStatus(status as string | undefined);
    } catch (validationError) {
      return res.status(400).json({ message: (validationError as Error).message });
    }

    const offset = (current - 1) * pageSize;

    const result = await fetchDriverSalaries({
      month,
      year,
      pageSize,
      current,
      offset,
      driver_code: driver_code as string | undefined,
      status: validatedStatus,
      name: name as string | undefined,
    });

    res.json(result);
  } catch (error) {
    console.error("Error in getDriverSalaries controller:", error);
    next(error);
  }
};
