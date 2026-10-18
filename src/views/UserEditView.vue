<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '@/components/UserForm.vue'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto, User } from '@/types/user'

const { id, user } = defineProps<{
  id: string
  user?: User | null
}>()

const emit = defineEmits<{
  updated: [user: User]
}>()

const router = useRouter()
const usersStore = useUsersStore()

const initialData = computed<Partial<CreateUserDto> | undefined>(() => {
  if (!user) {
    return undefined
  }
  const { firstName, lastName, email, username, password, age, gender, phone } = user
  return { firstName, lastName, email, username, password, age, gender, phone }
})

async function saveUser(data: CreateUserDto): Promise<void> {
  const updated = await usersStore.updateUser(Number(id), data)
  emit('updated', updated)
  await router.push({ name: 'user-details', params: { id } })
}
</script>

<template>
  <section class="card">
    <div class="card-body p-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 class="h6 fw-bold text-uppercase mb-0">Edit user</h2>
        <RouterLink
          :to="{ name: 'user-details', params: { id } }"
          class="btn btn-sm btn-outline-secondary"
        >
          Cancel
        </RouterLink>
      </div>

      <!-- key перестворює форму, якщо дані юзера змінились -->
      <UserForm
        v-if="initialData"
        :key="id"
        :action="saveUser"
        :initial-data="initialData"
        submit-text="Save changes"
      />
    </div>
  </section>
</template>
