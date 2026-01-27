<template>
  <DashboardLayout>
    <h2 class="mb-4 text-2xl font-semibold text-gray-700">Account Settings</h2>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Profile Information -->
      <div class="p-6 bg-white rounded-lg shadow">
        <h3 class="mb-4 text-lg font-medium text-gray-700">Profile Information</h3>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Username</label>
            <input
              v-model="form.username"
              type="text"
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
              :class="{ 'border-red-500': authErrors.username }"
              required
            />
            <p v-if="authErrors.username" class="mt-1 text-xs text-red-500">{{ authErrors.username[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
              disabled
            />
            <p class="mt-1 text-xs text-gray-500">Email cannot be changed.</p>
          </div>

          <div class="pt-4 mt-4 border-t border-gray-100">
             <h4 class="mb-2 text-sm font-medium text-gray-700">Change Password</h4>
             <div class="space-y-4">
                 <div>
                    <label class="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      v-model="form.current_password"
                      type="password"
                      class="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                      :class="{ 'border-red-500': authErrors.current_password }"
                    />
                    <p v-if="authErrors.current_password" class="mt-1 text-xs text-red-500">{{ authErrors.current_password[0] }}</p>
                 </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      v-model="form.password"
                      type="password"
                      class="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                      :class="{ 'border-red-500': authErrors.password }"
                    />
                     <p v-if="authErrors.password" class="mt-1 text-xs text-red-500">{{ authErrors.password[0] }}</p>
                 </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      v-model="form.password_confirmation"
                      type="password"
                      class="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                      :class="{ 'border-red-500': authErrors.password_confirmation }"
                    />
                     <p v-if="authErrors.password_confirmation" class="mt-1 text-xs text-red-500">{{ authErrors.password_confirmation[0] }}</p>
                 </div>
             </div>
          </div>

          <div class="flex items-center justify-end mt-4">
               <span v-if="successMessage" class="mr-4 text-sm text-green-600">{{ successMessage }}</span>
               <button
                type="submit"
                class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:opacity-50"
                :disabled="authLoading"
              >
                <span v-if="authLoading">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
          </div>
        </form>
      </div>

      <!-- Delete Account -->
      <div class="p-6 bg-white rounded-lg shadow">
        <h3 class="mb-4 text-lg font-medium text-red-600">Delete Account</h3>
        <p class="mb-4 text-sm text-gray-600">
          Once your account is deleted, all of your resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
        </p>
        <button
          @click="deleteAccount"
          class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store';
import DashboardLayout from '../components/DashboardLayout.vue';

const router = useRouter();
const form = ref({
  username: '',
  email: '',
  current_password: '',
  password: '',
  password_confirmation: ''
});
const successMessage = ref('');

const authLoading = computed(() => store.authLoading);
const authErrors = computed(() => store.authErrors);
const user = computed(() => store.user);

onMounted(() => {
  if (user.value) {
    form.value.username = user.value.username;
    form.value.email = user.value.email;
  }
});

const updateProfile = async () => {
  successMessage.value = '';
  try {
    // Only send password fields if they are filled
    const payload = {
        username: form.value.username,
    };
    if (form.value.password) {
        payload.current_password = form.value.current_password;
        payload.password = form.value.password;
        payload.password_confirmation = form.value.password_confirmation;
    }

    await store.updateProfile(payload);
    successMessage.value = 'Profile updated successfully.';
    form.value.current_password = '';
    form.value.password = '';
    form.value.password_confirmation = '';
  } catch (error) {
     // Errors handled in store
  }
};

const deleteAccount = async () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      await store.deleteAccount();
      router.push('/login');
    } catch (error) {
      alert('Failed to delete account.');
    }
  }
};
</script>
