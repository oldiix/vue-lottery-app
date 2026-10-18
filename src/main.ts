import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setAuthFailureHandler } from '@/api/http-client'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const auth = useAuthStore()

// refresh-токен теж недійсний: розлогінюю і відправляю на Login
setAuthFailureHandler(() => {
  auth.logout()
  const { fullPath, meta } = router.currentRoute.value
  if (meta.requiresAuth) {
    router.push({ name: 'login', query: { redirect: fullPath } })
  }
})

// при старті перевіряю збережений токен через /auth/me (за потреби спрацює refresh)
if (auth.isAuthenticated) {
  // 401 обробляє interceptor, інші помилки (наприклад, немає мережі) не розлогінюють
  auth.fetchCurrentUser().catch(() => undefined)
}

router.isReady().then(() => {
  app.mount('#app')
})
