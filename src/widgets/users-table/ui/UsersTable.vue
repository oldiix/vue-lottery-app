<script setup lang="ts">
import { AppButton, AppTable, type AppTableColumn } from '@/shared/ui'
import type { User } from '@/entities/user'

const { users, startIndex = 0 } = defineProps<{
  users: User[]
  startIndex?: number
}>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
}>()

const columns: AppTableColumn[] = [
  { field: 'index', header: '#' },
  { field: 'firstName', header: 'Name', sortable: true },
  { field: 'age', header: 'Age', sortable: true },
  { field: 'gender', header: 'Gender' },
  { field: 'email', header: 'Email' },
  { field: 'phone', header: 'Phone number' },
]
</script>

<template>
  <AppTable :rows="users" :columns="columns" empty-message="No users found">
    <template #cell-index="{ index }">
      {{ startIndex + index + 1 }}
    </template>

    <template #cell-firstName="{ row }">
      <RouterLink :to="{ name: 'user-details', params: { id: row.id } }">
        {{ row.firstName }} {{ row.lastName }}
      </RouterLink>
    </template>

    <template #cell-gender="{ row }">
      <span class="text-capitalize">{{ row.gender }}</span>
    </template>

    <template #actions="{ row }">
      <AppButton
        label="Edit data"
        size="small"
        variant="outlined"
        icon="bi bi-pencil"
        @click="emit('edit', row)"
      />
      <AppButton
        label="Delete participant"
        size="small"
        severity="danger"
        variant="outlined"
        icon="bi bi-trash"
        @click="emit('delete', row)"
      />
    </template>
  </AppTable>
</template>
