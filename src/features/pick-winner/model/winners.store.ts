import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useUsersStore, type User } from '@/entities/user'

const MAX_WINNERS = 3

export const useWinnersStore = defineStore('winners', () => {
  const usersStore = useUsersStore()
  const { users } = storeToRefs(usersStore)

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

  usersStore.$onAction(({ name, args, after }) => {
    if (name === 'removeUser') {
      after(() => removeWinner(args[0] as number))
    }
    if (name === 'updateUser') {
      after((updated) => {
        const user = updated as User
        winners.value = winners.value.map((winner) => (winner.id === user.id ? user : winner))
      })
    }
  })

  return { winners, canAddWinner, addRandomWinner, removeWinner }
})
