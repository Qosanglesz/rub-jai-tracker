<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <!-- Navbar -->
    <header class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex flex-shrink-0 items-center gap-2 mr-4">
              <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/50">
                RJ
              </div>
              <span class="font-bold text-xl text-gray-900 tracking-tight">Rub Jai</span>
            </router-link>
            
            <!-- Desktop Navigation -->
            <nav class="hidden sm:ml-8 sm:flex sm:space-x-8 h-full" v-if="authStore.isAuthenticated">
              <router-link to="/dashboard" class="inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm transition-colors"
                :class="[$route.path === '/dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300']"
              >
                Dashboard
              </router-link>
              <router-link to="/transactions" class="inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm transition-colors"
                :class="[$route.path === '/transactions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300']"
              >
                Transactions
              </router-link>
              <router-link to="/goals" class="inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm transition-colors"
                :class="[$route.path === '/goals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300']"
              >
                Goals
              </router-link>
              <router-link to="/categories" class="inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm transition-colors"
                :class="[$route.path === '/categories' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300']"
              >
                Categories
              </router-link>
            </nav>
          </div>
          
          <div class="flex items-center space-x-6">
            <!-- Auth Buttons -->
            <template v-if="!authStore.isAuthenticated">
              <router-link to="/login" class="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Log in</router-link>
              <router-link to="/register" class="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow">Sign up</router-link>
            </template>
            <template v-else>
              <div class="relative flex items-center gap-4">
                <span class="text-sm font-medium text-gray-700 hidden sm:block bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                  {{ authStore.user?.name || 'User' }}
                </span>
                <router-link to="/profile" class="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors border border-transparent hover:border-blue-100">
                  <span class="sr-only">View profile</span>
                  <UserIcon class="h-5 w-5" />
                </router-link>
                <button @click="handleLogout" class="text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100">
                  Logout
                </button>
              </div>
            </template>
            
            <!-- Mobile menu button -->
            <div class="flex items-center sm:hidden" v-if="authStore.isAuthenticated">
              <button @click="mobileMenuOpen = !mobileMenuOpen" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                <span class="sr-only">Open main menu</span>
                <MenuIcon v-if="!mobileMenuOpen" class="block h-6 w-6" aria-hidden="true" />
                <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen && authStore.isAuthenticated" class="sm:hidden border-t border-gray-100">
        <div class="pt-2 pb-3 space-y-1">
          <router-link to="/dashboard" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[$route.path === '/dashboard' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800']" @click="mobileMenuOpen = false">Dashboard</router-link>
          <router-link to="/transactions" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[$route.path === '/transactions' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800']" @click="mobileMenuOpen = false">Transactions</router-link>
          <router-link to="/goals" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[$route.path === '/goals' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800']" @click="mobileMenuOpen = false">Goals</router-link>
          <router-link to="/categories" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[$route.path === '/categories' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800']" @click="mobileMenuOpen = false">Categories</router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-8 lg:py-12 h-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-6xl mx-auto py-6 px-6 sm:px-8 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
           <div class="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">RJ</div>
           <span class="text-sm font-semibold text-gray-700">Rub Jai Tracker</span>
        </div>
        <p class="text-center text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }}. Tracking for a better future.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { UserIcon, MenuIcon, XIcon } from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();
const mobileMenuOpen = ref(false);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
