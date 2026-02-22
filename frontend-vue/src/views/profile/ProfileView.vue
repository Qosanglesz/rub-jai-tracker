<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-t-xl shadow-sm">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Profile Settings</h3>
      <p class="mt-1 text-sm text-gray-500">
        Update your account information and password.
      </p>
    </div>

    <div class="bg-white shadow-sm overflow-hidden sm:rounded-xl">
      <div class="px-4 py-5 sm:p-6">
        <h4 class="text-md font-medium text-gray-900 mb-4">Account Information</h4>
        <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Full name</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.name }}</dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Email address</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.email }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Password Change Section -->
    <div class="bg-white shadow-sm overflow-hidden sm:rounded-xl">
      <div class="px-4 py-5 sm:p-6">
        <h4 class="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
          <KeyIcon class="w-5 h-5 text-gray-400" />
          Change Password
        </h4>
        <form @submit.prevent="handleChangePassword" class="space-y-4 max-w-md">
          <div>
            <label for="old-password" class="block text-sm font-medium text-gray-700">Current Password</label>
            <div class="mt-1">
              <input type="password" id="old-password" v-model="oldPassword" required
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
            </div>
          </div>
          
          <div>
            <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
            <div class="mt-1">
              <input type="password" id="new-password" v-model="newPassword" required minlength="6"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
            </div>
          </div>
          
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div class="mt-1">
              <input type="password" id="confirm-password" v-model="confirmPassword" required minlength="6"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
            </div>
          </div>

          <div class="pt-2">
            <button type="submit" :disabled="isLoading || !isPasswordMatch"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <LoaderIcon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Update Password
            </button>
            <p v-if="!isPasswordMatch && confirmPassword" class="mt-2 text-sm text-red-600">Passwords do not match.</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import apiClient from '../../api/client';
import { toast } from 'vue-sonner';
import { KeyIcon, LoaderIcon } from 'lucide-vue-next';

const authStore = useAuthStore();
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

const isPasswordMatch = computed(() => {
  return newPassword.value === confirmPassword.value;
});

const handleChangePassword = async () => {
  if (!isPasswordMatch.value) return;
  
  isLoading.value = true;
  try {
    const response = await apiClient.post('/auth/change-password', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    toast.success(response.data.message || 'Password updated successfully');
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to update password');
  } finally {
    isLoading.value = false;
  }
};
</script>
