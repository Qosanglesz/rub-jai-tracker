<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5">
      <div>
        <div class="mx-auto w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <KeyIcon class="h-6 w-6 text-blue-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Forgot your password?
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          We'll send you a link to reset your password.
        </p>
      </div>
      
      <form v-if="!isSubmitted" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
          <div class="mt-1">
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email"
              class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all" 
              placeholder="you@example.com" />
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading"
            class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LoaderIcon v-if="isLoading" class="h-5 w-5 text-blue-500 animate-spin" aria-hidden="true" />
            </span>
            {{ isLoading ? 'Sending...' : 'Send reset link' }}
          </button>
        </div>
        
        <div class="text-center">
          <router-link to="/login" class="font-medium text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Back to login
          </router-link>
        </div>
      </form>

      <div v-else class="mt-8">
        <div class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Email sent</h3>
              <div class="mt-2 text-sm text-green-700">
                <p>If an account exists for {{ email }}, we've sent instructions to reset your password.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- FOR EDUCATIONAL PURPOSES ONLY: Showing token if API returns it -->
        <div v-if="devToken" class="mt-4 p-4 border border-yellow-200 bg-yellow-50 rounded text-sm text-yellow-800">
          <strong>Developer Note:</strong> The backend returned this token directly to test resetting: 
          <span class="font-mono break-all">{{ devToken }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { KeyIcon, LoaderIcon, CheckCircleIcon } from 'lucide-vue-next';
import apiClient from '../../api/client';
import { toast } from 'vue-sonner';

const email = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);
const devToken = ref('');

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.post('/auth/forgot-password', { email: email.value });
    isSubmitted.value = true;
    
    if (response.data.mock_token_for_testing) {
      devToken.value = response.data.mock_token_for_testing;
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Don't leak user enumeration in production, but here we just show success anyway
      isSubmitted.value = true;
    } else {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
