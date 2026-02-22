/**
 * useCategories — TanStack Query composable
 *
 * Provides:
 *   categories      — all user categories (cached, auto-refreshed)
 *   incomeCategories / expenseCategories — computed filtered lists
 *   isLoading       — true while first fetch is in progress
 *   createCategory  — mutation to POST /categories
 *   deleteCategory  — mutation to DELETE /categories/:id
 *
 * Cache key: ['categories']
 * Stale time: 5 minutes (categories rarely change)
 */
import { computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import apiClient from '../api/client';
import type { Category, CreateCategoryDto } from '../types';

const QUERY_KEY = ['categories'] as const;
const STALE_MS = 5 * 60 * 1000; // 5 min

export function useCategories() {
  const queryClient = useQueryClient();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery<Category[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data;
    },
    staleTime: STALE_MS,
  });

  const categories = computed(() => data.value ?? []);
  const incomeCategories = computed(() => categories.value.filter((c) => c.type === 'INCOME'));
  const expenseCategories = computed(() => categories.value.filter((c) => c.type === 'EXPENSE'));

  // ── Create ─────────────────────────────────────────────────────────────────
  const { mutateAsync: createCategory, isPending: isCreating } = useMutation({
    mutationFn: (dto: CreateCategoryDto) => apiClient.post('/categories', dto),
    onSuccess: (_, dto) => {
      toast.success(`Category "${dto.name}" created!`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Failed to create category');
    },
  });

  // ── Delete ─────────────────────────────────────────────────────────────────
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Failed to delete category');
    },
  });

  return {
    categories,
    incomeCategories,
    expenseCategories,
    isLoading,
    isError,
    createCategory,
    isCreating,
    deleteCategory,
    isDeleting,
  };
}
