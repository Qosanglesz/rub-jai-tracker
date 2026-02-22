<!-- Reusable Stat Card used on the Dashboard
     Props:
       - label: Card heading (e.g. "Total Income")
       - value: Formatted string to display (e.g. "฿12,000.00")
       - icon: Lucide icon component
       - iconBgClass: Tailwind bg/text classes for the icon circle (e.g. "bg-green-100 text-green-600")
       - valueClass: Optional Tailwind text color for the value (default: "text-gray-900")
-->
<template>
  <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="rounded-xl p-3" :class="iconBgClass">
            <component :is="icon" class="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">{{ label }}</dt>
            <dd>
              <div class="text-xl font-bold mt-0.5" :class="valueClass || 'text-gray-900'">
                {{ value }}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  label: string;
  value: string;
  icon: Component;
  iconBgClass: string;
  valueClass?: string;
}>();
</script>
