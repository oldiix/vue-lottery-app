import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './providers/router'
import { registerServices } from './providers/services'
import { setAuthFailureHandler } from '@/shared/api'
import { useSessionStore } from '@/entities/session'

const app = createApp(App)

registerServices()

app.use(createPinia())
app.use(router)

const session = useSessionStore()

setAuthFailureHandler(() => {
  session.clearSession()
  router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
})

if (session.isAuthenticated) {
  session.fetchCurrentUser().catch(() => undefined)
}

router.isReady().then(() => {
  app.mount('#app')
})
