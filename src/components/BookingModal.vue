<template>
  <Modal :isOpen="isOpen" :title="mode === 'create' ? 'New Booking' : 'Edit Booking'" @close="$emit('close')">
    <form @submit.prevent="submitForm">
      <div class="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <!-- Client Info -->
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Client Name</label>
                <input v-model="form.client_name" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Client Phone</label>
                <input v-model="form.client_phone" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring">
            </div>
        </div>

        <!-- Event Details -->
        <div>
            <label class="block text-sm font-medium text-gray-700">Event Type</label>
            <select v-model="form.event_type" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring">
                <option value="Wedding">Wedding</option>
                <option value="Church Event">Church Event</option>
                <option value="Party">Party</option>
                <option value="Corporate">Corporate</option>
                <option value="Concert">Concert</option>
                <option value="Other">Other</option>
            </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Start Time</label>
                <input v-model="form.start_time" type="datetime-local" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">End Time</label>
                <input v-model="form.end_time" type="datetime-local" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" required>
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Location</label>
            <input v-model="form.location" type="text" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="Venue Address">
        </div>

        <!-- Equipment Selection -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Equipment</label>
            <div class="border border-gray-200 rounded-md p-3 max-h-40 overflow-y-auto bg-gray-50">
                <div v-for="item in availableEquipment" :key="item.id" class="flex items-center mb-2">
                    <input type="checkbox" :value="item.id" v-model="form.equipment_ids" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    <label class="ml-2 text-sm text-gray-700">
                        {{ item.name }} <span class="text-xs text-gray-500">({{ item.category }}) - {{ item.status }}</span>
                    </label>
                </div>
                <div v-if="availableEquipment.length === 0" class="text-sm text-gray-500 italic">No equipment available.</div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Note: Only showing equipment that is available or already assigned to this booking.</p>
        </div>

        <!-- Status & Notes -->
        <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select v-model="form.status" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring">
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Notes</label>
            <textarea v-model="form.notes" rows="3" class="block w-full px-4 py-3 mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring"></textarea>
        </div>

        <button type="submit" class="w-full px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" :disabled="loading">
            <span v-if="loading">Saving...</span>
            <span v-else>{{ mode === 'create' ? 'Create Booking' : 'Update Booking' }}</span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { store } from '../store';
import Modal from './Modal.vue';

const props = defineProps({
  isOpen: Boolean,
  mode: String,
  booking: Object
});

const emit = defineEmits(['close', 'save']);

const loading = ref(false);

const form = ref({
  client_name: '',
  client_phone: '',
  event_type: 'Wedding',
  start_time: '',
  end_time: '',
  location: '',
  status: 'Pending',
  notes: '',
  equipment_ids: []
});

// Watch for changes in mode/booking to populate form
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.mode === 'edit' && props.booking) {
      // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
      const start = props.booking.start_time ? new Date(props.booking.start_time).toISOString().slice(0, 16) : '';
      const end = props.booking.end_time ? new Date(props.booking.end_time).toISOString().slice(0, 16) : '';

      form.value = {
        ...props.booking,
        start_time: start,
        end_time: end,
        equipment_ids: props.booking.equipment ? props.booking.equipment.map(e => e.id) : []
      };
    } else {
      // Reset form
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const start = now.toISOString().slice(0, 16);

      const later = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
      const end = later.toISOString().slice(0, 16);

      form.value = {
        client_name: '',
        client_phone: '',
        event_type: 'Wedding',
        start_time: start,
        end_time: end,
        location: '',
        status: 'Pending',
        notes: '',
        equipment_ids: []
      };
    }
  }
});

const availableEquipment = computed(() => {
    // In a real app, we should filter by date availability.
    // Here we just show all active equipment.
    // The backend will check for conflicts.
    return store.equipment;
});

const submitForm = async () => {
  loading.value = true;
  try {
    const payload = { ...form.value };
    // Ensure ISO dates for API
    payload.start_time = new Date(form.value.start_time).toISOString();
    payload.end_time = new Date(form.value.end_time).toISOString();

    if (props.mode === 'create') {
        await store.addBooking(payload);
    } else {
        await store.updateBooking(props.booking.id, payload);
    }
    emit('save');
  } catch (error) {
    alert(error.message || 'Operation failed');
  } finally {
    loading.value = false;
  }
};
</script>
