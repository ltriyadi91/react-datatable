import { MultiSelect, Group } from '@mantine/core';
import type { FilterOption } from '@/types/table';

interface FilterMultiSelectProps {
  value: FilterOption[];
  onChange: (value: FilterOption[]) => void;
  onClear: () => void;
  options: FilterOption[];
  placeholder?: string;
}

export function FilterMultiSelect({ 
  value, 
  onChange, 
  onClear, 
  options, 
  placeholder 
}: FilterMultiSelectProps) {
  // Ensure value is always an array (could be empty if no filters applied)
  const safeValue = Array.isArray(value) ? value : [];
  
  return (
    <Group gap="xs" wrap="nowrap">
      <MultiSelect
        placeholder={placeholder || 'Select...'}
        value={safeValue.map(option => option.value)}
        onChange={(newValues: string[]) => {
          if (newValues.length === 0) {
            onClear();
          } else {
            // Map the selected values back to FilterOption objects
            const selectedOptions = options.filter(option => 
              newValues.includes(option.value)
            );
            onChange(selectedOptions);
          }
        }}
        data={options.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        clearable
        size="xs"
        styles={{ root: { minWidth: 200 } }}
      />
    </Group>
  );
}
