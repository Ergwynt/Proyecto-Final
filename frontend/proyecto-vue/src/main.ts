import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

authStore.$subscribe(async () => {
  if (authStore.isTokenValid) {
    await authStore.fetchUserData()
  }
})

app.use(router)

app.mount('#app')
