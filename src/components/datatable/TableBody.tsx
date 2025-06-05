import { type CSSProperties } from "react";
import { Checkbox, Table } from "@mantine/core";
import type { ColumnDef, DataRecord } from "@/types/table";

interface TableBodyProps<T extends DataRecord> {
  columns: ColumnDef<T>[];
  paginatedData: T[];
  selection: string[];
  toggleRow: (id: string) => void;
}

export function TableBody<T extends DataRecord>({
  columns,
  paginatedData,
  selection,
  toggleRow
}: TableBodyProps<T>) {

  if (!paginatedData || paginatedData.length === 0) {
    return (
      <Table.Tbody>
        <Table.Tr>
          <Table.Td colSpan={columns.length + 1} align="center">
            No data to display
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    );
  }

  return (
    <Table.Tbody>
      {paginatedData.map((record) => (
        <Table.Tr
          key={record.id}
          bg={
            selection.includes(record.id)
              ? "var(--mantine-color-blue-light)"
              : undefined
          }
          style={{ transition: "background-color 0.2s ease" }}
        >
          {/* Selection checkbox */}
          <Table.Td>
            <Checkbox
              checked={selection.includes(record.id)}
              onChange={() => toggleRow(record.id)}
              radius="sm"
              size="sm"
            />
          </Table.Td>

          {/* Dynamic columns */}
          {columns.map((column, index) => {
            const value = record[column.accessor as keyof typeof record];
            const cellStyle: CSSProperties = {};

            if (column.textAlign) {
              cellStyle.textAlign = column.textAlign;
            }

            if (column.width) {
              cellStyle.width =
                typeof column.width === "number"
                  ? `${column.width}px`
                  : column.width;
            }

            return (
              <Table.Td key={`${record.id}-${index}`} style={cellStyle}>
                {column.render ? column.render(record) : String(value || "")}
              </Table.Td>
            );
          })}
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
}
