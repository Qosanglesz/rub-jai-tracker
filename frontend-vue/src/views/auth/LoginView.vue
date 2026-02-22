<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5">
      <div>
        <div class="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
          <WalletIcon class="h-6 w-6 text-white" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome Back
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign up today
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email"
                class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all" 
                placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password"
                class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all" 
                placeholder="••••••••" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Forgot your password?
            </router-link>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading"
            class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-600/20">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockIcon v-if="!isLoading" class="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" aria-hidden="true" />
              <LoaderIcon v-else class="h-5 w-5 text-blue-500 animate-spin" aria-hidden="true" />
            </span>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { WalletIcon, LockIcon, LoaderIcon } from 'lucide-vue-next';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const success = await authStore.login({
      email: email.value,
      password: password.value,
    });
    
    if (success) {
      router.push('/dashboard');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
