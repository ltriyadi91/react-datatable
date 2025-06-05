import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";
import type { TableContextProps, TableProviderProps } from "./types";

import type { DataRecord, FilterOption } from "@/types/table";
import {
  filterAndSortData,
  getCategoryCounts,
  paginateData,
} from "@/utils/dataUtils";

const TableContext = createContext<TableContextProps>({
  // Data
  data: [],
  loading: false,
  error: null,

  // Pagination
  page: 1,
  setPage: () => {},
  recordsPerPage: 10,
  totalPages: 0,
  paginatedData: [],

  // Sorting
  sortBy: null,
  reverseSortDirection: false,
  handleSort: () => {},

  // Search
  search: "",
  setSearch: () => {},

  // Column Filters
  columnFilters: {},
  setColumnFilter: () => {},
  clearColumnFilter: () => {},
  clearAllFilters: () => {},

  // Selection
  selection: [],
  toggleRow: () => {},
  toggleAll: () => {},
  selectedRowsData: [],

  // Filters
  categoryCount: {},
  filteredData: [],
  getUniqueValuesForColumn: () => [],
});

function BankProvider<T extends DataRecord = DataRecord>({
  children,
  dataUrl,
  records: propRecords,
  recordsPerPage = 10,
  initialPage = 1,
  onPageChange,
}: TableProviderProps<T>) {
  // State for data and loading
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(propRecords ? false : true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [internalPage, setInternalPage] = useState(initialPage);
  const page = onPageChange ? initialPage : internalPage;

  const setPage = useCallback(
    (newPage: number) => {
      // Show loading state when page changes
      setLoading(true);
      
      // Use setTimeout to simulate network delay if needed
      setTimeout(() => {
        if (onPageChange) {
          onPageChange(newPage);
        } else {
          setInternalPage(newPage);
        }
        
        // Hide loading after page change is processed
        setLoading(false);
      }, 300); // Short delay for better UX
    },
    [onPageChange]
  );

  // State for sorting
  const [sortBy, setSortBy] = useState<string | null>("id");
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  // State for search
  const [search, setSearch] = useState("");

  // State for column filters
  const [columnFilters, setColumnFilters] = useState<
    Record<string, FilterOption[] | string>
  >({});

  // Set a filter for a specific column
  const setColumnFilter = useCallback(
    (columnAccessor: string, value: FilterOption[] | string) => {
      setColumnFilters((prev) => ({
        ...prev,
        [columnAccessor]: value,
      }));
    },
    []
  );

  // Clear filter for a specific column
  const clearColumnFilter = useCallback((columnAccessor: string) => {
    setColumnFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnAccessor];
      return newFilters;
    });
  }, []);

  // Clear all column filters
  const clearAllFilters = useCallback(() => {
    setColumnFilters({});
  }, []);

  // State for selected rows
  const [selection, setSelection] = useState<string[]>([]);

  // Use records from props if provided
  useEffect(() => {
    if (propRecords) {
      setData(propRecords);
    }
  }, [propRecords]);

  // Fetch data from JSON file if dataUrl is provided
  useEffect(() => {
    if (!dataUrl || propRecords) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(dataUrl);
        const jsonData = await response.json();

        const responseData = jsonData.accounts || jsonData;

        setTimeout(() => {
          setData(responseData);
          setLoading(false);
        }, 800);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataUrl, propRecords]);

  // Handle sort
  const handleSort = useCallback(
    (field: string) => {
      // Show loading state when sorting
      setLoading(true);
      
      // Use setTimeout to simulate network delay and ensure UI feedback
      setTimeout(() => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        
        // Hide loading after sort is processed
        setLoading(false);
      }, 300); // Short delay for better UX
    },
    [sortBy, reverseSortDirection]
  );

  // Helper function to get unique values for a column
  const getUniqueValuesForColumn = useCallback(
    (columnAccessor: string): FilterOption[] => {
      if (!data || data.length === 0) return [];

      const uniqueValues = new Set<string>();

      data.forEach((item) => {
        const value = String(item[columnAccessor] || "");
        if (value) uniqueValues.add(value);
      });

      // Convert to FilterOption[] format
      return Array.from(uniqueValues)
        .sort()
        .map((value) => ({ value, label: value }));
    },
    [data]
  );

  // Apply all filters and sort data
  const filteredData = useMemo(() => {
    // Start with data filtered by search term
    let result = filterAndSortData(data, search, sortBy, reverseSortDirection);

    // Apply column filters
    if (Object.keys(columnFilters).length > 0) {
      result = result.filter((item) => {
        // Item must match all column filters to be included
        return Object.entries(columnFilters).every(
          ([accessor, filterValue]) => {
            const itemValue = String(item[accessor] || "").toLowerCase();

            // Handle different filter types
            if (Array.isArray(filterValue)) {
              // Multi-select filter
              if (filterValue.length === 0) return true; // No filter applied
              return filterValue.some((option) =>
                itemValue.includes(option.value.toLowerCase())
              );
            } else {
              // Text filter
              return itemValue.includes(String(filterValue).toLowerCase());
            }
          }
        );
      });
    }

    return result;
  }, [data, search, sortBy, reverseSortDirection, columnFilters]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    return paginateData(filteredData, page, recordsPerPage);
  }, [filteredData, page, recordsPerPage]);

  // Total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / recordsPerPage);
  }, [filteredData, recordsPerPage]);

  // Toggle row selection
  const toggleRow = useCallback((id: string) => {
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }, []);

  // Toggle all rows
  const toggleAll = useCallback(() => {
    setSelection((current) =>
      current.length === paginatedData.length
        ? []
        : paginatedData.map((item) => item.id)
    );
  }, [paginatedData]);

  // Selected rows data
  const selectedRowsData = useMemo(() => {
    return data.filter((item) => selection.includes(item.id));
  }, [data, selection]);

  // Get category counts for the badge
  const categoryCount = useMemo(() => {
    return getCategoryCounts(filteredData);
  }, [filteredData]);

  // Context value
  const contextValue = {
    // Data
    data,
    loading,
    error,

    // Pagination
    page,
    setPage,
    recordsPerPage,
    totalPages,
    paginatedData,

    // Sorting
    sortBy,
    reverseSortDirection,
    handleSort,

    // Search
    search,
    setSearch,

    // Column Filters
    columnFilters,
    setColumnFilter,
    clearColumnFilter,
    clearAllFilters,

    // Selection
    selection,
    toggleRow,
    toggleAll,
    selectedRowsData,

    // Filters
    categoryCount,
    filteredData,
    getUniqueValuesForColumn,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}

function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
}

export { BankProvider, useTable };
