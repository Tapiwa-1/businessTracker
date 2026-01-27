<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm">
    <div class="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Modal',
  },
});

defineEmits(['close']);
</script>
