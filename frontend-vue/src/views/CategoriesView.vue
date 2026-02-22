<template>
  <div class="space-y-6">
    <PageHeader title="Categories" subtitle="Manage your income and expense categories">
      <template #action>
        <button
          @click="openAddModal()"
          class="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors gap-2"
        >
          <PlusIcon class="h-4 w-4" />
          New Category
        </button>
      </template>
    </PageHeader>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-40">
      <LoaderIcon class="h-8 w-8 text-blue-500 animate-spin" />
    </div>

    <!-- Getting Started tip (first-run) -->
    <div v-if="!loading && categories.length === 0" class="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
      <InfoIcon class="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
      <div>
        <p class="text-sm font-semibold text-blue-900 mb-1">Getting Started</p>
        <p class="text-sm text-blue-700">
          Create categories first before adding transactions. E.g. Income: "Salary", "Freelance" — Expense: "Food", "Transport", "Rent".
        </p>
      </div>
    </div>

    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Income Categories -->
      <CategoryColumn
        title="Income Categories"
        :icon="TrendingUpIcon"
        icon-bg-class="bg-green-100 text-green-600"
        header-bg-class="bg-green-50"
        avatar-bg-class="bg-green-50 text-green-600 ring-green-100"
        :categories="incomeCategories"
        @add="openAddModal('INCOME')"
        @delete="deleteCategory"
      />

      <!-- Expense Categories -->
      <CategoryColumn
        title="Expense Categories"
        :icon="TrendingDownIcon"
        icon-bg-class="bg-red-100 text-red-600"
        header-bg-class="bg-red-50"
        avatar-bg-class="bg-red-50 text-red-600 ring-red-100"
        :categories="expenseCategories"
        @add="openAddModal('EXPENSE')"
        @delete="deleteCategory"
      />
    </div>

    <!-- Create Category Modal -->
    <BaseModal
      :show="showModal"
      title="New Category"
      subtitle="Add an income or expense category"
      @close="closeModal"
    >
      <form @submit.prevent="submitCategory" class="space-y-4">
        <!-- Type Toggle -->
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

        <!-- Name -->
        <div>
          <label for="cat-name" class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input
            id="cat-name"
            v-model="form.name"
            ref="nameInputRef"
            type="text"
            required
            maxlength="50"
            placeholder="e.g. Food, Salary, Transport..."
            class="block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          />
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-2">
          <button type="button" @click="closeModal"
            class="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" :disabled="submitting || !form.name.trim()"
            class="flex-1 py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            <LoaderIcon v-if="submitting" class="h-4 w-4 animate-spin" />
            {{ submitting ? 'Saving...' : 'Save Category' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, defineComponent, h } from 'vue';
import apiClient from '../api/client';
import { toast } from 'vue-sonner';
import { PlusIcon, LoaderIcon, TrendingUpIcon, TrendingDownIcon, Trash2Icon, InfoIcon } from 'lucide-vue-next';
import PageHeader from '../components/ui/PageHeader.vue';
import BaseModal from '../components/ui/BaseModal.vue';
import type { Category, CategoryType, CreateCategoryDto } from '../types';

// ==================== State ====================
const loading = ref(true);
const submitting = ref(false);
const showModal = ref(false);
const categories = ref<Category[]>([]);
const nameInputRef = ref<HTMLInputElement | null>(null);

const defaultForm = (): CreateCategoryDto => ({ name: '', type: 'EXPENSE' });
const form = ref<CreateCategoryDto>(defaultForm());

// ==================== Computed ====================
const incomeCategories = computed(() => categories.value.filter((c) => c.type === 'INCOME'));
const expenseCategories = computed(() => categories.value.filter((c) => c.type === 'EXPENSE'));

// ==================== API ====================
const fetchCategories = async () => {
  loading.value = true;
  try {
    const res = await apiClient.get('/categories');
    categories.value = res.data;
  } catch {
    toast.error('Failed to load categories');
  } finally {
    loading.value = false;
  }
};

const submitCategory = async () => {
  if (!form.value.name.trim()) return;
  submitting.value = true;
  try {
    await apiClient.post('/categories', { name: form.value.name.trim(), type: form.value.type });
    toast.success(`Category "${form.value.name}" created!`);
    closeModal();
    fetchCategories();
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to create category');
  } finally {
    submitting.value = false;
  }
};

const deleteCategory = async (id: string) => {
  if (!confirm('Delete this category? Transactions linked to it may be affected.')) return;
  try {
    await apiClient.delete(`/categories/${id}`);
    toast.success('Category deleted');
    fetchCategories();
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to delete category');
  }
};

// ==================== Modal ====================
const openAddModal = (type: CategoryType = 'EXPENSE') => {
  form.value = { name: '', type };
  showModal.value = true;
  nextTick(() => nameInputRef.value?.focus());
};
const closeModal = () => { showModal.value = false; };

// ==================== Lifecycle ====================
onMounted(fetchCategories);

// ==================== Sub-component ====================
// Extracted inline column to avoid duplicating category-list markup twice
const CategoryColumn = defineComponent({
  props: {
    title: String,
    icon: Object,
    iconBgClass: String,
    headerBgClass: String,
    avatarBgClass: String,
    categories: Array as () => Category[],
  },
  emits: ['add', 'delete'],
  setup(props, { emit }) {
    return () => h('div', { class: 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden' }, [
      // Header
      h('div', { class: `flex items-center gap-3 px-5 py-4 border-b border-gray-100 ${props.headerBgClass}` }, [
        h('div', { class: `w-8 h-8 rounded-lg ${props.iconBgClass} flex items-center justify-center` },
          [h(props.icon as any, { class: 'h-4 w-4' })]),
        h('div', {}, [
          h('h2', { class: 'text-sm font-bold text-gray-800' }, props.title),
          h('p', { class: 'text-xs text-gray-500' }, `${props.categories!.length} categories`),
        ]),
      ]),
      // Empty state
      props.categories!.length === 0
        ? h('div', { class: 'text-center py-10 px-4' }, [
            h('p', { class: 'text-sm text-gray-400' }, 'No categories yet.'),
            h('button', { class: 'mt-2 text-sm text-blue-600 hover:underline font-medium', onClick: () => emit('add') }, '+ Add one'),
          ])
        : h('ul', { class: 'divide-y divide-gray-50' },
            props.categories!.map((cat) =>
              h('li', { key: cat.id, class: 'flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group' }, [
                h('div', { class: 'flex items-center gap-3' }, [
                  h('div', { class: `w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ring-1 ${props.avatarBgClass}` }, cat.name.charAt(0).toUpperCase()),
                  h('span', { class: 'text-sm font-medium text-gray-800' }, cat.name),
                ]),
                h('button', {
                  class: 'p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100',
                  title: 'Delete',
                  onClick: () => emit('delete', cat.id),
                }, [h(Trash2Icon, { class: 'h-4 w-4' })]),
              ])
            )
          ),
    ]);
  },
});
</script>
