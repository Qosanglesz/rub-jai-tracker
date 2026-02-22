<template>
  <div class="space-y-6">
    <PageHeader title="Categories" subtitle="Manage your income and expense categories">
      <template #action>
        <button @click="openAddModal()"
          class="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors gap-2">
          <PlusIcon class="h-4 w-4" />New Category
        </button>
      </template>
    </PageHeader>

    <div v-if="isLoading" class="flex justify-center items-center h-40">
      <LoaderIcon class="h-8 w-8 text-blue-500 animate-spin" />
    </div>

    <!-- First-run tip -->
    <div v-if="!isLoading && categories.length === 0"
      class="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
      <InfoIcon class="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
      <div>
        <p class="text-sm font-semibold text-blue-900 mb-1">Getting Started</p>
        <p class="text-sm text-blue-700">
          Create categories first before adding transactions. E.g. Income: "Salary" — Expense: "Food", "Rent".
        </p>
      </div>
    </div>

    <div v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Income -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-green-50">
          <div class="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
            <TrendingUpIcon class="h-4 w-4" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-gray-800">Income Categories</h2>
            <p class="text-xs text-gray-500">{{ incomeCategories.length }} categories</p>
          </div>
        </div>
        <div v-if="incomeCategories.length === 0" class="text-center py-10 px-4">
          <p class="text-sm text-gray-400">No income categories yet.</p>
          <button @click="openAddModal('INCOME')" class="mt-2 text-sm text-blue-600 hover:underline font-medium">+ Add one</button>
        </div>
        <ul v-else class="divide-y divide-gray-50">
          <li v-for="cat in incomeCategories" :key="cat.id"
            class="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-green-50 text-green-600 ring-1 ring-green-100 flex items-center justify-center font-bold text-sm">
                {{ cat.name.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-gray-800">{{ cat.name }}</span>
            </div>
            <button @click="handleDelete(cat.id)"
              class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
              <Trash2Icon class="h-4 w-4" />
            </button>
          </li>
        </ul>
      </div>

      <!-- Expense -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-red-50">
          <div class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
            <TrendingDownIcon class="h-4 w-4" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-gray-800">Expense Categories</h2>
            <p class="text-xs text-gray-500">{{ expenseCategories.length }} categories</p>
          </div>
        </div>
        <div v-if="expenseCategories.length === 0" class="text-center py-10 px-4">
          <p class="text-sm text-gray-400">No expense categories yet.</p>
          <button @click="openAddModal('EXPENSE')" class="mt-2 text-sm text-blue-600 hover:underline font-medium">+ Add one</button>
        </div>
        <ul v-else class="divide-y divide-gray-50">
          <li v-for="cat in expenseCategories" :key="cat.id"
            class="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-red-50 text-red-600 ring-1 ring-red-100 flex items-center justify-center font-bold text-sm">
                {{ cat.name.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-gray-800">{{ cat.name }}</span>
            </div>
            <button @click="handleDelete(cat.id)"
              class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
              <Trash2Icon class="h-4 w-4" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal -->
    <BaseModal :show="showModal" title="New Category" subtitle="Add an income or expense category" @close="closeModal">
      <form @submit.prevent="handleCreate" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
            <button type="button" @click="form.type = 'EXPENSE'"
              :class="form.type === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'"
              class="py-2 px-4 rounded-lg text-sm transition-all">💸 Expense</button>
            <button type="button" @click="form.type = 'INCOME'"
              :class="form.type === 'INCOME' ? 'bg-white text-green-600 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'"
              class="py-2 px-4 rounded-lg text-sm transition-all">💰 Income</button>
          </div>
        </div>
        <div>
          <label for="cat-name" class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input id="cat-name" v-model="form.name" ref="nameInputRef" type="text" required maxlength="50"
            placeholder="e.g. Food, Salary, Transport..."
            class="block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="closeModal"
            class="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" :disabled="isCreating || !form.name.trim()"
            class="flex-1 py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            <LoaderIcon v-if="isCreating" class="h-4 w-4 animate-spin" />
            {{ isCreating ? 'Saving...' : 'Save Category' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { PlusIcon, LoaderIcon, TrendingUpIcon, TrendingDownIcon, Trash2Icon, InfoIcon } from 'lucide-vue-next';
import PageHeader from '../components/ui/PageHeader.vue';
import BaseModal from '../components/ui/BaseModal.vue';
import { useCategories } from '../composables/useCategories';
import type { CategoryType, CreateCategoryDto } from '../types';

// ── Composable ──────────────────────────────────────────────────────────────
const { categories, incomeCategories, expenseCategories, isLoading,
        createCategory, isCreating, deleteCategory } = useCategories();

// ── Form ────────────────────────────────────────────────────────────────────
const showModal = ref(false);
const nameInputRef = ref<HTMLInputElement | null>(null);
const form = ref<CreateCategoryDto>({ name: '', type: 'EXPENSE' });

const openAddModal = (type: CategoryType = 'EXPENSE') => {
  form.value = { name: '', type };
  showModal.value = true;
  nextTick(() => nameInputRef.value?.focus());
};
const closeModal = () => { showModal.value = false; };

const handleCreate = async () => {
  await createCategory({ ...form.value });
  closeModal();
};
const handleDelete = async (id: string) => {
  if (!confirm('Delete this category? Transactions linked to it may be affected.')) return;
  await deleteCategory(id);
};
</script>
