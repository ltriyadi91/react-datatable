import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  components: {
    Table: {
      styles: {
        root: {
          '& thead tr th': {
            fontWeight: 600,
            color: 'var(--mantine-color-blue-filled)',
            backgroundColor: 'var(--mantine-color-blue-light)',
          },
        },
      },
    },
  },
});
