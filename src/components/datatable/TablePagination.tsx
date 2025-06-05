import { Badge, Flex, Pagination, Select, Group } from "@mantine/core";

interface TablePaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  paginatedDataLength: number;
  totalDataLength: number;
  recordsPerPage?: number;
  onRecordsPerPageChange?: (value: number) => void;
}

export function TablePagination({
  page,
  setPage,
  totalPages,
  paginatedDataLength,
  totalDataLength,
  recordsPerPage = 10,
  onRecordsPerPageChange,
}: TablePaginationProps) {
  return (
    <Flex justify="space-between" align="center" wrap="wrap" gap="md">
      <Group>
        <Badge size="lg" radius="md" variant="outline" color="blue">
          Showing {paginatedDataLength} of {totalDataLength} records
        </Badge>
        
        {onRecordsPerPageChange && (
          <Select
            value={recordsPerPage.toString()}
            onChange={(value) => onRecordsPerPageChange(Number(value))}
            data={[
              { value: '10', label: '10 per page' },
              { value: '25', label: '25 per page' },
              { value: '50', label: '50 per page' },
              { value: '100', label: '100 per page' },
            ]}
            size="sm"
            w={130}
            radius="md"
          />
        )}
      </Group>

      <Pagination
        value={page}
        onChange={setPage}
        total={totalPages}
        withEdges
        radius="md"
        styles={{
          control: { borderColor: "var(--mantine-color-blue-light)" },
        }}
      />
    </Flex>
  );
}
