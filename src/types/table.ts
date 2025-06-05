import type { ReactNode } from 'react';

export interface DataRecord {
  id: string;
  [key: string]: unknown;
}
export type FilterType = 'select' | 'multi-select' | 'date';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  type: FilterType;
  options?: FilterOption[];
  placeholder?: string;
  enabled?: boolean;
}

export interface ColumnDef<T extends DataRecord = DataRecord> {
  accessor: string;
  header?: ReactNode;
  width?: number | string;
  textAlign?: 'left' | 'center' | 'right';
  render?: (record: T) => React.ReactNode;
  filter?: FilterConfig;
  // Get unique values for this column (for select/multi-select filters)
  getUniqueValues?: (data: T[]) => FilterOption[];
  // Whether this column can be sorted (defaults to true)
  sortable?: boolean;
}

export interface DataTableProps<T extends DataRecord = DataRecord> {
  dataUrl?: string;
  records?: T[];
  columns?: ColumnDef<T>[];
  
  height?: number | string;
  withTableBorder?: boolean;
  striped?: boolean;
  highlightOnHover?: boolean;
  
  totalRecords?: number;
  recordsPerPage?: number;
  page?: number;
  onPageChange?: (page: number) => void;
}

export interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  sortable?: boolean;
}
