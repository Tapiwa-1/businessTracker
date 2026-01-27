import { createRouter, createWebHistory } from 'vue-router';
import { store } from '../store';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Reports from '../views/Reports.vue';
import Settings from '../views/Settings.vue';
import Inventory from '../views/Inventory.vue';
import Bookings from '../views/Bookings.vue';

const routes = [
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/transactions', component: Transactions, meta: { requiresAuth: true } },
  { path: '/bookings', component: Bookings, meta: { requiresAuth: true } },
  { path: '/reports', component: Reports, meta: { requiresAuth: true } },
  { path: '/inventory', component: Inventory, meta: { requiresAuth: true } },
  { path: '/settings', component: Settings, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!store.token;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next('/login');
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isLoggedIn) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
