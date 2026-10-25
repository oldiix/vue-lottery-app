import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ServiceProvider, tokenStorage } from '@/shared/api'
import type { AuthService } from '../api/auth.service'
import type { AuthUser, LoginCredentials } from './types'
import type { User } from '@/entities/user/model/types'

const USER_KEY = 'authUser'

function loadUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? (JSON.parse(saved) as AuthUser) : null
  } catch {
    return null
  }
}

function toAuthUser(user: User): AuthUser {
  const { id, username, email, firstName, lastName, gender, image } = user
  return { id, username, email, firstName, lastName, gender, image }
}

export const useAuthStore = defineStore('auth', () => {
  const authService = () => ServiceProvider.get<AuthService>('auth')

  const accessToken = ref<string | null>(tokenStorage.getAccessToken())
  const user = ref<AuthUser | null>(loadUser())

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  function setUser(value: AuthUser | null): void {
    user.value = value
    if (value) {
      localStorage.setItem(USER_KEY, JSON.stringify(value))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    const currentUser = await authService().me()
    setUser(toAuthUser(currentUser))
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    const response = await authService().login(credentials)
    tokenStorage.setTokens(response.accessToken, response.refreshToken)
    accessToken.value = response.accessToken

    try {
      await fetchCurrentUser()
    } catch (error) {
      logout()
      throw error
    }
  }

  function logout(): void {
    tokenStorage.clear()
    accessToken.value = null
    setUser(null)
  }

  return { accessToken, user, isAuthenticated, login, logout, fetchCurrentUser }
})
