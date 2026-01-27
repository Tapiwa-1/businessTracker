<template>
  <div class="w-full h-80">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  data: {
    type: Array, // Expecting array of { date, income, expense }
    required: true,
    default: () => []
  }
});

const chartData = computed(() => {
  const labels = props.data.map(d => d.date);
  const incomeData = props.data.map(d => d.income);
  const expenseData = props.data.map(d => d.expense);

  return {
    labels,
    datasets: [
      {
        label: 'Income',
        backgroundColor: '#10B981', // green-500
        borderColor: '#10B981',
        data: incomeData,
        tension: 0.1
      },
      {
        label: 'Expenses',
        backgroundColor: '#EF4444', // red-500
        borderColor: '#EF4444',
        data: expenseData,
        tension: 0.1
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Income vs Expense'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
       ticks: {
          callback: function(value, index, values) {
            return '$' + value;
          }
        }
    }
  }
};
</script>
