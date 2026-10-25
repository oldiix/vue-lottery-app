import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ServiceProvider, tokenStorage } from '@/shared/api'
import type { AuthService } from '../api/auth.service'
import type { AuthTokens, AuthUser, LoginCredentials } from './types'

function toAuthUser(user: AuthUser): AuthUser {
  const { id, username, email, firstName, lastName, gender, image } = user
  return { id, username, email, firstName, lastName, gender, image }
}

export const useSessionStore = defineStore(
  'session',
  () => {
    const authService = () => ServiceProvider.get<AuthService>('auth')

    // Токени: ручне збереження через tokenStorage
    const accessToken = ref<string | null>(tokenStorage.getAccessToken())
    const refreshToken = ref<string | null>(tokenStorage.getRefreshToken())

    // Користувач: автоматичне збереження плагіном pinia-plugin-persistedstate
    const user = ref<AuthUser | null>(null)

    const isAuthenticated = computed(() => accessToken.value !== null)

    function setSession(tokens: AuthTokens): void {
      accessToken.value = tokens.accessToken
      refreshToken.value = tokens.refreshToken
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken)
    }

    function clearSession(): void {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
      tokenStorage.clear()
    }

    async function fetchCurrentUser(): Promise<void> {
      user.value = toAuthUser(await authService().me())
    }

    async function login(credentials: LoginCredentials): Promise<void> {
      const response = await authService().login(credentials)
      setSession({ accessToken: response.accessToken, refreshToken: response.refreshToken })

      try {
        await fetchCurrentUser()
      } catch (error) {
        clearSession()
        throw error
      }
    }

    return {
      accessToken,
      refreshToken,
      user,
      isAuthenticated,
      setSession,
      clearSession,
      fetchCurrentUser,
      login,
    }
  },
  {
    persist: {
      key: 'session',
      pick: ['user'],
    },
  },
)
