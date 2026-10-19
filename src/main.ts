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

setAuthFailureHandler(() => {
  auth.logout()
  const { fullPath, meta } = router.currentRoute.value
  if (meta.requiresAuth) {
    router.push({ name: 'login', query: { redirect: fullPath } })
  }
})

if (auth.isAuthenticated) {
  auth.fetchCurrentUser().catch(() => undefined)
}

router.isReady().then(() => {
  app.mount('#app')
})
