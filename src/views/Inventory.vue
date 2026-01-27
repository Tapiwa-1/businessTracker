<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-700">Equipment Inventory</h2>
      <button @click="openModal('create')" class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
        Add Equipment
      </button>
    </div>

    <!-- Filters -->
    <div class="flex space-x-4 mb-6">
        <select v-model="filterStatus" class="block w-40 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring">
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Out for hire">Out for hire</option>
            <option value="Under maintenance">Under maintenance</option>
        </select>
        <select v-model="filterCategory" class="block w-40 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring">
            <option value="">All Categories</option>
            <option value="Speaker">Speaker</option>
            <option value="Mixer">Mixer</option>
            <option value="Mic">Mic</option>
            <option value="Amp">Amp</option>
            <option value="Cable">Cable</option>
            <option value="Other">Other</option>
        </select>
    </div>

    <div class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-no-wrap">
          <thead>
            <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Condition</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            <tr v-for="item in filteredEquipment" :key="item.id" class="text-gray-700 dark:text-gray-400">
              <td class="px-4 py-3 text-sm">
                <div class="flex items-center">
                    <div>
                        <p class="font-semibold">{{ item.name }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">{{ item.serial_number }}</p>
                    </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm">{{ item.category }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="getStatusClass(item.status)" class="px-2 py-1 font-semibold leading-tight rounded-full">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">{{ item.condition }}</td>
              <td class="px-4 py-3 text-sm">
                <button @click="openModal('edit', item)" class="px-2 py-1 text-xs font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-purple mr-2">
                  Edit
                </button>
                <button @click="deleteItem(item.id)" class="px-2 py-1 text-xs font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-purple">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <Modal :isOpen="isModalOpen" :title="modalMode === 'create' ? 'Add Equipment' : 'Edit Equipment'" @close="closeModal">
      <form @submit.prevent="submitForm">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="form.name" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <select v-model="form.category" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" required>
                <option value="Speaker">Speaker</option>
                <option value="Mixer">Mixer</option>
                <option value="Mic">Mic</option>
                <option value="Amp">Amp</option>
                <option value="Cable">Cable</option>
                <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Serial Number</label>
            <input v-model="form.serial_number" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Specs</label>
            <input v-model="form.specs" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="e.g. 1000W">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Price (USD)</label>
            <input v-model.number="form.price" type="number" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Condition</label>
            <select v-model="form.condition" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring">
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Broken">Broken</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select v-model="form.status" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring">
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Out for hire">Out for hire</option>
                <option value="Under maintenance">Under maintenance</option>
            </select>
          </div>

          <button type="submit" class="w-full px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            {{ modalMode === 'create' ? 'Add Item' : 'Save Changes' }}
          </button>
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
const modalMode = ref('create'); // 'create' or 'edit'
const editId = ref(null);
const filterStatus = ref('');
const filterCategory = ref('');

const form = ref({
  name: '',
  category: 'Speaker',
  serial_number: '',
  specs: '',
  price: null,
  condition: 'Good',
  status: 'Available',
  image_url: ''
});

onMounted(() => {
  store.fetchEquipment();
});

const equipment = computed(() => store.equipment);

const filteredEquipment = computed(() => {
    return equipment.value.filter(item => {
        const matchStatus = !filterStatus.value || item.status === filterStatus.value;
        const matchCategory = !filterCategory.value || item.category === filterCategory.value;
        return matchStatus && matchCategory;
    });
});

const getStatusClass = (status) => {
    switch (status) {
        case 'Available': return 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100';
        case 'Booked': return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100';
        case 'Out for hire': return 'text-blue-700 bg-blue-100 dark:bg-blue-700 dark:text-blue-100';
        case 'Under maintenance': return 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100';
        default: return 'text-gray-700 bg-gray-100';
    }
};

const openModal = (mode, item = null) => {
  modalMode.value = mode;
  isModalOpen.value = true;
  if (mode === 'edit' && item) {
    editId.value = item.id;
    form.value = { ...item };
  } else {
    editId.value = null;
    form.value = {
        name: '',
        category: 'Speaker',
        serial_number: '',
        specs: '',
        price: null,
        condition: 'Good',
        status: 'Available',
        image_url: ''
    };
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const submitForm = async () => {
  try {
    if (modalMode.value === 'create') {
        await store.addEquipment(form.value);
    } else {
        await store.updateEquipment(editId.value, form.value);
    }
    closeModal();
  } catch (error) {
    alert(error.message || 'Operation failed');
  }
};

const deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await store.deleteEquipment(id);
        } catch (error) {
            alert(error.message);
        }
    }
};
</script>
