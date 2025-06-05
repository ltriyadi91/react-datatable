import { Select, Group } from '@mantine/core';
import type { FilterOption } from '../../types/table';

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  options: FilterOption[];
  placeholder?: string;
}

export function FilterSelect({ 
  value, 
  onChange, 
  onClear, 
  options, 
  placeholder 
}: FilterSelectProps) {
  return (
    <Group gap="xs" wrap="nowrap">
      <Select
        placeholder={placeholder || 'Select...'}
        value={value}
        onChange={(newValue) => {
          if (newValue === null) {
            onClear();
          } else {
            onChange(newValue);
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
