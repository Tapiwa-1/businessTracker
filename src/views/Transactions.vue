<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-700">Transactions</h2>
      <div class="space-x-4">
        <button @click="openModal('income')" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600">
          Add Income
        </button>
        <button @click="openModal('expense')" class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">
          Add Expense
        </button>
      </div>
    </div>

    <div class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-no-wrap">
          <thead>
            <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Type</th>
              <th class="px-4 py-3">Source/Name</th>
              <th class="px-4 py-3">Amount</th>
              <th class="px-4 py-3">Comments</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            <tr v-for="transaction in transactions" :key="transaction.id" class="text-gray-700 dark:text-gray-400">
              <td class="px-4 py-3 text-sm">{{ new Date(transaction.date).toLocaleDateString() }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="transaction.type === 'income' ? 'px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100' : 'px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:bg-red-700 dark:text-red-100'">
                  {{ transaction.type }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">{{ transaction.source || transaction.name }}</td>
              <td class="px-4 py-3 text-sm">${{ transaction.amount }}</td>
              <td class="px-4 py-3 text-sm">{{ transaction.comments }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :isOpen="isModalOpen" :title="modalType === 'income' ? 'Add Income' : 'Add Expense'" @close="closeModal">
      <form @submit.prevent="submitTransaction">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input v-model="form.date" type="date" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" required>
          </div>
          <div v-if="modalType === 'income'">
            <label class="block text-sm font-medium text-gray-700">Source</label>
            <input v-model="form.source" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Source" required>
          </div>
          <div v-if="modalType === 'expense'">
            <label class="block text-sm font-medium text-gray-700">Expense Name</label>
            <input v-model="form.name" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Expense Name" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Amount</label>
            <input v-model.number="form.amount" type="number" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Amount" required min="0.01" step="0.01">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Comments</label>
            <input v-model="form.comments" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Comments">
          </div>
          <button type="submit" class="w-full px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add</button>
        </div>
      </form>
    </Modal>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { store } from '../store';
import DashboardLayout from '../components/DashboardLayout.vue';
import Modal from '../components/Modal.vue';

const isModalOpen = ref(false);
const modalType = ref('income');
const form = ref({
  date: '',
  amount: '',
  source: '',
  name: '',
  comments: ''
});

onMounted(() => {
  store.fetchTransactions();
});

const transactions = computed(() => store.transactions);

const openModal = (type) => {
  modalType.value = type;
  isModalOpen.value = true;
  form.value = { date: '', amount: '', source: '', name: '', comments: '' };
};

const closeModal = () => {
  isModalOpen.value = false;
};

const submitTransaction = async () => {
  try {
    const payload = {
      type: modalType.value,
      date: form.value.date,
      amount: form.value.amount,
      comments: form.value.comments
    };

    if (modalType.value === 'income') {
      payload.source = form.value.source;
    } else {
      payload.name = form.value.name;
    }

    await store.addTransaction(payload);
    closeModal();
    store.fetchTransactions();
    store.fetchDashboardData(); // Update dashboard data if cached
  } catch (error) {
    alert(error.message || 'Failed to add transaction');
  }
};
</script>
