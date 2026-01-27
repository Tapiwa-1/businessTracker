<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800">Register</h2>
      <form @submit.prevent="handleRegister" class="mt-6">
        <div class="mb-4">
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
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
            :class="{ 'border-red-500': authErrors.email }"
            required
          />
          <p v-if="authErrors.email" class="mt-1 text-xs text-red-500">{{ authErrors.email[0] }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
            :class="{ 'border-red-500': authErrors.password }"
            required
            minlength="6"
          />
          <p v-if="authErrors.password" class="mt-1 text-xs text-red-500">{{ authErrors.password[0] }}</p>
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
             :class="{ 'border-red-500': authErrors.password_confirmation }"
            required
            minlength="6"
          />
          <p v-if="authErrors.password_confirmation" class="mt-1 text-xs text-red-500">{{ authErrors.password_confirmation[0] }}</p>
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="authLoading"
        >
          <span v-if="authLoading">Processing...</span>
          <span v-else>Register</span>
        </button>
      </form>
      <p class="mt-4 text-sm text-center text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store';

const form = ref({
  username: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const router = useRouter();
const authLoading = computed(() => store.authLoading);
const authErrors = computed(() => store.authErrors);

const handleRegister = async () => {
  try {
    await store.register(form.value);
    router.push('/');
  } catch (error) {
     // Errors handled in store
  }
};
</script>
