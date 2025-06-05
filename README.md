# React Data Table Reusable Component

A flexible, data table component for React applications with advanced functionality including sorting, filtering, pagination, and selection capabilities.

## Tech Stack

- **React**
- **TypeScript**
- **Mantine UI**
- **React Context API**
- **Vite**

## Features

- 🔍 **Search & Filter**: Search across all data or apply column specific filters
- 🔄 **Sorting**: Sort data by clicking column headers (with optional per column control)
- 📋 **Pagination**: Navigate through large datasets with ease
- ✅ **Row Selection**: Select individual or all rows with checkboxes
- 🛠️ **Customizable**: Flexible column definitions with custom renderers
- 🌐 **Data Fetching**: Supports both URL-based data loading and direct data props
- 🔄 **Loading States**: Visual feedback during data operations

## Folder Structure

```
src/
├── components/
│   ├── common/              # Shared UI components
│   │   └── SelectionRows.tsx
│   ├── datatable/          # Data table components
│   │   ├── TableMain.tsx   # Main table component
│   │   ├── TableHead.tsx   # Table header component
│   │   ├── TableBody.tsx   # Table body component
│   │   ├── TablePagination.tsx # Pagination component
│   │   ├── TableActions.tsx # Search and filter actions
│   │   ├── TableSort.tsx   # Sortable header component
│   │   ├── FilterWrapper.tsx # Filter container
│   │   ├── FilterSelect.tsx  # Single-select filter
│   │   └── FilterMultiSelect.tsx # Multi-select filter
├── context/
│   └── bank-context/       # Bank data context provider
│       └── index.tsx
├── features/
│   └── bank/               # Bank transaction example
│       ├── components/     # Bank-specific components
│       └── index.tsx       # Bank transaction page
├── types/
│   ├── table.ts           # Data table type definitions
│   └── data.ts            # Data model type definitions
├── utils/
│   └── dataUtils.ts       # Utility functions for data manipulation
└── App.tsx                # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- pnpm (v7 or newer)

### Installation

```bash
# If you don't have pnpm installed yet:
# npm install -g pnpm
# or visit: https://pnpm.io/installation for other methods

# Then install dependencies
pnpm install
```

### Running Locally

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## How to Use the DataTable

### Basic Example

```tsx
import { DataTable } from "@/components/datatable/TableMain";
import type { ColumnDef } from "@/types/table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessor: "name",
    header: "Name",
    width: 200
  },
  {
    accessor: "email",
    header: "Email Address"
  },
  {
    accessor: "role",
    header: "User Role",
    filter: {
      type: "select"
    }
  }
];

function UserList() {
  // For simple usage with direct data
  return (
    <DataTable
      columns={columns}
      records={users}
      searchable={true}
      height={500}
    />
  );
}
```

### Advanced Example with Context

```tsx
import { DataTable } from "@/components/datatable/TableMain";
import { useTable } from "@/context/table-context";

function UserList() {
  const tableContext = useTable();
  
  return (
    <DataTable
      {...tableContext}
      columns={columns}
      data={tableContext.data}
      paginatedData={tableContext.paginatedData}
      filteredData={tableContext.filteredData}
      onRefresh={() => tableContext.fetchData()}
      withTableBorder={true}
      striped={true}
      highlightOnHover={true}
    />
  );
}
```

### Column Definition Options

```tsx
const columns: ColumnDef<MyData>[] = [
  {
    accessor: "id",          // Property to access in data object
    header: "ID",          // Display name (optional)
    width: 100,            // Width in pixels or CSS value (optional)
    textAlign: "center",   // Text alignment (optional)
    sortable: false,       // Disable sorting for this column (optional)
    filter: {              // Column filter (optional)
      type: "select",      // Filter type: "select", "multi-select", "date"
      options: [{value: "admin", label: "Admin"}] // Predefined options (optional)
    },
    render: (record) => (  // Custom renderer (optional)
      <Badge color="blue">{record.status}</Badge>
    )
  }
];
```

## License

MIT License © 2025
