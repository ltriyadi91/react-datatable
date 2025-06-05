import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { chain, filter, isEmpty, every, some, toString } from "lodash";
import { filterAndSortData, getCategoryCounts } from "@/utils/dataUtils";
import type { TableContextProps, TableProviderProps } from "./types";
import type { DataRecord, FilterOption } from "@/types/table";

// Helper function to get URL query params
const getQueryParams = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const columnFilters: Record<string, FilterOption[] | string> = {};
    
    // Process regular params
    const page = Number(params.get("page") || "1");
    const pageSize = Number(params.get("pageSize") || "10"); // Default to 10 records per page
    const search = params.get("search") || "";
    const sortBy = params.get("sortBy") || null;
    const reverseSortDirection = params.get("sort") === "desc";
    
    // Process filter params (they're prefixed with 'filter_')
    for (const [key, value] of params.entries()) {
      if (key.startsWith('filter_')) {
        const filterName = key.substring(7); // Remove 'filter_' prefix
        
        // Handle multi-select filters (comma-separated values)
        if (value.includes(',')) {
          const values = value.split(',');
          columnFilters[filterName] = values.map(v => ({
            value: v,
            label: v
          }));
        } else {
          // Handle single text filters
          columnFilters[filterName] = value;
        }
      }
    }
    
    return {
      page,
      pageSize,
      search,
      sortBy,
      reverseSortDirection,
      columnFilters
    };
  } catch (err) {
    // If there's any error in parsing, return defaults
    console.warn("Error parsing URL parameters, using defaults", err);
    return {
      page: 1,
      pageSize: 10, // Default page size
      search: "",
      sortBy: null,
      reverseSortDirection: false,
      columnFilters: {}
    };
  }
};

// Helper function to update URL query params
const updateQueryParams = (params: Record<string, string | number | boolean | object>) => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Clean existing parameters if updating filters
  if ('columnFilters' in params) {
    // Remove all existing filter params (they start with 'filter_')
    for (const [key] of Array.from(urlParams.entries())) {
      if (key.startsWith('filter_')) {
        urlParams.delete(key);
      }
    }
  }
  
  // Update URL parameters
  Object.entries(params).forEach(([key, value]) => {
    // Remove params with empty values
    if (value === null || value === undefined || value === "") {
      urlParams.delete(key);
    }
    // Handle column filters using a simpler, more readable format
    else if (key === "columnFilters" && typeof value === "object") {
      const filterObj = value as Record<string, FilterOption[] | string>;
      
      // Clear old filter params
      Object.keys(filterObj).forEach(filterKey => {
        const filterValue = filterObj[filterKey];
        
        // Skip empty filters
        if (!filterValue || 
            (Array.isArray(filterValue) && filterValue.length === 0) ||
            (typeof filterValue === "string" && !filterValue)) {
          return;
        }
        
        // Handle multi-select filters (array of options)
        if (Array.isArray(filterValue)) {
          // Join values with commas for readability
          const valueStr = filterValue
            .map(option => option.value)
            .join(",");
            
          if (valueStr) {
            urlParams.set(`filter_${filterKey}`, valueStr);
          }
        } 
        // Handle text filters (strings)
        else if (typeof filterValue === "string") {
          urlParams.set(`filter_${filterKey}`, filterValue);
        }
      });
    }
    // Handle sort direction
    else if (key === "reverseSortDirection") {
      urlParams.set("sort", value ? "desc" : "asc");
    }
    // Handle other parameters
    else {
      urlParams.set(key, String(value));
    }
  });
  
  // Clean up the URL by removing any empty parameters
  for (const [key, value] of Array.from(urlParams.entries())) {
    if (!value) {
      urlParams.delete(key);
    }
  }
  
  // Build clean URL string
  const queryString = urlParams.toString();
  const newUrl = queryString ? 
    `${window.location.pathname}?${queryString}` : 
    window.location.pathname;
  
  // Update URL without reloading the page
  window.history.pushState({ path: newUrl }, "", newUrl);
};

