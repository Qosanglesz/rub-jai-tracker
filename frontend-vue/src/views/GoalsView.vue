<template>
  <div class="space-y-6">
    <PageHeader title="Savings Goals" subtitle="Set targets and track your progress">
      <template #action>
        <button
          @click="openCreateModal"
          class="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors gap-2"
        >
          <PlusIcon class="h-4 w-4" />
          New Goal
        </button>
      </template>
    </PageHeader>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center h-40">
      <LoaderIcon class="h-8 w-8 text-blue-500 animate-spin" />
    </div>

    <!-- Empty State -->
    <div v-else-if="goals.length === 0"
      class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
        <TargetIcon class="h-8 w-8 text-indigo-400" />
      </div>
      <h3 class="text-base font-semibold text-gray-900 mb-1">No savings goals yet</h3>
      <p class="text-sm text-gray-500 max-w-sm mx-auto mb-6">
        Set a goal for your next vacation, new gadget, or emergency fund to stay motivated!
      </p>
      <button @click="openCreateModal"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
        <PlusIcon class="h-4 w-4" />
        Create your first goal
      </button>
    </div>

    <!-- Goals Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="goal in goals" :key="goal.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
        <div class="p-6">
          <!-- Header row -->
          <div class="flex justify-between items-start mb-5">
            <div class="min-w-0 pr-2">
              <h3 class="text-base font-bold text-gray-900 truncate">{{ goal.name }}</h3>
              <p class="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <CalendarIcon class="w-3.5 h-3.5" />
                Due {{ new Date(goal.deadline).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </p>
            </div>
            <button
              @click="handleDelete(goal.id)"
              class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
              title="Delete goal"
            >
              <Trash2Icon class="w-4 h-4" />
            </button>
          </div>

          <!-- Amount labels -->
          <div class="flex justify-between text-sm mb-2">
            <span class="font-semibold text-gray-800">฿{{ formatNumber(goal.currentAmount) }} saved</span>
            <span class="font-medium text-gray-400">of ฿{{ formatNumber(goal.targetAmount) }}</span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              class="h-2.5 rounded-full transition-all duration-700 ease-out"
              :class="progressPercent(goal) >= 100 ? 'bg-green-500' : 'bg-blue-500'"
              :style="{ width: `${Math.min(100, progressPercent(goal))}%` }"
            />
          </div>

          <!-- Progress Label -->
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs font-medium" :class="progressPercent(goal) >= 100 ? 'text-green-600' : 'text-blue-600'">
              {{ progressPercent(goal) }}% complete
            </span>
            <span v-if="progressPercent(goal) >= 100"
              class="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
              <CheckIcon class="h-3 w-3" /> Achieved!
            </span>
            <span v-else class="text-xs text-gray-400">
              ฿{{ formatNumber(goal.targetAmount - goal.currentAmount) }} to go
            </span>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="bg-gray-50 px-6 py-3.5 border-t border-gray-100 flex items-center gap-3">
          <button
            @click="openAddFundsModal(goal)"
            :disabled="progressPercent(goal) >= 100"
            class="flex-1 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 bg-white py-1.5 rounded-lg transition-all text-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Add Funds
          </button>
          <button
            @click="openEditModal(goal)"
            class="flex-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 py-1.5 rounded-lg transition-all text-center"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- ===== CREATE GOAL MODAL ===== -->
    <BaseModal :show="showCreateModal" title="New Savings Goal" subtitle="Define what you're saving towards" @close="showCreateModal = false">
      <form @submit.prevent="handleCreate" class="space-y-4">
        <div>
          <label for="goal-name" class="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
          <input id="goal-name" v-model="createForm.name" type="text" required maxlength="100"
            placeholder="e.g. Vacation to Japan, New MacBook..."
            class="block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
        </div>
        <div>
          <label for="goal-target" class="block text-sm font-medium text-gray-700 mb-1">Target Amount (฿)</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">฿</span>
            <input id="goal-target" v-model.number="createForm.targetAmount" type="number" min="1" step="1" required placeholder="50000"
              class="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
          </div>
        </div>
        <div>
          <label for="goal-deadline" class="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <input id="goal-deadline" v-model="createForm.deadline" type="date" required
            :min="today"
            class="block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showCreateModal = false"
            class="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" :disabled="isCreating"
            class="flex-1 py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            <LoaderIcon v-if="isCreating" class="h-4 w-4 animate-spin" />
            {{ isCreating ? 'Saving...' : 'Create Goal' }}
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- ===== ADD FUNDS MODAL ===== -->
    <BaseModal :show="showAddFundsModal" title="Add Funds" :subtitle="`Goal: ${selectedGoal?.name}`" @close="showAddFundsModal = false">
      <div v-if="selectedGoal" class="space-y-4">
        <!-- Current progress summary -->
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Already saved</span>
            <span class="font-semibold text-gray-900">฿{{ formatNumber(selectedGoal.currentAmount) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Target</span>
            <span class="font-semibold text-blue-700">฿{{ formatNumber(selectedGoal.targetAmount) }}</span>
          </div>
          <div class="w-full bg-blue-100 rounded-full h-1.5 mt-3">
            <div class="bg-blue-500 h-1.5 rounded-full" :style="{ width: `${Math.min(100, progressPercent(selectedGoal))}%` }" />
          </div>
        </div>

        <form @submit.prevent="handleAddFunds" class="space-y-4">
          <div>
            <label for="add-amount" class="block text-sm font-medium text-gray-700 mb-1">Amount to Add (฿)</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">฿</span>
              <input id="add-amount" v-model.number="addFundsAmount" type="number" min="1" step="1" required placeholder="1000"
                class="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
            </div>
            <p v-if="addFundsAmount > 0" class="text-xs text-gray-500 mt-1">
              New total: ฿{{ formatNumber(selectedGoal.currentAmount + (addFundsAmount || 0)) }}
              <span v-if="selectedGoal.currentAmount + addFundsAmount >= selectedGoal.targetAmount"
                class="text-green-600 font-semibold ml-1">🎉 Goal achieved!</span>
            </p>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="showAddFundsModal = false"
              class="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" :disabled="isAddingFunds || !addFundsAmount"
              class="flex-1 py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              <LoaderIcon v-if="isAddingFunds" class="h-4 w-4 animate-spin" />
              {{ isAddingFunds ? 'Saving...' : 'Add Funds' }}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>

    <!-- ===== EDIT GOAL MODAL ===== -->
    <BaseModal :show="showEditModal" title="Edit Goal" subtitle="Update your goal details" @close="showEditModal = false">
      <form @submit.prevent="handleEdit" class="space-y-4">
        <div>
          <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
          <input id="edit-name" v-model="editForm.name" type="text" required maxlength="100"
            class="block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
        </div>
        <div>
          <label for="edit-target" class="block text-sm font-medium text-gray-700 mb-1">Target Amount (฿)</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">฿</span>
            <input id="edit-target" v-model.number="editForm.targetAmount" type="number" min="1" step="1" required
              class="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
          </div>
        </div>
        <div>
          <label for="edit-deadline" class="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <input id="edit-deadline" v-model="editForm.deadline" type="date" required
            class="block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm" />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showEditModal = false"
            class="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" :disabled="isEditing"
            class="flex-1 py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            <LoaderIcon v-if="isEditing" class="h-4 w-4 animate-spin" />
            {{ isEditing ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useQueryClient } from '@tanstack/vue-query';
import {
  PlusIcon, LoaderIcon, TargetIcon, CalendarIcon,
  Trash2Icon, CheckIcon
} from 'lucide-vue-next';
import PageHeader from '../components/ui/PageHeader.vue';
import BaseModal from '../components/ui/BaseModal.vue';
import { useGoals } from '../composables/useGoals';
import apiClient from '../api/client';
import type { Goal, CreateGoalDto } from '../types';

// ── Composable ──────────────────────────────────────────────────────────────
const queryClient = useQueryClient();
const { goals, isLoading, createGoal, isCreating, addFunds, isAddingFunds, deleteGoal } = useGoals();

// ── Helpers ─────────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const formatNumber = (num: number) =>
  Number(num ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const progressPercent = (goal: Goal) =>
  Math.round((goal.currentAmount / goal.targetAmount) * 100);

// ── Create ──────────────────────────────────────────────────────────────────
const showCreateModal = ref(false);
const createForm = ref<CreateGoalDto>({ name: '', targetAmount: 0, deadline: '' });

const openCreateModal = () => {
  createForm.value = { name: '', targetAmount: 0, deadline: '' };
  showCreateModal.value = true;
};
const handleCreate = async () => {
  await createGoal({ ...createForm.value });
  showCreateModal.value = false;
};

// ── Add Funds ────────────────────────────────────────────────────────────────
const showAddFundsModal = ref(false);
const selectedGoal = ref<Goal | null>(null);
const addFundsAmount = ref(0);

const openAddFundsModal = (goal: Goal) => {
  selectedGoal.value = goal;
  addFundsAmount.value = 0;
  showAddFundsModal.value = true;
};
const handleAddFunds = async () => {
  if (!selectedGoal.value) return;
  const newTotal = selectedGoal.value.currentAmount + addFundsAmount.value;
  await addFunds({ id: selectedGoal.value.id, currentAmount: newTotal });
  showAddFundsModal.value = false;
};

// ── Edit ─────────────────────────────────────────────────────────────────────
const showEditModal = ref(false);
const isEditing = ref(false);
const editForm = ref({ name: '', targetAmount: 0, deadline: '' });
let editingGoalId = '';

const openEditModal = (goal: Goal) => {
  editingGoalId = goal.id;
  editForm.value = { name: goal.name, targetAmount: goal.targetAmount, deadline: goal.deadline.slice(0, 10) };
  showEditModal.value = true;
};
const handleEdit = async () => {
  isEditing.value = true;
  try {
    await apiClient.patch(`/goals/${editingGoalId}`, editForm.value);
    toast.success('Goal updated!');
    showEditModal.value = false;
    queryClient.invalidateQueries({ queryKey: ['goals'] });
  } catch (error: any) {
    toast.error(error.response?.data?.message ?? 'Failed to update goal');
  } finally {
    isEditing.value = false;
  }
};

// ── Delete ───────────────────────────────────────────────────────────────────
const handleDelete = async (id: string) => {
  if (!confirm('Delete this goal? This action cannot be undone.')) return;
  await deleteGoal(id);
};
</script>
