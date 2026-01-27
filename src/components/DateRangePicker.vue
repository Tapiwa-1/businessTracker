<template>
  <div class="relative inline-block text-left" ref="container">
    <div>
      <button
        type="button"
        class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        @click="isOpen = !isOpen"
      >
        {{ formattedRange }}
        <svg class="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <div
      v-if="isOpen"
      class="absolute right-0 z-50 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-72"
    >
      <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <button
          v-for="preset in presets"
          :key="preset.label"
          @click="selectPreset(preset)"
          class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          role="menuitem"
        >
          {{ preset.label }}
        </button>

        <div class="border-t border-gray-100 my-1"></div>

        <div class="px-4 py-2">
            <h4 class="text-xs font-semibold text-gray-500 uppercase">Custom Range</h4>
            <div class="mt-2 space-y-2">
                <div>
                    <label class="block text-xs text-gray-600">Start Date</label>
                    <input v-model="customStart" type="date" class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-xs text-gray-600">End Date</label>
                    <input v-model="customEnd" type="date" class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                </div>
                <button
                    @click="applyCustom"
                    class="w-full px-3 py-1.5 mt-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                    :disabled="!customStart || !customEnd"
                >
                    Apply
                </button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { format, subDays, startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from 'date-fns';

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const container = ref(null);
const customStart = ref('');
const customEnd = ref('');
const selectedLabel = ref('Last 30 Days');

const presets = [
  { label: 'Today', range: [new Date(), new Date()] },
  { label: 'Yesterday', range: [subDays(new Date(), 1), subDays(new Date(), 1)] },
  { label: 'Last 7 Days', range: [subDays(new Date(), 6), new Date()] },
  { label: 'Last 30 Days', range: [subDays(new Date(), 29), new Date()] },
  { label: 'This Month', range: [startOfMonth(new Date()), new Date()] },
  { label: 'Last Month', range: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))] },
];

const formatDate = (date) => format(date, 'yyyy-MM-dd');
const displayFormat = (date) => format(date, 'MMM d, yyyy');

const formattedRange = computed(() => selectedLabel.value);

const selectPreset = (preset) => {
  selectedLabel.value = preset.label;
  const [start, end] = preset.range;
  emitChange(start, end);
  isOpen.value = false;
};

const applyCustom = () => {
    if (customStart.value && customEnd.value) {
        selectedLabel.value = `${displayFormat(new Date(customStart.value))} - ${displayFormat(new Date(customEnd.value))}`;
        emitChange(new Date(customStart.value), new Date(customEnd.value));
        isOpen.value = false;
    }
};

const emitChange = (start, end) => {
    emit('update:modelValue', {
        startDate: formatDate(start),
        endDate: formatDate(end)
    });
};

// Close on click outside
const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // Initial emit (default to Last 30 days matches label)
   const [start, end] = presets[3].range;
   emitChange(start, end);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
