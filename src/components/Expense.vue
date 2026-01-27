<template>
  <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <div class="text-sm font-medium text-gray-500 truncate">Expenses</div>
      <button @click="isModalOpen = true" class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">
        Add Expense
      </button>
    </div>

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

    <Modal :isOpen="isModalOpen" title="Add Expense" @close="isModalOpen = false">
      <form @submit.prevent="addExpense">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input v-model="newExpense.date" type="date" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Expense</label>
            <input v-model="newExpense.name" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Expense" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Amount</label>
            <input v-model.number="newExpense.amount" type="number" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Amount" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Comments</label>
            <input v-model="newExpense.comments" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Comments">
          </div>
          <button type="submit" class="w-full px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '../store.js';
import Modal from './Modal.vue';

const isModalOpen = ref(false);

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
  isModalOpen.value = false;
};
</script>
