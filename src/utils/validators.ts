export function validateMonthYear(monthStr: string, yearStr: string): { month: number, year: number } {
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (isNaN(month) || month < 1 || month > 12) {
    throw new Error("Invalid month.");
  }

  if (isNaN(year) || year < 1900 || year > 2100) {
    throw new Error("Invalid year.");
  }

  return { month, year };
}

export function validatePagination(pageSizeStr: string, currentStr: string): { pageSize: number, current: number } {
  const pageSize = parseInt(pageSizeStr, 10);
  const current = parseInt(currentStr, 10);

  if (isNaN(pageSize) || pageSize <= 0 || isNaN(current) || current <= 0) {
    throw new Error("Invalid pagination parameters.");
  }

  return { pageSize, current };
}