<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Overview</h2>
        <DateRangePicker @update:modelValue="handleDateRangeChange" />
    </div>

    <div class="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
      <!-- Income Card -->
      <div class="card p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Income</p>
                <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${{ summary.income.toFixed(2) }}</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
        </div>
      </div>

      <!-- Expense Card -->
      <div class="card p-6 border-l-4 border-red-500">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Expenses</p>
                <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${{ summary.expenses.toFixed(2) }}</p>
            </div>
            <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
            </div>
        </div>
      </div>

      <!-- Profit Card -->
      <div class="card p-6 border-l-4" :class="summary.profit >= 0 ? 'border-blue-500' : 'border-orange-500'">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Profit</p>
                <p class="mt-2 text-3xl font-bold" :class="summary.profit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'">${{ summary.profit.toFixed(2) }}</p>
            </div>
            <div class="p-3 rounded-full" :class="summary.profit >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-orange-100 dark:bg-orange-900/30'">
                <svg class="w-6 h-6" :class="summary.profit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
        </div>
      </div>
    </div>

    <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Financial Trends</h3>
        <div class="h-80">
            <IncomeExpenseChart :data="chartData" />
        </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { store } from '../store';
import DashboardLayout from '../components/DashboardLayout.vue';
import DateRangePicker from '../components/DateRangePicker.vue';
import IncomeExpenseChart from '../components/IncomeExpenseChart.vue';

const summary = computed(() => store.dashboardData.summary || { income: 0, expenses: 0, profit: 0 });
const chartData = computed(() => store.dashboardData.chartData || []);

onMounted(() => {
    store.fetchDashboardData();
});

const handleDateRangeChange = (range) => {
    store.fetchDashboardData(range);
};
</script>
