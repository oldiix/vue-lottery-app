import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { setupUi } from './providers/ui'
import { useThemeStore } from '@/features/theme-toggle'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './providers/router'
import { registerServices } from './providers/services'
import { setAuthFailureHandler } from '@/shared/api'
import { useSessionStore } from '@/entities/session'

const app = createApp(App)

registerServices()

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
useThemeStore()

app.use(router)
setupUi(app)
useThemeStore()

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
