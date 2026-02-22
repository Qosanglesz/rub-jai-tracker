// Transaction types
import type { Category } from './category.types';

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO date string
  note?: string;
  categoryId: string;
  userId: string;
  category?: Category;
}

export interface CreateTransactionDto {
  amount: number;
  categoryId: string;
  date: string; // YYYY-MM-DD
  note?: string;
}
