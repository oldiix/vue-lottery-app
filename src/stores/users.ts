import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { ListParams } from '@/services/interfaces'
import type { User } from '@/types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let lastRequestId = 0

  async function fetchUsers(params: ListParams): Promise<void> {
    const requestId = ++lastRequestId
    isLoading.value = true
    error.value = null

    try {
      const result = await ServiceProvider.users.getAll(params)
      if (requestId !== lastRequestId) {
        return
      }
      users.value = result.items
      total.value = result.total
    } catch (e) {
      if (requestId !== lastRequestId) {
        return
      }
      users.value = []
      total.value = 0
      error.value = e instanceof Error ? e.message : 'Failed to load users'
    } finally {
      if (requestId === lastRequestId) {
        isLoading.value = false
      }
    }
  }

  return { users, total, isLoading, error, fetchUsers }
})
