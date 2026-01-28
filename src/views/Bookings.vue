<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-700">Bookings & Events</h2>
      <div class="flex space-x-2">
         <button @click="viewMode = 'calendar'" :class="viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'" class="px-4 py-2 text-sm font-medium border rounded-md focus:outline-none">
            Calendar
         </button>
         <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'" class="px-4 py-2 text-sm font-medium border rounded-md focus:outline-none">
            List
         </button>
         <button @click="openModal('create')" class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            New Booking
         </button>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-if="viewMode === 'calendar'" class="bg-white p-6 rounded-lg shadow mb-6">
      <VCalendar
        expanded
        :attributes="calendarAttributes"
        @dayclick="onDayClick"
      />
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-no-wrap">
          <thead>
            <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Client</th>
              <th class="px-4 py-3">Event Type</th>
              <th class="px-4 py-3">Location</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            <tr v-for="booking in bookings" :key="booking.id" class="text-gray-700 dark:text-gray-400">
              <td class="px-4 py-3 text-sm">
                 <div>{{ new Date(booking.start_time).toLocaleDateString() }}</div>
                 <div class="text-xs text-gray-500">{{ new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }} - {{ new Date(booking.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</div>
              </td>
              <td class="px-4 py-3 text-sm">
                  <div class="font-semibold">{{ booking.client_name }}</div>
                  <div class="text-xs text-gray-500">{{ booking.client_phone }}</div>
              </td>
              <td class="px-4 py-3 text-sm">{{ booking.event_type }}</td>
              <td class="px-4 py-3 text-sm">{{ booking.location }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="getStatusClass(booking.status)" class="px-2 py-1 font-semibold leading-tight rounded-full">
                  {{ booking.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">
                <button @click="openModal('edit', booking)" class="px-2 py-1 text-xs font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-purple mr-2">
                  Edit
                </button>
                <button @click="deleteItem(booking.id)" class="px-2 py-1 text-xs font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-purple">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Booking Modal -->
    <BookingModal
        :isOpen="isModalOpen"
        :mode="modalMode"
        :booking="selectedBooking"
        @close="closeModal"
        @save="handleSave"
    />

  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { store } from '../store';
import DashboardLayout from '../components/DashboardLayout.vue';
import BookingModal from '../components/BookingModal.vue';

const viewMode = ref('calendar'); // 'calendar' or 'list'
const isModalOpen = ref(false);
const modalMode = ref('create');
const selectedBooking = ref(null);

onMounted(() => {
  store.fetchBookings();
  store.fetchEquipment(); // For the modal selection
});

const bookings = computed(() => store.bookings);

const calendarAttributes = computed(() => {
    // Ensure bookings.value is an array before mapping
    const bookingList = Array.isArray(bookings.value) ? bookings.value : [];
    return bookingList.map(b => {
        let color = 'blue';
        if (b.status === 'Confirmed') color = 'green';
        if (b.status === 'Cancelled') color = 'red';
        if (b.status === 'Completed') color = 'gray';

        return {
            key: b.id,
            highlight: {
                color: color,
                fillMode: 'light',
            },
            dates: new Date(b.start_time),
            popover: {
                label: `${b.client_name} (${b.event_type})`,
            },
            customData: b
        };
    });
});

const getStatusClass = (status) => {
    switch (status) {
        case 'Confirmed': return 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100';
        case 'Pending': return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100';
        case 'Completed': return 'text-gray-700 bg-gray-100';
        case 'Cancelled': return 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100';
        default: return 'text-gray-700 bg-gray-100';
    }
};

const onDayClick = (day) => {
    // If there are events on this day, maybe switch to list view for that day or just open create modal for that day
    // For now, let's just open create modal with start date set
    // Check if clicked on an attribute (event)
    // v-calendar doesn't easily pass the attribute in dayclick unless configured.
    // Simpler: just open create
};

const openModal = (mode, booking = null) => {
  modalMode.value = mode;
  selectedBooking.value = booking;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedBooking.value = null;
};

const handleSave = async () => {
    await store.fetchBookings();
    closeModal();
};

const deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            await store.deleteBooking(id);
        } catch (error) {
            alert(error.message);
        }
    }
};
</script>
