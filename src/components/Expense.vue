<template>
  <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
    <div class="text-sm font-medium text-gray-500 truncate">Expenses</div>
    <div class="mt-1">
      <table class="w-full whitespace-nowrap">
        <thead>
          <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
            <th class="px-4 py-3">Date</th>
            <th class="px-4 py-3">Expense</th>
            <th class="px-4 py-3">Amount</th>
            <th class="px-4 py-3">Comments</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
          <tr v-for="expense in store.expenses" :key="expense.date" class="text-gray-700 dark:text-gray-400">
            <td class="px-4 py-3 text-sm">{{ expense.date }}</td>
            <td class="px-4 py-3 text-sm">{{ expense.name }}</td>
            <td class="px-4 py-3 text-sm">${{ expense.amount }}</td>
            <td class="px-4 py-3 text-sm">{{ expense.comments }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <form @submit.prevent="addExpense" class="mt-4">
      <div class="flex items-center">
        <input v-model="newExpense.date" type="date" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Date">
        <input v-model="newExpense.name" type="text" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Expense">
        <input v-model.number="newExpense.amount" type="number" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Amount">
        <input v-model="newExpense.comments" type="text" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Comments">
        <button type="submit" class="px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '../store.js';

const newExpense = ref({
  date: '',
  name: '',
  amount: 0,
  comments: '',
});

const addExpense = () => {
  store.addExpense({ ...newExpense.value });
  newExpense.value = {
    date: '',
    name: '',
    amount: 0,
    comments: '',
  };
};
</script>