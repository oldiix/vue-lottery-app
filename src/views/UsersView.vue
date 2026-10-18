<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BasePagination from '@/components/BasePagination.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import SearchBar from '@/components/SearchBar.vue'
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
</script>

<template>
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
</template>
