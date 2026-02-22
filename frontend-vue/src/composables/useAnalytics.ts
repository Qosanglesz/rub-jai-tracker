/**
 * useAnalytics — TanStack Query composable
 *
 * Provides:
 *   summary         — DashboardSummary for the selected month/year
 *   recentTransactions — top 5 transactions for the quick dashboard list
 *   isLoading       — true while either query is loading
 *
 * Cache key: ['analytics', year, month]
 * Stale time: 1 minute
 */
import type { Ref } from 'vue';
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import apiClient from '../api/client';
import type { DashboardSummary, Transaction } from '../types';

const STALE_MS = 60 * 1000;

const DEFAULT_SUMMARY: DashboardSummary = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  transactionCount: 0,
};

export function useAnalytics(year: Ref<number>, month: Ref<number>) {
  // ── Summary query ─────────────────────────────────────────────────────────
  const summaryQuery = useQuery<DashboardSummary>({
    queryKey: () => ['analytics', 'summary', year.value, month.value],
    queryFn: async () => {
      const res = await apiClient.get('/analytics/summary', {
        params: { year: year.value, month: month.value },
      });
      return res.data;
    },
    staleTime: STALE_MS,
  });

  // ── Recent transactions query ──────────────────────────────────────────────
  const txnQuery = useQuery<Transaction[]>({
    queryKey: () => ['analytics', 'recent', year.value, month.value],
    queryFn: async () => {
      const res = await apiClient.get('/transactions/monthly', {
        params: { year: year.value, month: month.value },
      });
      return res.data;
    },
    staleTime: STALE_MS,
  });

  const summary = computed(() => summaryQuery.data.value ?? DEFAULT_SUMMARY);
  const recentTransactions = computed(() => (txnQuery.data.value ?? []).slice(0, 5));
  const isLoading = computed(() => summaryQuery.isLoading.value || txnQuery.isLoading.value);

  return { summary, recentTransactions, isLoading };
}
