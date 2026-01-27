<script setup>
import DashboardLayout from './components/DashboardLayout.vue'
import Income from './components/Income.vue'
import Expense from './components/Expense.vue'
</script>

<template>
  <DashboardLayout>
    <!-- Your dashboard content goes here -->
    <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
      <Income />
      <Expense />
    </div>
  </DashboardLayout>
</template>
