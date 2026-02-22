<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import MainLayout from './components/layout/MainLayout.vue';
</script>

<template>
  <MainLayout>
    <router-view />
  </MainLayout>
  <!-- Global notification toaster - must be outside MainLayout so it overlays everything -->
  <Toaster position="top-right" richColors />
</template>
