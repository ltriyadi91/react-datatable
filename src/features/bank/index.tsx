import { Container, Flex, Paper, Text, Title, Stack } from "@mantine/core";
import { DataTable } from "@/components/datatable/TableMain";
import { usePageSizeControl, useTable } from "@/context/bank-context";
import { SelectionRows } from "@/components/common/SelectionRows";
import { CategoryBadge } from "@/features/bank/components/CategoryBadge";

import type { ColumnDef } from "@/types/table";
import type { BankTransaction } from "@/types/data";
import { formatCurrency } from "@/utils/dataUtils";

export default function Bank() {
  // Get all table context values
  const tableContext = useTable();
  const { setPageSize } = usePageSizeControl();

  // Sample column definitions for bank transactions
  const bankColumns: ColumnDef<BankTransaction>[] = [
    {
      accessor: "transactionDate",
      header: "Date",
      width: 120,
      filter: {
        type: "date",
      },
      render: (record) => (
        <Text fz="sm" fw={500}>
          {record.transactionDate}
        </Text>
      ),
      // Date column is sortable (default behavior)
    },
    {
      accessor: "description",
      header: "Description",
      width: 300,
      render: (record) => (
        <Text fz="sm">{String(record.description || "")}</Text>
      ),
      // Description column is sortable (default behavior)
    },
    {
      accessor: "category",
      header: "Category",
      width: 180,
      filter: {
        type: "multi-select",
      },
      render: (record) => (
        <CategoryBadge category={String(record.category || "Uncategorized")} />
      ),
      // Making the Category column non-sortable as an example
      sortable: false,
    },
    {
      accessor: "debit",
      header: "Debit",
      width: 100,
      textAlign: "left",
      render: (record) => record.debit && formatCurrency(Number(record.debit)),
      sortable: false,
    },
    {
      accessor: "credit",
      header: "Credit",
      width: 100,
      textAlign: "left",
      render: (record) =>
        record.credit && formatCurrency(Number(record.credit)),
      // Making the Credit column non-sortable as an example
      sortable: false,
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Text fz="xl" fw={800} mb="md">
        Bank Transactions Example
      </Text>
      <Paper
        shadow="sm"
        radius="lg"
        p="xl"
        withBorder
        mb="xl"
        style={{ borderColor: "var(--mantine-color-blue-light)" }}
      >
        <Stack gap="md">
          {/* DataTable without pagination component */}
          <DataTable
            {...tableContext}
            withTableBorder={false}
            columns={bankColumns}
            data={tableContext.data as BankTransaction[]}
            paginatedData={tableContext.paginatedData as BankTransaction[]}
            filteredData={tableContext.filteredData as BankTransaction[]}
            onRecordsPerPageChange={setPageSize}
          />
          
        </Stack>
      </Paper>

      <SelectionRows
        selection={tableContext.selection}
        selectedRowsData={tableContext.selectedRowsData as BankTransaction[]}
      />

      <Flex gap="md" wrap="wrap" mt="lg">
        <Paper
          shadow="sm"
          radius="lg"
          p="xl"
          withBorder
          style={{
            flex: "1",
            minWidth: "300px",
            borderColor: "var(--mantine-color-blue-light)",
          }}
        >
          <Title order={3} mb="md" c="blue.7">
            Features
          </Title>
          <ul style={{ paddingLeft: "1.2rem", lineHeight: 1.6 }}>
            <li>
              Flexible usage: supports both dataUrl and direct records props
            </li>
            <li>Custom column definitions with flexible render functions</li>
            <li>Pagination with configurable records per page</li>
            <li>Sortable columns (click on any column header)</li>
            <li>Search functionality (filters by description or category)</li>
            <li>Row selection with checkboxes</li>
            <li>Selected rows displayed as JSON below the table</li>
          </ul>
        </Paper>

        <Paper
          shadow="sm"
          radius="lg"
          p="xl"
          withBorder
          style={{
            flex: "1",
            minWidth: "300px",
            borderColor: "var(--mantine-color-blue-light)",
            background:
              "linear-gradient(to right, var(--mantine-color-blue-0), white)",
          }}
        >
          <Title order={3} mb="md" c="blue.7">
            About
          </Title>
          <Text>
            This dashboard displays bank transaction data with advanced
            filtering, sorting, and selection capabilities. The data is fetched
            asynchronously and presented in a user-friendly interface.
          </Text>
        </Paper>
      </Flex>
    </Container>
  );
}
