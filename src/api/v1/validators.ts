import { CostStatusFilter } from "./types";

export function validateStatus(statusStr?: string): CostStatusFilter | undefined {
  if (!statusStr) return undefined;

  const upperStatus = statusStr.toUpperCase();
  if (["PENDING", "CONFIRMED", "PAID"].includes(upperStatus)) {
    return upperStatus as CostStatusFilter;
  }

  throw new Error("Invalid status filter value.");
}