// Create a shared reference for direct state setters that can be accessed from hooks outside the provider
const stateSetters = {
  setPageSize: null as ((size: number) => void) | null,
  setInternalPage: null as ((page: number) => void) | null,
};

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
  recordsPerPage: propsRecordsPerPage = 10,
  initialPage = 1,
  onPageChange,
}: TableProviderProps<T>) {

  // Initialize state from URL query parameters
  const initialParams = useMemo(() => getQueryParams(), []); 
  
  // State for data and loading
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(propRecords ? false : true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination - initialize from URL if available
  const [internalPage, setInternalPage] = useState(initialParams.page || initialPage);
  const page = onPageChange ? initialPage : internalPage;

  // State for page size - initialize from URL or props
  const [pageSize, setPageSize] = useState<number>(() => {
    const params = getQueryParams();
    return params.pageSize || propsRecordsPerPage || 10;
  });

  // Store the state setters in the shared reference so external hooks can access them
  useEffect(() => {
    stateSetters.setPageSize = setPageSize;
    stateSetters.setInternalPage = setInternalPage;
    
    return () => {
      stateSetters.setPageSize = null;
      stateSetters.setInternalPage = null;
    };
  }, []);

  // State for sorting - initialize from URL
  const [sortBy, setSortBy] = useState<string | null>(initialParams.sortBy);
  const [reverseSortDirection, setReverseSortDirection] = useState(initialParams.reverseSortDirection);

  // State for search - initialize from URL
  const [searchValue, setSearchValue] = useState(initialParams.search || "");

  // State for column filters - initialize from URL
  const [columnFilters, setColumnFilters] = useState<Record<string, FilterOption[] | string>>(initialParams.columnFilters || {});

  // Set a filter for a specific column
  const setColumnFilter = useCallback(
    (columnAccessor: string, value: FilterOption[] | string) => {
      setColumnFilters((prev) => {
        const updatedFilters = { ...prev };
        if (
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "string" && value === "")
        ) {
          delete updatedFilters[columnAccessor];
        } else {
          updatedFilters[columnAccessor] = value;
        }
        
        // Reset to first page when filtering
        setInternalPage(1);
        
        // Update URL with new filters
        updateQueryParams({ 
          columnFilters: updatedFilters,
          page: 1 
        });
        
        return updatedFilters;
      });
    },
    []
  );

  // Clear filter for a specific column
  const clearColumnFilter = useCallback((columnAccessor: string) => {
    setColumnFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnAccessor];
      
      // Update URL params when clearing a filter
      updateQueryParams({ columnFilters: newFilters });
      
      return newFilters;
    });
  }, []);

  // Clear all column filters
  const clearAllFilters = useCallback(() => {
    // Clear all filters in state
    setColumnFilters({});
    setSearchValue("");
    setInternalPage(1);
    
    // Update URL by removing all filter params
    updateQueryParams({
      columnFilters: {}, 
      search: "", 
      page: 1
    });
  }, []);

  // State for selected rows
  const [selection, setSelection] = useState<string[]>([]);

  // Handle browser navigation events (back/forward)
  useEffect(() => {
    const handleNavigation = () => {
      const params = getQueryParams();
      
      // Update state from URL without triggering URL updates
      setInternalPage(params.page);
      setPageSize(params.pageSize || 10);
      setSortBy(params.sortBy);
      setReverseSortDirection(params.reverseSortDirection);
      setSearchValue(params.search);
      setColumnFilters(params.columnFilters);
    };
    
    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleNavigation);
    
    // Cleanup
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

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

  // Update page with URL query param sync
  const setPage = useCallback((newPage: number) => {
    // Only update if using internal page management
    if (!onPageChange) {
      setLoading(true);
      
      // Use setTimeout to simulate network delay and ensure UI feedback
      setTimeout(() => {
        setInternalPage(newPage);
        // Update URL query parameters
        updateQueryParams({ page: newPage });
        setLoading(false);
      }, 300); // Short delay for better UX
    } else if (onPageChange) {
      onPageChange(newPage);
    }
  }, [onPageChange]);

  // Handle search with URL query param sync
  const handleSearch = useCallback((searchTerm: string) => {
    // Update state
    setSearchValue(searchTerm);
    setInternalPage(1);
    
    // Update URL query parameters
    updateQueryParams({ search: searchTerm, page: 1 });
  }, []);

  // Handle sort with URL query param sync
  const handleSort = useCallback((field: string) => {
    // Show loading state when sorting
    setLoading(true);
    
    // Use setTimeout to simulate network delay and ensure UI feedback
    setTimeout(() => {
      // Toggle direction if sorting by same field
      const reversed = field === sortBy ? !reverseSortDirection : false;
      setReverseSortDirection(reversed);
      setSortBy(field);
      
      // Update URL query parameters
      updateQueryParams({ 
        sortBy: field, 
        reverseSortDirection: reversed 
      });
      
      // Hide loading after sort is processed
      setLoading(false);
    }, 300); // Short delay for better UX
  }, [sortBy, reverseSortDirection]);

  // Helper function to get unique values for a column
  const getUniqueValuesForColumn = useCallback(
    (columnAccessor: string): FilterOption[] => {
      if (!data || data.length === 0) return [];
      
      // Process everything in a single chain for better performance
      return chain(data)
        // Extract values from the specified column
        .map((item: DataRecord) => toString(item[columnAccessor] || ""))
        // Filter out empty values
        .filter(Boolean)
        // Get unique values only
        .uniq()
        // Sort alphabetically
        .sortBy()
        // Convert to FilterOption format
        .map((value: string) => ({ value, label: value }))
        // Execute the chain and return the result
        .value();
    },
    [data]
  );

  // Apply all filters and sort data
  const filteredData = useMemo(() => {
    // Start with data filtered by search term
    let result = filterAndSortData(data, searchValue, sortBy, reverseSortDirection);

    // Apply column filters if any exist
    if (!isEmpty(columnFilters)) {
      // Using lodash's filter for better performance with complex objects
      result = filter(result, item => {
        // Use lodash's every to check if all filters are satisfied
        return every(columnFilters, (filterValue, accessor) => {
          // Get the value to filter and ensure it's a string
          const itemValue = toString(item[accessor] || "").toLowerCase();
          
          if (Array.isArray(filterValue)) {
            // For multi-select filters, if no options selected, pass all items
            if (filterValue.length === 0) return true;
            
            // Otherwise check if any selected option matches
            return some(filterValue, option => 
              itemValue.includes(option.value.toLowerCase())
            );
          } else {
            // For simple text filters
            return itemValue.includes(toString(filterValue).toLowerCase());
          }
        });
      });
    }
    
    return result;
  }, [data, searchValue, sortBy, reverseSortDirection, columnFilters]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    const start = (internalPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, internalPage, pageSize]);

  // Calculate pagination summary
  const paginationSummary = useMemo(() => {
    const start = (internalPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, filteredData.length);
    const totalPages = Math.ceil(filteredData.length / pageSize);
    
    return {
      start: filteredData.length === 0 ? 0 : start,
      end,
      totalPages,
      totalRecords: filteredData.length
    };
  }, [filteredData, internalPage, pageSize]);

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

  // Context value combining all state and handlers
  const contextValue = useMemo(() => ({
    // Data
    data,
    loading,
    error,
    
    // Pagination
    page,
    setPage,
    recordsPerPage: pageSize, // This comes from the URL or props
    totalPages: paginationSummary.totalPages,
    paginatedData,
    
    // Sorting
    sortBy,
    reverseSortDirection,
    handleSort,

    // Search
    search: searchValue,
    setSearch: handleSearch,

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
  }), [
    data, loading, error, page, setPage, pageSize,
    paginationSummary.totalPages, paginatedData, sortBy, reverseSortDirection, 
    handleSort, searchValue, handleSearch, columnFilters, setColumnFilter,
    clearColumnFilter, clearAllFilters, selection, toggleRow, toggleAll,
    selectedRowsData, categoryCount, filteredData, getUniqueValuesForColumn
  ]);

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

// Create a utility hook to handle page size changes with direct state connection
// This allows TableMain and other components to change the page size
export function usePageSizeControl() {
  // Get the current recordsPerPage from context
  const { recordsPerPage } = useTable();
  
  return {
    setPageSize: (pageSize: number) => {
      // Update URL query parameters
      updateQueryParams({ pageSize, page: 1 });
      
      // Directly update state using the shared reference
      if (stateSetters.setPageSize) {
        stateSetters.setPageSize(pageSize);
      }
      
      // Reset to page 1
      if (stateSetters.setInternalPage) {
        stateSetters.setInternalPage(1);
      }
    },
    recordsPerPage
  };
}

// Export the provider and hook as named exports
export { BankProvider, useTable };
