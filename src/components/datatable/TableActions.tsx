import { ActionIcon, Flex, TextInput, Tooltip } from "@mantine/core";
import { IconX, IconRefresh, IconSearch } from "@tabler/icons-react";
import type { FilterOption } from "@/types/table";
import React from "react";

interface TableActionsProps {
  columnFilters: Record<string, FilterOption[] | string>;
  clearAllFilters: () => void;
  onRefresh?: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  search?: string;
  setSearch?: (value: string) => void;
}

export function TableActions({ 
  columnFilters, 
  clearAllFilters, 
  onRefresh,
  searchable = false,
  searchPlaceholder = "Search...",
  search = "",
  setSearch
}: TableActionsProps) {
  return (
    <Flex justify="space-between" align="center" wrap="wrap" gap="md">      
      {searchable && setSearch && (
        <TextInput
          placeholder={searchPlaceholder}
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
            setSearch(event.currentTarget.value)
          }
          style={{ flexGrow: 1, maxWidth: "400px" }}
          radius="md"
        />
      )}
      
      <Flex gap="xs" align="center">
      {Object.keys(columnFilters).length > 0 && (
        <Tooltip label="Clear all filters" withArrow position="top">
          <ActionIcon
            variant="light"
            color="red"
            size="lg"
            radius="md"
            onClick={clearAllFilters}
          >
            <IconX size={18} stroke={3} />
          </ActionIcon>
        </Tooltip>
      )}

      <Tooltip label="Refresh results" withArrow position="top">
        <ActionIcon 
          variant="light" 
          color="blue" 
          size="lg" 
          radius="md"
          onClick={onRefresh}
        >
          <IconRefresh size={18} />
        </ActionIcon>
      </Tooltip>
    </Flex>
    </Flex>
  );
}
