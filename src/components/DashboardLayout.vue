<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <!-- Sidebar -->
    <div :class="sidebarOpen ? 'block' : 'hidden'" @click="sidebarOpen = false" class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>

    <div :class="sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'" class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0">
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <span class="mx-2 text-2xl font-semibold text-white">BusinessTracker</span>
        </div>
      </div>

      <nav class="mt-10">
        <a class="flex items-center px-6 py-2 mt-4 text-gray-100 bg-gray-700 bg-opacity-25" href="#">
          <span class="mx-3">Dashboard</span>
        </a>

        <a class="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="#">
          <span class="mx-3">Transactions</span>
        </a>

        <a class="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="#">
          <span class="mx-3">Reports</span>
        </a>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <header class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div class="flex items-center">
          <button @click="sidebarOpen = true" class="text-gray-500 focus:outline-none lg:hidden">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h2 class="text-xl font-medium text-gray-800 lg:ml-0 ml-4">Dashboard</h2>
        </div>

        <div class="flex items-center">
          <div class="relative">
            <button class="flex items-center text-gray-500 hover:text-gray-600 focus:outline-none">
              <span class="ml-2 text-sm font-semibold">User</span>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container px-6 py-8 mx-auto">
          <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
            <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
              <div class="text-sm font-medium text-gray-500 truncate">Total Income</div>
              <div class="mt-1 text-3xl font-semibold text-gray-900">${{ totalIncome }}</div>
            </div>
            <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
              <div class="text-sm font-medium text-gray-500 truncate">Total Expenses</div>
              <div class="mt-1 text-3xl font-semibold text-gray-900">${{ totalExpenses }}</div>
            </div>
            <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
              <div class="text-sm font-medium text-gray-500 truncate">Profit</div>
              <div class="mt-1 text-3xl font-semibold text-gray-900">${{ profit }}</div>
            </div>
             <div class="w-full px-4 py-5 rounded-lg shadow" :class="profitClass">
              <div class="text-sm font-medium text-white truncate">Current Profit</div>
              <div class="mt-1 text-3xl font-semibold text-white">${{ profit }}</div>
            </div>
          </div>
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../store.js';

const sidebarOpen = ref(false);

const totalIncome = computed(() => store.income.reduce((acc, income) => acc + income.amount, 0));
const totalExpenses = computed(() => store.expenses.reduce((acc, expense) => acc + expense.amount, 0));
const profit = computed(() => totalIncome.value - totalExpenses.value);

const profitClass = computed(() => {
  return profit.value >= 0 ? 'bg-green-500' : 'bg-red-500';
});
</script>