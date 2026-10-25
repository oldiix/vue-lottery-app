<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  AppButton,
  AppConfirmDialog,
  AppMessage,
  AppPaginator,
  AppSpinner,
  SearchBar,
  useNotify,
} from '@/shared/ui'
import { UsersTable } from '@/widgets/users-table'
import { UserForm } from '@/features/user-form'
import { WinnersBlock } from '@/features/pick-winner'
import { useUsersStore, type User } from '@/entities/user'

const PAGE_SIZE = 10

const route = useRoute()
const router = useRouter()
const notify = useNotify()

const usersStore = useUsersStore()
const { users, total, isLoading, error } = storeToRefs(usersStore)
const { fetchUsers, createUser, removeUser } = usersStore

const currentPage = computed(() => {
  const page = Number(route.query.page)
  return Number.isInteger(page) && page > 0 ? page : 1
})

const searchQuery = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))

async function loadUsers(): Promise<void> {
  await fetchUsers({
    limit: PAGE_SIZE,
    skip: (currentPage.value - 1) * PAGE_SIZE,
    q: searchQuery.value,
  })
}

watch([currentPage, searchQuery], loadUsers, { immediate: true })

function changePage(page: number): void {
  router.push({ query: { ...route.query, page: page > 1 ? String(page) : undefined } })
}

function search(value: string): void {
  router.push({ query: { q: value || undefined } })
}

function editUser(user: User): void {
  router.push({ name: 'user-edit', params: { id: user.id } })
}

const deletingUser = ref<User | null>(null)
const isDeleting = ref(false)

const isDeleteDialogOpen = computed({
  get: () => deletingUser.value !== null,
  set: (value: boolean) => {
    if (!value) {
      deletingUser.value = null
    }
  },
})

function openDeleteDialog(user: User): void {
  deletingUser.value = user
}

async function confirmDelete(): Promise<void> {
  const user = deletingUser.value
  if (!user) {
    return
  }
  isDeleting.value = true
  try {
    await removeUser(user.id)
    notify.success('User deleted', `${user.firstName} ${user.lastName}`)
    deletingUser.value = null
  } catch (e) {
    notify.error('Failed to delete user', e instanceof Error ? e.message : undefined)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <WinnersBlock />
    </div>
  </div>

  <div class="card mb-3">
    <div class="card-body p-4">
      <h2 class="h6 fw-bold text-uppercase mb-1">Register form</h2>
      <p class="text-muted mb-4">Please fill in all the fields.</p>
      <UserForm :action="createUser" success-message="User created" reset-after-submit />
    </div>
  </div>

  <div class="card">
    <div class="card-body p-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h1 class="h5 fw-bold text-uppercase mb-0">Users</h1>
        <span class="text-muted small">Total: {{ total }}</span>
      </div>

      <SearchBar class="mb-3" :initial-value="searchQuery" @filter-by-name="search" />

      <AppSpinner v-if="isLoading" />

      <AppMessage v-else-if="error">
        <div class="d-flex justify-content-between align-items-center gap-3 w-100">
          <span>{{ error }}</span>
          <AppButton
            label="Retry"
            size="small"
            severity="danger"
            variant="outlined"
            @click="loadUsers"
          />
        </div>
      </AppMessage>

      <template v-else>
        <UsersTable
          :users="users"
          :start-index="(currentPage - 1) * PAGE_SIZE"
          @edit="editUser"
          @delete="openDeleteDialog"
        />
        <AppPaginator
          class="mt-4"
          :page="currentPage"
          :rows="PAGE_SIZE"
          :total-records="total"
          @change="changePage"
        />
      </template>
    </div>
  </div>

  <AppConfirmDialog
    v-model:visible="isDeleteDialogOpen"
    header="Delete participant"
    :loading="isDeleting"
    @confirm="confirmDelete"
  >
    <template v-if="deletingUser">
      Are you sure you want to delete participant "{{ deletingUser.firstName }}
      {{ deletingUser.lastName }}", "{{ deletingUser.email }}"?
    </template>
  </AppConfirmDialog>
</template>
