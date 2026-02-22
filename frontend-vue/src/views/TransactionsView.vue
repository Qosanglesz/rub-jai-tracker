<template>
  <div class="space-y-6">
    <PageHeader title="Transactions" subtitle="Track your income and expenses">
      <template #action>
        <button @click="openAddModal"
          class="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors gap-2">
          <PlusIcon class="h-4 w-4" />New Transaction
        </button>
      </template>
    </PageHeader>

    <!-- Filter Bar -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-3">
      <label class="text-sm font-medium text-gray-700">Filter:</label>
      <select v-model="selectedMonth" class="rounded-lg border-gray-300 text-sm py-1.5 pr-8 shadow-sm focus:ring-blue-500">
        <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
      </select>
      <select v-model="selectedYear" class="rounded-lg border-gray-300 text-sm py-1.5 pr-8 shadow-sm focus:ring-blue-500">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
      <span class="ml-auto text-sm text-gray-500 font-medium">
        {{ transactions().length }} transaction{{ transactions().length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- List -->
    <div class="bg-white shadow-sm overflow-hidden rounded-xl border border-gray-100">
      <div v-if="isLoading" class="flex justify-center items-center h-40">
        <LoaderIcon class="h-8 w-8 text-blue-500 animate-spin" />
      </div>
      <div v-else-if="transactions().length === 0" class="text-center py-16 px-4">
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <ReceiptIcon class="h-8 w-8 text-gray-400" />
        </div>
        <h3 class="text-sm font-semibold text-gray-900 mb-1">No transactions found</h3>
        <p class="text-sm text-gray-500 mb-4">No data for the selected month.</p>
        <button @click="openAddModal" class="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800">
          <PlusIcon class="h-4 w-4" />Add your first transaction
        </button>
      </div>
      <ul v-else class="divide-y divide-gray-100">
        <li v-for="txn in transactions()" :key="txn.id" class="hover:bg-gray-50 transition-colors group">
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                :class="txn.category?.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                <component :is="txn.category?.type === 'INCOME' ? TrendingUpIcon : TrendingDownIcon" class="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ txn.category?.name || 'Uncategorized' }}</p>
                <div class="flex items-center text-xs text-gray-500 gap-2 mt-0.5">
                  <CalendarIcon class="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span>{{ new Date(txn.date).toLocaleDateString('th-TH') }}</span>
                  <span v-if="txn.note" class="hidden sm:inline text-gray-400">• {{ txn.note }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <span class="text-base font-bold" :class="txn.category?.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
                {{ txn.category?.type === 'INCOME' ? '+' : '-' }}฿{{ formatNumber(txn.amount) }}
              </span>
              <button @click="handleDelete(txn.id)"
                class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <Trash2Icon class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div v-if="txn.note" class="px-5 pb-3 sm:hidden text-xs text-gray-400 italic">{{ txn.note }}</div>
        </li>
      </ul>
    </div>

    <!-- Create Transaction Modal -->
    <BaseModal :show="showModal" title="New Transaction" subtitle="Record an income or expense" @close="closeModal">
      <form @submit.prevent="handleCreate" class="space-y-4">
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
        <!-- Amount -->
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount (฿)</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">฿</span>
            <input id="amount" v-model.number="form.amount" type="number" min="0.01" step="0.01" required placeholder="0.00"
              class="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
          </div>
        </div>
        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select id="category" v-model="form.categoryId" required
            class="block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            <option value="" disabled>-- Select a category --</option>
            <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
          <p v-if="filteredCategories.length === 0" class="text-xs text-amber-600 mt-1">
            No {{ form.type.toLowerCase() }} categories.
            <router-link to="/categories" class="underline" @click="closeModal">Add one here</router-link>.
          </p>
        </div>
        <!-- Date -->
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input id="date" v-model="form.date" type="date" required
            class="block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
        </div>
        <!-- Note -->
        <div>
          <label for="note" class="block text-sm font-medium text-gray-700 mb-1">
            Note <span class="text-gray-400 font-normal">(optional)</span>
          </label>
          <input id="note" v-model="form.note" type="text" maxlength="200" placeholder="e.g. Lunch with team"
            class="block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
        </div>
        <!-- Actions -->
        <div class="flex gap-3 pt-2">
          <button type="button" @click="closeModal"
            class="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" :disabled="isCreating"
            class="flex-1 py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            <LoaderIcon v-if="isCreating" class="h-4 w-4 animate-spin" />
            {{ isCreating ? 'Saving...' : 'Save Transaction' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PlusIcon, LoaderIcon, ReceiptIcon, TrendingUpIcon, TrendingDownIcon, CalendarIcon, Trash2Icon } from 'lucide-vue-next';
import PageHeader from '../components/ui/PageHeader.vue';
import BaseModal from '../components/ui/BaseModal.vue';
import { useTransactions } from '../composables/useTransactions';
import { useCategories } from '../composables/useCategories';
import type { CreateTransactionDto } from '../types';

// ── Period selectors ────────────────────────────────────────────────────────
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear());
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const years = Array.from({ length: 5 }, (_, i) => selectedYear.value - i);

// ── Composables ─────────────────────────────────────────────────────────────
const { transactions, isLoading, createTransaction, isCreating, deleteTransaction } =
  useTransactions(selectedYear, selectedMonth);

const { categories } = useCategories();

// ── Form ────────────────────────────────────────────────────────────────────
const showModal = ref(false);
const defaultForm = (): CreateTransactionDto & { type: 'INCOME' | 'EXPENSE' } => ({
  type: 'EXPENSE', amount: 0, categoryId: '', date: new Date().toISOString().slice(0, 10), note: '',
});
const form = ref(defaultForm());

const filteredCategories = computed(() => categories.value.filter((c) => c.type === form.value.type));
watch(() => form.value.type, () => { form.value.categoryId = ''; });

// ── Handlers ────────────────────────────────────────────────────────────────
const openAddModal = () => { form.value = defaultForm(); showModal.value = true; };
const closeModal = () => { showModal.value = false; };

const handleCreate = async () => {
  const { type: _type, ...payload } = form.value;
  await createTransaction(payload);
  closeModal();
};

const handleDelete = async (id: string) => {
  if (!confirm('Delete this transaction?')) return;
  await deleteTransaction(id);
};

const formatNumber = (num: number) =>
  Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
</script>
