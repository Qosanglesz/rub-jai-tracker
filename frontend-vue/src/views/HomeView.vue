<template>
  <div class="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4">
    <!-- Hero Badge -->
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 shadow-sm">
      <span class="flex h-2 w-2 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
      Track Smarter, Live Better
    </div>

    <!-- Headline -->
    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 max-w-3xl">
      Master your wealth with
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Rub Jai Tracker</span>
    </h1>

    <!-- Subheadline -->
    <p class="text-lg sm:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
      A meticulously designed platform to monitor expenses, measure savings, and achieve financial goals faster.
    </p>

    <!-- CTA Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <router-link
        to="/register"
        class="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
      >
        Get Started Free
        <ArrowRightIcon class="ml-2 h-5 w-5" />
      </router-link>
      <router-link
        to="/login"
        class="inline-flex justify-center items-center px-8 py-3.5 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all hover:border-gray-300"
      >
        Sign In
      </router-link>
    </div>

    <!-- App Mockup Wireframe -->
    <div class="mt-16 w-full max-w-5xl rounded-2xl bg-white shadow-2xl shadow-blue-900/10 border border-gray-100 overflow-hidden relative group">
      <!-- Fake Browser Bar -->
      <div class="bg-gray-100/80 backdrop-blur border-b border-gray-200 px-4 py-3 flex items-center gap-2">
        <div class="flex gap-1.5">
          <div class="w-3 h-3 rounded-full bg-red-400"></div>
          <div class="w-3 h-3 rounded-full bg-amber-400"></div>
          <div class="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div class="mx-auto bg-white/60 rounded-md h-5 w-1/3 border border-gray-200/50"></div>
      </div>
      <!-- Mockup body skeleton -->
      <div class="p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
        <div class="col-span-1 md:col-span-2 space-y-4 text-left">
          <div class="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div class="grid grid-cols-2 gap-4">
            <div class="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div class="w-8 h-8 rounded bg-blue-100 mb-3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div class="w-8 h-8 rounded bg-green-100 mb-3"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div class="h-40 bg-white rounded-xl shadow-sm border border-gray-100 mt-4"></div>
        </div>
        <div class="col-span-1 space-y-4">
          <div class="h-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div class="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="space-y-3">
              <div class="h-10 bg-gray-50 rounded-lg"></div>
              <div class="h-10 bg-gray-50 rounded-lg"></div>
              <div class="h-10 bg-gray-50 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from 'lucide-vue-next';
</script>
