<!-- Reusable Modal Overlay Component
     Wraps any content in a centered, keyboard-accessible dialog.
     Props:
       - show (required): v-model:show to control visibility
       - title (required): Modal heading
       - subtitle (optional): Small muted description below the title
     Emits: "close" — when the user clicks backdrop or X button
     Slot: default — the modal body content
-->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          @click="$emit('close')"
        />

        <!-- Panel -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ title }}</h2>
              <p v-if="subtitle" class="text-sm text-gray-500 mt-0.5">{{ subtitle }}</p>
            </div>
            <button
              @click="$emit('close')"
              class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <XIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XIcon } from 'lucide-vue-next';

defineProps<{
  show: boolean;
  title: string;
  subtitle?: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>
