import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { store } from './store'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App)

// Initialize auth state
if (store.token) {
    store.fetchUser();
}

app.use(router)
app.use(VCalendar, {})
app.mount('#app')
