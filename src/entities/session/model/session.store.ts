import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { tokenStorage } from '@/shared/api/token-storage.ts'
import { ServiceProvider } from '@/shared/api/service-provider.ts'
import type { AuthUser, LoginCredentials } from '@/entities/session/model/types.ts'
import type { User } from '@/entities/user/model/types.ts'

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
    const currentUser = await ServiceProvider.auth.me()
    setUser(toAuthUser(currentUser))
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    const response = await ServiceProvider.auth.login(credentials)
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
