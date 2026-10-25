<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseButton } from '@/shared/ui'
import type { User } from '@/entities/user'

type SortKey = 'name' | 'age'
type SortDirection = 'asc' | 'desc'

const { participants, startIndex = 0 } = defineProps<{
  participants: User[]
  startIndex?: number
}>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
}>()

function getFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`
}

const sortKey = ref<SortKey | null>(null)
const sortDirection = ref<SortDirection>('asc')

function toggleSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const sortedParticipants = computed(() => {
  const key = sortKey.value
  if (!key) {
    return participants
  }
  const direction = sortDirection.value === 'asc' ? 1 : -1
  return [...participants].sort((a, b) => {
    const result = key === 'name' ? getFullName(a).localeCompare(getFullName(b)) : a.age - b.age
    return result * direction
  })
})

function getSortIcon(key: SortKey): string {
  const isDesc = sortKey.value === key && sortDirection.value === 'desc'
  if (key === 'name') {
    return isDesc ? 'bi-sort-alpha-up' : 'bi-sort-alpha-down'
  }
  return isDesc ? 'bi-sort-numeric-up' : 'bi-sort-numeric-down'
}
</script>

<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0 participants-table">
      <thead>
        <tr>
          <th scope="col" class="text-muted">#</th>
          <th scope="col">
            <button
              type="button"
              class="sort-button"
              :class="{ 'sort-button--active': sortKey === 'name' }"
              @click="toggleSort('name')"
            >
              Name <i class="bi" :class="getSortIcon('name')"></i>
            </button>
          </th>
          <th scope="col">
            <button
              type="button"
              class="sort-button"
              :class="{ 'sort-button--active': sortKey === 'age' }"
              @click="toggleSort('age')"
            >
              Age <i class="bi" :class="getSortIcon('age')"></i>
            </button>
          </th>
          <th scope="col">Gender</th>
          <th scope="col">Email</th>
          <th scope="col">Phone number</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>

      <!-- Users rows -->
      <tbody>
        <tr v-for="(user, index) in sortedParticipants" :key="user.id">
          <td class="text-muted">{{ startIndex + index + 1 }}</td>
          <td>
            <RouterLink :to="{ name: 'user-details', params: { id: user.id } }">
              {{ getFullName(user) }}
            </RouterLink>
          </td>
          <td>{{ user.age }}</td>
          <td class="text-capitalize">{{ user.gender }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>
            <BaseButton size="sm" variant="outline-primary" @click="emit('edit', user)">
              Edit data
            </BaseButton>
          </td>
          <td>
            <BaseButton size="sm" variant="outline-danger" @click="emit('delete', user)">
              Delete participant
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
// щоб текст у клітинках не переносився
.participants-table {
  th,
  td {
    white-space: nowrap;
  }
}

// заголовки сортування виглядають як звичайний текст
.sort-button {
  padding: 0;
  border: 0;
  background: none;
  font-weight: inherit;
  color: inherit;

  .bi {
    opacity: 0.4;
  }

  &--active .bi {
    opacity: 1;
    color: var(--bs-primary);
  }
}
</style>
