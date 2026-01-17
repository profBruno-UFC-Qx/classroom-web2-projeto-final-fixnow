import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

// Recuperar dados de autenticação do localStorage antes de usar o router
const authStore = useAuthStore()
authStore.initializeFromStorage()

app.use(router)

app.mount('#app')