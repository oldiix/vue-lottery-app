<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AppButton } from '@/shared/ui'
import { UserForm } from '@/features/user-form'
import { useUsersStore, type CreateUserDto, type User } from '@/entities/user'

const { id, user } = defineProps<{
  id: string
  user: User
}>()

const emit = defineEmits<{
  updated: [user: User]
}>()

const router = useRouter()
const { updateUser } = useUsersStore()

async function saveUser(data: CreateUserDto): Promise<void> {
  const updated = await updateUser(Number(id), data)
  emit('updated', updated)
  await router.push({ name: 'user-details', params: { id } })
}
</script>

<template>
  <section class="card">
    <div class="card-body p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h6 fw-bold text-uppercase mb-0">Edit user</h2>
        <AppButton
          label="Cancel"
          size="small"
          severity="secondary"
          variant="outlined"
          :to="{ name: 'user-details', params: { id } }"
        />
      </div>

      <UserForm
        :action="saveUser"
        :initial-data="user"
        submit-text="Update data"
        success-message="User updated"
      />
    </div>
  </section>
</template>
