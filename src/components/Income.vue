<template>
  <div class="w-full px-4 py-5 bg-white rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <div class="text-sm font-medium text-gray-500 truncate">Income</div>
      <button @click="isModalOpen = true" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600">
        Add Income
      </button>
    </div>

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

    <Modal :isOpen="isModalOpen" title="Add Income" @close="isModalOpen = false">
      <form @submit.prevent="addIncome">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input v-model="newIncome.date" type="date" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Source</label>
            <input v-model="newIncome.source" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Source" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Amount</label>
            <input v-model.number="newIncome.amount" type="number" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Amount" required>
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
  isModalOpen.value = false;
};
</script>
