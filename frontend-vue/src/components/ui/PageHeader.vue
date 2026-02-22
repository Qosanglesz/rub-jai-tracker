<!-- Reusable Page Header Component
     Props:
       - title (required): The h1 heading text
       - subtitle (optional): Small muted description below the title
     Slot: "action" — place a button or any right-aligned control here
-->
<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
    </div>
    <!-- Right-side action slot (e.g. "New Transaction" button) -->
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
