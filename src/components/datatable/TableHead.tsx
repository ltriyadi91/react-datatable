import React from "react";
import { Checkbox, Group, Table, Text } from "@mantine/core";
import { FilterWrapper } from "./FilterWrapper";
import { TableSort } from "./TableSort";
import type { ColumnDef, DataRecord, FilterOption } from "@/types/table";

interface TableHeadProps<T extends DataRecord> {
  columns: ColumnDef<T>[];
  paginatedData: T[];
  selection: string[];
  toggleAll: () => void;
  sortBy: string | null;
  reverseSortDirection: boolean;
  handleSort: (field: string) => void;
  showColumnFilters: boolean;
  columnFilters: Record<string, FilterOption[] | string>;
  setColumnFilter: (columnAccessor: string, value: FilterOption[] | string) => void;
  clearColumnFilter: (columnAccessor: string) => void;
  getUniqueValuesForColumn: (columnAccessor: string) => FilterOption[];
}

export function TableHead<T extends DataRecord>({
  columns,
  paginatedData,
  selection,
  toggleAll,
  sortBy,
  reverseSortDirection,
  handleSort,
  showColumnFilters,
  columnFilters,
  setColumnFilter,
  clearColumnFilter,
  getUniqueValuesForColumn,
}: TableHeadProps<T>) {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th style={{ width: "40px" }}>
          <Checkbox
            checked={
              selection.length === paginatedData.length &&
              paginatedData.length > 0
            }
            indeterminate={
              selection.length > 0 &&
              selection.length !== paginatedData.length
            }
            onChange={toggleAll}
            radius="sm"
            size="sm"
          />
        </Table.Th>
        {columns.length > 0 ? (
          // Render dynamic column headers
          columns.map((column, index) => {
            const style: React.CSSProperties = {};
            if (column.width) {
              style.width =
                typeof column.width === "number"
                  ? `${column.width}px`
                  : column.width;
            }
            if (column.textAlign) {
              style.textAlign = column.textAlign;
            }

            return (
              <TableSort
                key={index}
                sorted={sortBy === column.accessor}
                reversed={reverseSortDirection}
                sortable={column.sortable}
              >
                <Group gap="xs" justify="space-between" align="center">
                  <Text
                    fz="md"
                    fw={800}
                    onClick={() => column.sortable !== false && handleSort(column.accessor)}
                    component="span"
                    style={{ cursor: column.sortable !== false ? "pointer" : "default" }}
                  >
                    {column.header || column.accessor}
                  </Text>

                  {showColumnFilters && column.filter?.type ? (
                    <FilterWrapper
                      column={column}
                      value={
                        columnFilters[column.accessor] ||
                        (column.filter?.type === "multi-select"
                          ? []
                          : "")
                      }
                      onChange={(value) =>
                        setColumnFilter(column.accessor, value)
                      }
                      onClear={() => clearColumnFilter(column.accessor)}
                      getUniqueValues={() =>
                        getUniqueValuesForColumn(column.accessor)
                      }
                      data={paginatedData}
                    />
                  ) : null}
                </Group>
              </TableSort>
            );
          })
        ) : (
          <>
            <Table.Th>No columns defined</Table.Th>
          </>
        )}
      </Table.Tr>
    </Table.Thead>
  );
}
