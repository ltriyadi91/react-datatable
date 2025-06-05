import type { FilterOption, ColumnDef, DataRecord } from '@/types/table';

import { Box, Popover } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconFilter, IconCalendar } from '@tabler/icons-react';
import { FilterSelect } from './FilterSelect';
import { FilterMultiSelect } from './FilterMultiSelect';

interface FilterWrapperProps<T extends DataRecord = DataRecord> {
  column: ColumnDef<T>;
  value: string | FilterOption[];
  onChange: (value: string | FilterOption[]) => void;
  onClear: () => void;
  getUniqueValues: () => FilterOption[];
  data: T[];
}

export function FilterWrapper<T extends DataRecord = DataRecord>({
  column,
  value,
  onChange,
  onClear,
  getUniqueValues,
}: FilterWrapperProps<T>) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const filterType = column.filter?.type || 'none';
  const isActive = Array.isArray(value) ? value.length > 0 : Boolean(value);

  // Don't render anything if filtering is disabled for this column
  if (filterType === 'none' || column.filter?.enabled === false) {
    return null;
  }

  // Component to render based on filter type
  const FilterComponent = () => {
    switch (filterType) {
      case 'select':
        return (
          <FilterSelect
            value={value as string}
            onChange={onChange as (value: string) => void}
            onClear={onClear}
            options={column.filter?.options || getUniqueValues()}
            placeholder={column.filter?.placeholder || `Select ${column.header}`}
          />
        );
      case 'multi-select':
        return (
          <FilterMultiSelect
            value={value as FilterOption[]}
            onChange={onChange as (value: FilterOption[]) => void}
            onClear={onClear}
            options={column.filter?.options || getUniqueValues()}
            placeholder={column.filter?.placeholder || `Select ${column.header}`}
          />
        );
      case 'date': {
        // For date picker, we need a custom wrapper since onChange types differ
        const dateValue = value ? new Date(value as string) : null;
        return (
          <DatePickerInput
            value={dateValue}
            onChange={(date) => {
              // Convert Date to string format expected by the filter system
              if (date) {
                (onChange as (value: string) => void)(date.toString());
              } else {
                onClear();
              }
            }}
            leftSection={<IconCalendar size={16} />}
            placeholder={column.filter?.placeholder || `Filter by date`}
            clearable
            valueFormat="MMM DD, YYYY"
            mb="xs"
            styles={{ root: { minWidth: '220px' } }}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <Box style={{ display: 'inline-flex', marginLeft: 8 }}>
      <Popover
        opened={opened}
        onClose={close}
        position="bottom"
        shadow="md"
        withinPortal
      >
        <Popover.Target>
          <IconFilter
            size={16}
            style={{ 
              cursor: 'pointer', 
              opacity: isActive ? 1 : 0.5,
              color: isActive ? '#228be6' : 'inherit' 
            }}
            onClick={toggle}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <FilterComponent />
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
