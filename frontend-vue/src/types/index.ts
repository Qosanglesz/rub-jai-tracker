// ============================================================
// Shared TypeScript types / interfaces — reuse across all views
// ============================================================

// --- Auth / Users ---
export interface User {
  id: string;
  email: string;
  name: string;
}

// --- Categories ---
export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  userId: string;
}

export interface CreateCategoryDto {
  name: string;
  type: CategoryType;
}

// --- Transactions ---
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
  date: string;
  note?: string;
}

// --- Goals ---
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  userId: string;
}

export interface CreateGoalDto {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
}

// --- Analytics ---
export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}
