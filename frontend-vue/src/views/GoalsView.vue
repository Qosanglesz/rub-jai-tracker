<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Savings Goals</h1>
      <button class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors">
        <PlusIcon class="h-5 w-5 mr-2 -ml-1" />
        Set New Goal
      </button>
    </div>

    <!-- Goals Grid -->
    <div v-if="loading" class="flex justify-center p-12">
      <LoaderIcon class="h-8 w-8 text-blue-500 animate-spin" />
    </div>
    
    <div v-else-if="goals.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
      <TargetIcon class="mx-auto h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-lg font-medium text-gray-900">No savings goals yet</h3>
      <p class="mt-1 text-gray-500 max-w-sm mx-auto">Set a goal for that new laptop, vacation, or emergency fund to keep yourself motivated!</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="goal in goals" :key="goal.id" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-bold text-gray-900 truncate">{{ goal.name }}</h3>
              <p class="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <CalendarIcon class="w-4 h-4" />
                Due {{ new Date(goal.deadline).toLocaleDateString() }}
              </p>
            </div>
            <button @click="deleteGoal(goal.id)" class="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2Icon class="w-5 h-5" />
            </button>
          </div>
          
          <div class="mt-6">
            <div class="flex justify-between text-sm mb-2">
              <span class="font-medium text-gray-700">฿{{ formatNumber(goal.currentAmount) }} saved</span>
              <span class="font-medium text-blue-600">฿{{ formatNumber(goal.targetAmount) }} target</span>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                   :style="{ width: `${Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))}%` }">
              </div>
            </div>
            
            <div class="text-right mt-1 text-xs text-gray-500 font-medium">
              {{ Math.round((goal.currentAmount / goal.targetAmount) * 100) }}% complete
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between gap-4">
          <button class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex-1 text-center bg-blue-50 py-1.5 rounded-lg border border-blue-100">
            Add Funds
          </button>
          <button class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex-1 text-center bg-white border border-gray-200 py-1.5 rounded-lg">
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '../api/client';
import { toast } from 'vue-sonner';
import { 
  PlusIcon, LoaderIcon, TargetIcon, CalendarIcon, Trash2Icon 
} from 'lucide-vue-next';

const loading = ref(true);
const goals = ref<any[]>([]);

const fetchGoals = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get('/goals');
    goals.value = response.data;
  } catch (error) {
    toast.error('Failed to load goals');
  } finally {
    loading.value = false;
  }
};

const deleteGoal = async (id: string) => {
  if (!confirm('Are you sure you want to delete this goal?')) return;
  
  try {
    await apiClient.delete(`/goals/${id}`);
    toast.success('Goal deleted');
    fetchGoals(); // Refresh list
  } catch (error) {
    toast.error('Failed to delete goal');
  }
};

onMounted(() => {
  fetchGoals();
});

const formatNumber = (num: number) => {
  return Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
</script>
