import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ServiceProvider, tokenStorage } from '@/shared/api'
import type { AuthService } from '../api/auth.service'
import type { AuthTokens, AuthUser, LoginCredentials } from './types'

const USER_KEY = 'authUser'

function loadUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? (JSON.parse(saved) as AuthUser) : null
  } catch {
    return null
  }
}

function toAuthUser(user: AuthUser): AuthUser {
  const { id, username, email, firstName, lastName, gender, image } = user
  return { id, username, email, firstName, lastName, gender, image }
}

export const useSessionStore = defineStore('session', () => {
  const authService = () => ServiceProvider.get<AuthService>('auth')

  const accessToken = ref<string | null>(tokenStorage.getAccessToken())
  const refreshToken = ref<string | null>(tokenStorage.getRefreshToken())
  const user = ref<AuthUser | null>(loadUser())

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
    localStorage.removeItem(USER_KEY)
  }

  function setUser(value: AuthUser): void {
    user.value = toAuthUser(value)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  async function fetchCurrentUser(): Promise<void> {
    setUser(await authService().me())
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
})
