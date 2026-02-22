/**
 * useGoals — TanStack Query composable
 *
 * Provides:
 *   goals           — all user savings goals (cached)
 *   isLoading       — true while first fetch in progress
 *   createGoal      — mutation to POST /goals
 *   addFunds        — mutation to PATCH /goals/:id (update currentAmount)
 *   deleteGoal      — mutation to DELETE /goals/:id
 */
import { computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import apiClient from '../api/client';
import type { Goal, CreateGoalDto } from '../types';

const QUERY_KEY = ['goals'] as const;
const STALE_MS = 2 * 60 * 1000; // 2 min

export function useGoals() {
  const queryClient = useQueryClient();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery<Goal[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/goals');
      return res.data;
    },
    staleTime: STALE_MS,
  });

  const goals = computed(() => data.value ?? []);

  // ── Create Goal ────────────────────────────────────────────────────────────
  const { mutateAsync: createGoal, isPending: isCreating } = useMutation({
    mutationFn: (dto: CreateGoalDto) => apiClient.post('/goals', dto),
    onSuccess: (_, dto) => {
      toast.success(`Goal "${dto.name}" created!`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Failed to create goal');
    },
  });

  // ── Add Funds to Goal ──────────────────────────────────────────────────────
  const { mutateAsync: addFunds, isPending: isAddingFunds } = useMutation({
    mutationFn: ({ id, currentAmount }: { id: string; currentAmount: number }) =>
      apiClient.patch(`/goals/${id}`, { currentAmount }),
    onSuccess: () => {
      toast.success('Funds added!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Failed to add funds');
    },
  });

  // ── Delete Goal ────────────────────────────────────────────────────────────
  const { mutateAsync: deleteGoal, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/goals/${id}`),
    onSuccess: () => {
      toast.success('Goal deleted');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => {
      toast.error('Failed to delete goal');
    },
  });

  return {
    goals,
    isLoading,
    isError,
    createGoal,
    isCreating,
    addFunds,
    isAddingFunds,
    deleteGoal,
    isDeleting,
  };
}
