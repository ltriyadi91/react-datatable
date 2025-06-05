import { Box, Card, LoadingOverlay, Stack, Table } from "@mantine/core";

import { TableActions } from "./TableActions";
import { TableHead } from "./TableHead";
import { TableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { TableErrorState } from "./TableErrorState";

import type { DataRecord, ColumnDef, FilterOption } from "@/types/table";

export interface DataTableProps<T extends DataRecord> {
  // Core data props
  data?: T[];
  loading?: boolean;
  error?: string | null;
  filteredData?: T[];

  // UI props
  columns: ColumnDef<T>[];
  height?: number | string;
  width?: number | string;
  minHeight?: number | string;
  striped?: boolean;
  highlightOnHover?: boolean;
  withTableBorder?: boolean;
  withRowBorders?: boolean;
  recordsPerPage?: number;
  showColumnFilters?: boolean;
  verticalSpacing?: "xs" | "sm" | "md" | "lg" | "xl";

  // Pagination props
  page?: number;
  setPage?: (page: number) => void;
  totalPages?: number;
  paginatedData?: T[];

  // Sorting props
  sortBy?: string | null;
  reverseSortDirection?: boolean;
  handleSort?: (field: string) => void;

  // Search props
  search?: string;
  setSearch?: (search: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;

  // Column filter props
  columnFilters?: Record<string, FilterOption[] | string>;
  setColumnFilter?: (
    columnAccessor: string,
    value: FilterOption[] | string
  ) => void;
  clearColumnFilter?: (columnAccessor: string) => void;
  clearAllFilters?: () => void;
  getUniqueValuesForColumn?: (columnAccessor: string) => FilterOption[];

  // Selection props
  selection?: string[];
  toggleRow?: (id: string) => void;
  toggleAll?: () => void;

  // Refresh data
  onRefresh?: () => void;
}

export function DataTable<T extends DataRecord>({
  loading = false,
  error = null,
  filteredData = [],

  // Table UI props
  columns = [],
  height,
  withTableBorder = true,
  withRowBorders = true,
  striped = true,
  highlightOnHover = true,
  showColumnFilters = true,
  verticalSpacing = "md",

  // Pagination props with defaults
  page = 1,
  setPage = () => {},
  totalPages = 1,
  paginatedData = [],

  // Sorting props with defaults
  sortBy = null,
  reverseSortDirection = false,
  handleSort = () => {},

  // Search props with defaults
  search = "",
  setSearch = () => {},
  searchable = true,
  searchPlaceholder = "Search...",

  // Column Filters props with defaults
  columnFilters = {},
  setColumnFilter = () => {},
  clearColumnFilter = () => {},
  clearAllFilters = () => {},
  getUniqueValuesForColumn = () => [],

  // Selection props with defaults
  selection = [],
  toggleRow = () => {},
  toggleAll = () => {},

  // Refresh prop
  onRefresh = () => {},
}: DataTableProps<T>) {
  // Show error state
  if (error) {
    return <TableErrorState error={error} height={height} />;
  }

  return (
    <Card withBorder shadow="sm" p="md" radius="md">
      <Stack gap="md">
        {/* Header with search and filters */}
        <TableActions
          columnFilters={columnFilters}
          clearAllFilters={clearAllFilters}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          search={search}
          setSearch={setSearch}
          onRefresh={onRefresh}
        />

        <Box
          style={{
            overflowX: "auto",
            position: "relative",
            height: height ? `${height}px` : undefined,
          }}
        >
          <Table
            withRowBorders={withRowBorders}
            striped={striped}
            highlightOnHover={highlightOnHover}
            withTableBorder={withTableBorder}
            verticalSpacing={verticalSpacing}
          >
            <TableHead
              columns={columns}
              paginatedData={paginatedData}
              selection={selection}
              toggleAll={toggleAll}
              sortBy={sortBy}
              reverseSortDirection={reverseSortDirection}
              handleSort={handleSort}
              showColumnFilters={showColumnFilters}
              columnFilters={columnFilters}
              setColumnFilter={setColumnFilter}
              clearColumnFilter={clearColumnFilter}
              getUniqueValuesForColumn={getUniqueValuesForColumn}
            />
            <TableBody
              columns={columns}
              paginatedData={paginatedData}
              selection={selection}
              toggleRow={toggleRow}
            />
          </Table>
          <LoadingOverlay
            visible={loading}
            zIndex={2}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        </Box>

        <TablePagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          paginatedDataLength={paginatedData.length}
          totalDataLength={filteredData.length}
        />
      </Stack>
    </Card>
  );
}
