<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <!-- Sidebar -->
    <div :class="sidebarOpen ? 'block' : 'hidden'" @click="sidebarOpen = false" class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>

    <div :class="sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'" class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0 flex flex-col">
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <span class="mx-2 text-2xl font-semibold text-white">BusinessTracker</span>
        </div>
      </div>

      <nav class="mt-10 flex-1">
        <router-link to="/" class="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" active-class="text-gray-100 bg-gray-700 bg-opacity-25">
          <HomeIcon class="w-6 h-6" />
          <span class="mx-3">Dashboard</span>
        </router-link>

        <router-link to="/transactions" class="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" active-class="text-gray-100 bg-gray-700 bg-opacity-25">
          <CurrencyDollarIcon class="w-6 h-6" />
          <span class="mx-3">Transactions</span>
        </router-link>

        <router-link to="/reports" class="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" active-class="text-gray-100 bg-gray-700 bg-opacity-25">
          <ChartBarIcon class="w-6 h-6" />
          <span class="mx-3">Reports</span>
        </router-link>
      </nav>

      <div class="mt-auto mb-6">
          <router-link to="/settings" class="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" active-class="text-gray-100 bg-gray-700 bg-opacity-25">
            <Cog6ToothIcon class="w-6 h-6" />
            <span class="mx-3">Settings</span>
          </router-link>

          <button @click="logout" class="flex items-center w-full px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100 focus:outline-none">
            <ArrowRightOnRectangleIcon class="w-6 h-6" />
            <span class="mx-3">Logout</span>
          </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <header class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div class="flex items-center">
          <button @click="sidebarOpen = true" class="text-gray-500 focus:outline-none lg:hidden">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h2 class="text-xl font-medium text-gray-800 lg:ml-0 ml-4">Business Dashboard</h2>
        </div>

        <div class="flex items-center">
          <div class="relative">
            <button class="flex items-center text-gray-500 hover:text-gray-600 focus:outline-none">
              <span class="ml-2 text-sm font-semibold">{{ userEmail }}</span>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container px-6 py-8 mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store.js';
import { HomeIcon, CurrencyDollarIcon, ChartBarIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';

const sidebarOpen = ref(false);
const router = useRouter();

const userEmail = computed(() => store.user?.username || store.user?.email || 'User');

const logout = () => {
  store.logout();
  router.push('/login');
};
</script>
