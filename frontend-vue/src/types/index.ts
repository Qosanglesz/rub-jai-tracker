// Barrel re-export — import from this file for convenience:
// import type { Category, Transaction } from '@/types'
export type { User, LoginDto, RegisterDto } from './auth.types';
export type { Category, CategoryType, CreateCategoryDto } from './category.types';
export type { Transaction, CreateTransactionDto } from './transaction.types';
export type { Goal, CreateGoalDto, AddFundsDto } from './goal.types';
export type { DashboardSummary } from './analytics.types';
