<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5">
      <div>
        <div class="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
          <UserPlusIcon class="h-6 w-6 text-white" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Create an account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign in here
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <div class="mt-1">
              <input id="name" name="name" type="text" autocomplete="name" required v-model="name"
                class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all" 
                placeholder="John Doe" />
            </div>
          </div>
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
              <input id="password" name="password" type="password" autocomplete="new-password" required v-model="password" minlength="6"
                class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all" 
                placeholder="••••••••" />
            </div>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading"
            class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-600/20">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <UserPlusIcon v-if="!isLoading" class="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" aria-hidden="true" />
              <LoaderIcon v-else class="h-5 w-5 text-blue-500 animate-spin" aria-hidden="true" />
            </span>
            {{ isLoading ? 'Creating account...' : 'Create account' }}
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
import { UserPlusIcon, LoaderIcon } from 'lucide-vue-next';

const name = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const success = await authStore.register({
      name: name.value,
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
