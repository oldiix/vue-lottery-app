<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import BasePagination from '@/components/BasePagination.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import UserForm from '@/components/UserForm.vue'
import WinnersBlock from '@/components/WinnersBlock.vue'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/types/user'

const PAGE_SIZE = 10

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const currentPage = computed(() => {
  const page = Number(route.query.page)
  return Number.isInteger(page) && page > 0 ? page : 1
})

const searchQuery = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))

const totalPages = computed(() => Math.max(1, Math.ceil(usersStore.total / PAGE_SIZE)))

async function loadUsers(): Promise<void> {
  await usersStore.fetchUsers({
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
const deleteError = ref('')

function openDeleteModal(user: User): void {
  deletingUser.value = user
  deleteError.value = ''
}

function closeDeleteModal(): void {
  if (!isDeleting.value) {
    deletingUser.value = null
  }
}

async function confirmDelete(): Promise<void> {
  if (!deletingUser.value) {
    return
  }
  isDeleting.value = true
  deleteError.value = ''
  try {
    await usersStore.removeUser(deletingUser.value.id)
    deletingUser.value = null
  } catch (error) {
    deleteError.value = error instanceof Error ? error.message : 'Failed to delete user'
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <WinnersBlock
        :winners="usersStore.winners"
        :can-add-winner="usersStore.canAddWinner"
        @add="usersStore.addRandomWinner"
        @remove="usersStore.removeWinner"
      />
    </div>
  </div>

  <div class="card mb-3">
    <div class="card-body p-4">
      <h2 class="h6 fw-bold text-uppercase mb-1">Register form</h2>
      <p class="text-muted mb-4">Please fill in all the fields.</p>
      <UserForm :action="usersStore.addUser" reset-after-submit />
    </div>
  </div>

  <div class="card">
    <div class="card-body p-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h1 class="h5 fw-bold text-uppercase mb-0">Users</h1>
        <span class="text-muted small">Total: {{ usersStore.total }}</span>
      </div>

      <SearchBar class="mb-3" :initial-value="searchQuery" @filter-by-name="search" />

      <div v-if="usersStore.isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status" aria-label="Loading"></div>
      </div>

      <div
        v-else-if="usersStore.error"
        class="alert alert-danger d-flex justify-content-between align-items-center mb-0"
        role="alert"
      >
        <span>{{ usersStore.error }}</span>
        <BaseButton size="sm" variant="outline-danger" @click="loadUsers">Retry</BaseButton>
      </div>

      <p v-else-if="usersStore.users.length === 0" class="text-center text-muted py-5 mb-0">
        No users found
      </p>

      <template v-else>
        <ParticipantsTable
          :participants="usersStore.users"
          :start-index="(currentPage - 1) * PAGE_SIZE"
          @edit="editUser"
          @delete="openDeleteModal"
        />
        <BasePagination
          class="mt-4"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="changePage"
        />
      </template>
    </div>
  </div>

  <BaseModal v-if="deletingUser" title="Delete participant" @close="closeDeleteModal">
    <div v-if="deleteError" class="alert alert-danger" role="alert">{{ deleteError }}</div>
    <p class="mb-0">
      Are you sure you want to delete participant "{{ deletingUser.firstName }}
      {{ deletingUser.lastName }}", "{{ deletingUser.email }}"?
    </p>
    <template #footer>
      <BaseButton variant="danger" :disabled="isDeleting" @click="confirmDelete">
        {{ isDeleting ? 'Deleting...' : 'Yes' }}
      </BaseButton>
      <BaseButton variant="secondary" :disabled="isDeleting" @click="closeDeleteModal">
        No
      </BaseButton>
    </template>
  </BaseModal>
</template>
