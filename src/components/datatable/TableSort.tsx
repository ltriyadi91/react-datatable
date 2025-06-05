
import { Table, Center, rem, Flex, Box } from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import type { ThProps } from '@/types/table';

// Sortable header component
export function TableSort({ children, reversed, sorted, sortable = true }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th>
      <Flex align="center">
        <Box fw={500} size="sm">
          {children}
        </Box>
        {sortable && (
          <Center style={{ width: rem(20), height: rem(20) }}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        )}
      </Flex>
    </Table.Th>
  );
}
