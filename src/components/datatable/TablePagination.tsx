import { Badge, Flex, Pagination } from "@mantine/core";

interface TablePaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  paginatedDataLength: number;
  totalDataLength: number;
}

export function TablePagination({
  page,
  setPage,
  totalPages,
  paginatedDataLength,
  totalDataLength,
}: TablePaginationProps) {
  return (
    <Flex justify="space-between" align="center" wrap="wrap" gap="md">
      <Badge size="lg" radius="md" variant="outline" color="blue">
        Showing {paginatedDataLength} of {totalDataLength} records
      </Badge>

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
