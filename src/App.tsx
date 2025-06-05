import {
  AppShell,
  Container,
  MantineProvider,
  Text,
} from "@mantine/core";

import { BankProvider } from "@/context/bank-context";
import { theme } from "@/theme";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import BankApp from "./features/bank";

function App() {
  return (
    <MantineProvider theme={theme}>
      <AppShell>
        <AppShell.Main pt={80}>
          <AppShell.Header p="sm" bg="blue.7">
            <Container size="xl">
              <Text fz="xl" fw={800} c="white">
                Data Table Components Usage
              </Text>
            </Container>
          </AppShell.Header>
          <BankProvider dataUrl="/src/data/bank.json" recordsPerPage={10}>
            <BankApp />
          </BankProvider>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
