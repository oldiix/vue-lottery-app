import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { ListParams } from '@/services/interfaces'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'

const MAX_WINNERS = 3

function replaceInList(list: User[], updated: User): User[] {
  return list.map((user) => (user.id === updated.id ? updated : user))
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let lastRequestId = 0

  const createdUsers = ref<User[]>([])
  const updatedUsers = ref<Record<number, User>>({})
  const deletedIds = ref<number[]>([])

  function findCreatedUser(id: number): User | undefined {
    return createdUsers.value.find((user) => user.id === id)
  }

  function applyLocalChanges(items: User[]): User[] {
    return items
      .filter((user) => !deletedIds.value.includes(user.id))
      .map((user) => updatedUsers.value[user.id] ?? user)
  }

  const winners = ref<User[]>([])

  const candidates = computed(() =>
    users.value.filter((user) => !winners.value.some((winner) => winner.id === user.id)),
  )

  const canAddWinner = computed(
    () => winners.value.length < MAX_WINNERS && candidates.value.length > 0,
  )

  function addRandomWinner(): void {
    if (!canAddWinner.value) {
      return
    }
    const index = Math.floor(Math.random() * candidates.value.length)
    const winner = candidates.value[index]
    if (winner) {
      winners.value.push(winner)
    }
  }

  function removeWinner(id: number): void {
    winners.value = winners.value.filter((winner) => winner.id !== id)
  }

  async function fetchUsers(params: ListParams): Promise<void> {
    const requestId = ++lastRequestId
    isLoading.value = true
    error.value = null

    try {
      const result = await ServiceProvider.users.getAll(params)
      if (requestId !== lastRequestId) {
        return
      }
      const serverUsers = applyLocalChanges(result.items)

      const isFirstPage = !params.skip && !params.q
      users.value = isFirstPage ? [...createdUsers.value, ...serverUsers] : serverUsers
      total.value = params.q
        ? result.total
        : result.total + createdUsers.value.length - deletedIds.value.length
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

  async function addUser(data: CreateUserDto): Promise<void> {
    const created = await ServiceProvider.users.create(data)
    const user: User = { ...created, id: Date.now() }

    createdUsers.value.unshift(user)
    users.value.unshift(user)
    total.value += 1
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const localUser = findCreatedUser(id)
    let updated: User

    if (localUser) {
      updated = { ...localUser, ...data }
      createdUsers.value = replaceInList(createdUsers.value, updated)
    } else {
      updated = await ServiceProvider.users.update(id, data)
      updatedUsers.value[id] = updated
    }

    users.value = replaceInList(users.value, updated)
    winners.value = replaceInList(winners.value, updated)
    return updated
  }

  async function removeUser(id: number): Promise<void> {
    if (findCreatedUser(id)) {
      createdUsers.value = createdUsers.value.filter((user) => user.id !== id)
    } else {
      await ServiceProvider.users.delete(id)
      deletedIds.value.push(id)
    }

    users.value = users.value.filter((user) => user.id !== id)
    total.value = Math.max(0, total.value - 1)
    removeWinner(id)
  }

  return {
    users,
    total,
    isLoading,
    error,
    winners,
    canAddWinner,
    fetchUsers,
    addUser,
    updateUser,
    removeUser,
    addRandomWinner,
    removeWinner,
  }
})
