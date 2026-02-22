<template>
  <div class="space-y-6">
    <PageHeader title="Dashboard" subtitle="Your monthly financial summary">
      <template #action>
        <div class="flex items-center gap-2">
          <select v-model="selectedMonth" class="rounded-lg border-gray-300 text-sm py-1.5 pr-8 shadow-sm focus:ring-blue-500">
            <option v-for="(month, i) in months" :key="i" :value="i + 1">{{ month }}</option>
          </select>
          <select v-model="selectedYear" class="rounded-lg border-gray-300 text-sm py-1.5 pr-8 shadow-sm focus:ring-blue-500">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </template>
    </PageHeader>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Remaining Balance" :value="`฿${formatNumber(summary.balance)}`"
        :icon="WalletIcon"
        :icon-bg-class="summary.balance >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'"
        :value-class="summary.balance >= 0 ? 'text-gray-900' : 'text-red-600'" />
      <StatCard label="Total Income" :value="`฿${formatNumber(summary.totalIncome)}`"
        :icon="TrendingUpIcon" icon-bg-class="bg-green-100 text-green-600" />
      <StatCard label="Total Expense" :value="`฿${formatNumber(summary.totalExpense)}`"
        :icon="TrendingDownIcon" icon-bg-class="bg-red-100 text-red-600" />
      <StatCard label="Transactions" :value="`${summary.transactionCount} items`"
        :icon="ActivityIcon" icon-bg-class="bg-indigo-100 text-indigo-600" />
    </div>

    <!-- Recent Transactions & Goals Teaser -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div class="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-gray-900">Recent Transactions</h2>
          <router-link to="/transactions" class="text-sm font-medium text-blue-600 hover:text-blue-500">View all</router-link>
        </div>
        <div v-if="isLoading" class="flex justify-center py-8">
          <LoaderIcon class="h-8 w-8 text-blue-500 animate-spin" />
        </div>
        <div v-else-if="recentTransactions.length === 0" class="text-center py-8 text-gray-400 text-sm">
          No transactions this month.
        </div>
        <ul v-else class="divide-y divide-gray-100">
          <li v-for="txn in recentTransactions" :key="txn.id" class="py-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="txn.category?.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                  <component :is="txn.category?.type === 'INCOME' ? TrendingUpIcon : TrendingDownIcon" class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ txn.category?.name || 'Uncategorized' }}</p>
                  <p class="text-xs text-gray-400">{{ new Date(txn.date).toLocaleDateString('th-TH') }}</p>
                </div>
              </div>
              <span class="text-sm font-bold"
                :class="txn.category?.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
                {{ txn.category?.type === 'INCOME' ? '+' : '-' }}฿{{ formatNumber(txn.amount) }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-gray-900">Savings Goals</h2>
          <router-link to="/goals" class="text-sm font-medium text-blue-600 hover:text-blue-500">Manage</router-link>
        </div>
        <div class="text-center py-10 px-4 border-2 border-dashed border-gray-100 rounded-xl">
          <TargetIcon class="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p class="text-sm font-medium text-gray-700">Track your dreams</p>
          <p class="text-xs text-gray-400 mt-1 mb-4">Set financial goals to stay motivated!</p>
          <router-link to="/goals"
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
            <PlusIcon class="h-4 w-4" />New Goal
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WalletIcon, TrendingUpIcon, TrendingDownIcon, ActivityIcon, TargetIcon, PlusIcon, LoaderIcon } from 'lucide-vue-next';
import PageHeader from '../components/ui/PageHeader.vue';
import StatCard from '../components/ui/StatCard.vue';
import { useAnalytics } from '../composables/useAnalytics';

const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear());

const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const years = Array.from({ length: 5 }, (_, i) => selectedYear.value - i);

const { summary, recentTransactions, isLoading } = useAnalytics(selectedYear, selectedMonth);

const formatNumber = (num: number) =>
  Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
</script>
