import type { DataRecord } from './table';

export interface BankTransaction extends DataRecord {
  transactionDate: string;
  description: string;
  category: string;
  debit: number | null;
  credit: number | null;
}
