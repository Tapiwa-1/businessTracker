<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-200">
    <!-- Sidebar -->
    <div :class="sidebarOpen ? 'block' : 'hidden'" @click="sidebarOpen = false" class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>

    <div :class="sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'" class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:translate-x-0 lg:static lg:inset-0 flex flex-col shadow-sm">
      <div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <span class="mx-2 text-2xl font-bold text-gray-800 dark:text-white tracking-tight">BusinessTracker</span>
        </div>
      </div>

      <nav class="mt-6 flex-1 px-4 space-y-2">
        <router-link to="/" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150" :class="$route.path === '/' ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'">
          <HomeIcon class="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </router-link>

        <router-link to="/transactions" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150" :class="$route.path === '/transactions' ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'">
          <CurrencyDollarIcon class="w-5 h-5 mr-3" />
          <span>Transactions</span>
        </router-link>

        <router-link to="/bookings" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150" :class="$route.path === '/bookings' ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'">
          <CalendarIcon class="w-5 h-5 mr-3" />
          <span>Bookings</span>
        </router-link>

        <router-link to="/reports" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150" :class="$route.path === '/reports' ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'">
          <ChartBarIcon class="w-5 h-5 mr-3" />
          <span>Reports</span>
        </router-link>

        <router-link to="/inventory" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150" :class="$route.path === '/inventory' ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'">
          <CubeIcon class="w-5 h-5 mr-3" />
          <span>Inventory</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <router-link to="/settings" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150" :class="$route.path === '/settings' ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'">
            <Cog6ToothIcon class="w-5 h-5 mr-3" />
            <span>Settings</span>
          </router-link>

          <button @click="logout" class="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors duration-150 focus:outline-none">
            <ArrowRightOnRectangleIcon class="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header class="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
        <div class="flex items-center">
          <button @click="sidebarOpen = true" class="text-gray-500 focus:outline-none lg:hidden mr-4">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Business Dashboard</h2>
        </div>

        <div class="flex items-center space-x-4">
          <button @click="toggleTheme" class="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full focus:outline-none transition-colors duration-200">
            <SunIcon v-if="isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>
          <div class="relative flex items-center">
            <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs mr-2">
                {{ userInitials }}
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ userEmail }}</span>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { store } from '../store.js';
import { HomeIcon, CurrencyDollarIcon, ChartBarIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, CubeIcon, CalendarIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

const sidebarOpen = ref(false);
const router = useRouter();
const route = useRoute();

const userEmail = computed(() => store.user?.username || store.user?.email || 'User');
const isDark = computed(() => store.theme === 'dark');

const userInitials = computed(() => {
    const name = userEmail.value;
    return name.substring(0, 2).toUpperCase();
});

const toggleTheme = () => {
  store.toggleTheme();
};

const logout = () => {
  store.logout();
  router.push('/login');
};
</script>
