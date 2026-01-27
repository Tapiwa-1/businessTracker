<template>
  <DashboardLayout>
    <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
      <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
        <div class="text-sm font-medium text-gray-500 truncate">Total Income</div>
        <div class="mt-1 text-3xl font-semibold text-gray-900">${{ overall.income }}</div>
      </div>
      <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
        <div class="text-sm font-medium text-gray-500 truncate">Total Expenses</div>
        <div class="mt-1 text-3xl font-semibold text-gray-900">${{ overall.expenses }}</div>
      </div>
      <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
        <div class="text-sm font-medium text-gray-500 truncate">Total Profit</div>
        <div class="mt-1 text-3xl font-semibold text-gray-900" :class="overall.profit >= 0 ? 'text-green-600' : 'text-red-600'">${{ overall.profit }}</div>
      </div>
    </div>

    <h3 class="mb-4 text-xl font-semibold text-gray-700">Monthly Performance</h3>
    <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
      <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
        <div class="text-sm font-medium text-gray-500 truncate">Monthly Income</div>
        <div class="mt-1 text-3xl font-semibold text-gray-900">${{ monthly.income }}</div>
      </div>
      <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
        <div class="text-sm font-medium text-gray-500 truncate">Monthly Expenses</div>
        <div class="mt-1 text-3xl font-semibold text-gray-900">${{ monthly.expenses }}</div>
      </div>
      <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
        <div class="text-sm font-medium text-gray-500 truncate">Monthly Profit</div>
        <div class="mt-1 text-3xl font-semibold text-gray-900" :class="monthly.profit >= 0 ? 'text-green-600' : 'text-red-600'">${{ monthly.profit }}</div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { store } from '../store';
import DashboardLayout from '../components/DashboardLayout.vue';

onMounted(() => {
  store.fetchDashboardData();
});

const overall = computed(() => store.dashboardData.overall || { income: 0, expenses: 0, profit: 0 });
const monthly = computed(() => store.dashboardData.monthly || { income: 0, expenses: 0, profit: 0 });
</script>
