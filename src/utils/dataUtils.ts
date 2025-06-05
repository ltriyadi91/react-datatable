import type { DataRecord } from '../types/table';
import { orderBy } from 'lodash';

// Format currency
export const formatCurrency = (value: number | null): string => {
  if (value === null) return '';
  return `$${value.toFixed(2)}`;
};

// Get color for category
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'Health Care': 'green',
    'Other Services': 'blue',
    'Payment/Credit': 'cyan',
    'Merchandise': 'violet',
    'Phone/Cable': 'orange',
    'Fee/Interest Charge': 'red',
    'Other': 'gray'
  };
  return colorMap[category] || 'blue';
};

// Filter and sort data utility
export const filterAndSortData = <T extends DataRecord>(
  data: T[], 
  search: string, 
  sortBy: string | null, 
  reverseSortDirection: boolean
): T[] => {
  if (!data) return [];
  
  // Filter data based on search
  const filtered = data.filter(item => {
    if (!search) return true;
    
    // Assuming common fields - adjust as needed for your specific data
    const description = String(item.description || '');
    const category = String(item.category || '');
    const searchLower = search.toLowerCase();
    
    return description.toLowerCase().includes(searchLower) ||
           category.toLowerCase().includes(searchLower);
  });
  
  if (!sortBy) return filtered;
  
  // Sort data based on sortBy field using lodash
  return orderBy(
    filtered,
    // Create a custom iteratee that handles null values by sorting them last
    [(item: T) => {
      const value = item[sortBy];
      // Return a special value for null to always sort it last
      if (value === null) return reverseSortDirection ? Infinity : -Infinity;
      return value;
    }],
    // Direction based on reverseSortDirection
    [reverseSortDirection ? 'desc' : 'asc']
  );
};

// Get category counts utility
export const getCategoryCounts = <T extends DataRecord>(data: T[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  if (data) {
    data.forEach(item => {
      const category = item.category as string;
      if (category) {
        counts[category] = (counts[category] || 0) + 1;
      }
    });
  }
  return counts;
};

// Paginate data utility
export const paginateData = <T extends DataRecord>(
  data: T[], 
  page: number, 
  recordsPerPage: number
): T[] => {
  const start = (page - 1) * recordsPerPage;
  const end = start + recordsPerPage;
  return data.slice(start, end);
};
