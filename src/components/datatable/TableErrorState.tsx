import { Card, Center, Stack, Text, ActionIcon } from '@mantine/core';
import { IconInfoCircle, IconRefresh } from '@tabler/icons-react';

interface ErrorStateProps {
  error: string;
  height?: number | string;
  onRetry?: () => void;
}

export function TableErrorState({ error, height, onRetry }: ErrorStateProps) {
  return (
    <Card withBorder shadow="sm" p="xl" radius="md" bg="red.0">
      <Center h={height || 400}>
        <Stack align="center" gap="md">
          <IconInfoCircle size={40} color="var(--mantine-color-red-6)" />
          <Text size="lg" fw={500} c="red.7">
            {error}
          </Text>
          {onRetry && (
            <ActionIcon 
              variant="light" 
              color="blue"
              onClick={onRetry}
            >
              <IconRefresh size="1.1rem" />
            </ActionIcon>
          )}
        </Stack>
      </Center>
    </Card>
  );
}
