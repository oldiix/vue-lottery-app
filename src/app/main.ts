import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './providers/router'
import { setAuthFailureHandler } from '@/shared/api/http-client.ts'
import { useAuthStore } from '@/entities/session/model/session.store.ts'

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
