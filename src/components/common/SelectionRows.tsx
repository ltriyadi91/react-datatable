// SelectionRows component for displaying selection data
import { Card, Flex, Text, Badge, Code } from "@mantine/core";
import type { DataRecord } from "@/types/table";

interface SelectionRowsProps<T extends DataRecord> {
  selection: string[];
  selectedRowsData: T[];
}

export function SelectionRows<T extends DataRecord>({
  selection,
  selectedRowsData,
}: SelectionRowsProps<T>) {
  if (selection.length === 0) return null;

  return (
    <Card withBorder shadow="xs" radius="md" p="md" bg="blue.0">
      <Flex justify="space-between" align="center" mb="xs">
        <Text fw={600} c="blue.8">
          Selected Rows ({selection.length})
        </Text>
        <Badge color="blue" size="lg">
          {selection.length} items
        </Badge>
      </Flex>
      <Code
        block
        style={{
          borderRadius: "0.5rem",
          maxHeight: "200px",
          overflow: "auto",
        }}
      >
        {JSON.stringify(selectedRowsData, null, 2)}
      </Code>
    </Card>
  );
}
