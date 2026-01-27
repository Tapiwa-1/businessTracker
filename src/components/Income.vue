<template>
  <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
    <div class="text-sm font-medium text-gray-500 truncate">Income</div>
    <div class="mt-1">
      <table class="w-full whitespace-nowrap">
        <thead>
          <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
            <th class="px-4 py-3">Date</th>
            <th class="px-4 py-3">Income Source</th>
            <th class="px-4 py-3">Amount</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
          <tr v-for="income in store.income" :key="income.date" class="text-gray-700 dark:text-gray-400">
            <td class="px-4 py-3 text-sm">{{ income.date }}</td>
            <td class="px-4 py-3 text-sm">{{ income.source }}</td>
            <td class="px-4 py-3 text-sm">${{ income.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <form @submit.prevent="addIncome" class="mt-4">
      <div class="flex items-center">
        <input v-model="newIncome.date" type="date" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Date">
        <input v-model="newIncome.source" type="text" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Source">
        <input v-model.number="newIncome.amount" type="number" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Amount">
        <button type="submit" class="px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '../store.js';

const newIncome = ref({
  date: '',
  source: '',
  amount: 0,
});

const addIncome = () => {
  store.addIncome({ ...newIncome.value });
  newIncome.value = {
    date: '',
    source: '',
    amount: 0,
  };
};
</script>
