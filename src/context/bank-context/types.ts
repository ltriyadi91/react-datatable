import type { ReactNode } from 'react';
import type { DataRecord, FilterOption } from '@/types/table';

// Define context props with stronger typing
export interface TableContextProps<T extends DataRecord = DataRecord> {
  // Data
  data: T[];
  loading: boolean;
  error: string | null;
  
  // Pagination
  page: number;
  setPage: (page: number) => void;
  recordsPerPage: number;
  totalPages: number;
  paginatedData: T[];
  
  // Sorting
  sortBy: string | null;
  reverseSortDirection: boolean;
  handleSort: (field: string) => void;
  
  // Search
  search: string;
  setSearch: (search: string) => void;
  
  // Column Filters
  columnFilters: Record<string, FilterOption[] | string>;
  setColumnFilter: (columnAccessor: string, value: FilterOption[] | string) => void;
  clearColumnFilter: (columnAccessor: string) => void;
  clearAllFilters: () => void;
  
  // Selection
  selection: string[];
  toggleRow: (id: string) => void;
  toggleAll: () => void;
  selectedRowsData: T[];
  
  // Filters
  categoryCount: Record<string, number>;
  filteredData: T[];
  getUniqueValuesForColumn: (columnAccessor: string) => FilterOption[];
}

export interface TableProviderProps<T extends DataRecord = DataRecord> {
  children: ReactNode;
  dataUrl?: string;
  records?: T[];
  recordsPerPage?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}
