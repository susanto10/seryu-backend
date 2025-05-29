export interface PaginatedResponse<T> {
  data: T[];
  total_row: number;
  current: number;
  page_size: number;
}