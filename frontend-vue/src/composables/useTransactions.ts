/**
 * useTransactions — TanStack Query composable
 *
 * Provides:
 *   transactions    — monthly transaction list (cached per month/year)
 *   isLoading       — true while first fetch in progress
 *   createTransaction — mutation to POST /transactions
 *   deleteTransaction — mutation to DELETE /transactions/:id
 *
 * Cache key: ['transactions', year, month]
 * Stale time: 1 minute (may update frequently)
 */
import { type Ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import apiClient from '../api/client';
import type { Transaction, CreateTransactionDto } from '../types';

const STALE_MS = 60 * 1000; // 1 min

export function useTransactions(year: Ref<number>, month: Ref<number>) {
  const queryClient = useQueryClient();

  // Dynamic cache key reacts to year/month changes automatically
  const queryKey = () => ['transactions', year.value, month.value] as const;

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery<Transaction[]>({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await apiClient.get('/transactions/monthly', {
        params: { year: year.value, month: month.value },
      });
      return res.data;
    },
    staleTime: STALE_MS,
  });

  const transactions = () => data.value ?? [];

  // ── Create ─────────────────────────────────────────────────────────────────
  const { mutateAsync: createTransaction, isPending: isCreating } = useMutation({
    mutationFn: (dto: CreateTransactionDto) => apiClient.post('/transactions', dto),
    onSuccess: () => {
      toast.success('Transaction saved!');
      // Invalidate current month's transactions and analytics so Dashboard refreshes too
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Failed to save transaction');
    },
  });

  // ── Delete ─────────────────────────────────────────────────────────────────
  const { mutateAsync: deleteTransaction, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/transactions/${id}`),
    onSuccess: () => {
      toast.success('Transaction deleted');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: () => {
      toast.error('Failed to delete transaction');
    },
  });

  return {
    data,
    transactions,
    isLoading,
    isError,
    createTransaction,
    isCreating,
    deleteTransaction,
    isDeleting,
  };
}
