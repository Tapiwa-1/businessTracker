import { reactive } from 'vue';

export const store = reactive({
  income: [
    { date: '2026-01-05', source: 'B/F', amount: 200 },
    { date: '2026-01-10', source: 'Round', amount: 300 },
    { date: '2026-01-15', source: 'Church', amount: 390 },
  ],
  expenses: [
    { date: '2026-01-08', name: 'Taku', amount: 50, comments: '' },
    { date: '2026-01-09', name: 'Fuel', amount: 30, comments: '' },
    { date: '2026-01-14', name: 'Owners Pay', amount: 100, comments: '' },
    { date: '2026-01-15', name: 'Parking', amount: 20, comments: '' },
    { date: '2026-01-16', name: 'Food', amount: 50, comments: '' },
    { date: '2026-01-17', name: 'Ads', amount: 50, comments: '38 Day Ads' },
  ],

  addIncome(income) {
    this.income.push(income);
  },

  addExpense(expense) {
    this.expenses.push(expense);
  },
});
