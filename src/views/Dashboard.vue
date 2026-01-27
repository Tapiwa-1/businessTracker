<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-700">Dashboard</h2>
        <DateRangePicker @update:modelValue="handleDateRangeChange" />
    </div>

    <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
      <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
        <div class="text-sm font-medium text-gray-500 truncate">Total Income</div>
        <div class="mt-1 text-3xl font-semibold text-gray-900">${{ summary.income.toFixed(2) }}</div>
      </div>
      <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
        <div class="text-sm font-medium text-gray-500 truncate">Total Expenses</div>
        <div class="mt-1 text-3xl font-semibold text-gray-900">${{ summary.expenses.toFixed(2) }}</div>
      </div>
      <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
        <div class="text-sm font-medium text-gray-500 truncate">Total Profit</div>
        <div class="mt-1 text-3xl font-semibold text-gray-900" :class="summary.profit >= 0 ? 'text-green-600' : 'text-red-600'">${{ summary.profit.toFixed(2) }}</div>
      </div>
    </div>

    <div class="mb-6 p-6 bg-white rounded-lg shadow">
        <IncomeExpenseChart :data="chartData" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../store';
import DashboardLayout from '../components/DashboardLayout.vue';
import DateRangePicker from '../components/DateRangePicker.vue';
import IncomeExpenseChart from '../components/IncomeExpenseChart.vue';

const summary = computed(() => store.dashboardData.summary || { income: 0, expenses: 0, profit: 0 });
const chartData = computed(() => store.dashboardData.chartData || []);

const handleDateRangeChange = (range) => {
    store.fetchDashboardData(range);
};
</script>
