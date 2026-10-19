<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import type { Participant } from '@/types/participant'

type SortKey = 'name' | 'birthDate'
type SortDirection = 'asc' | 'desc'

const { participants } = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  edit: [participant: Participant]
  delete: [participant: Participant]
}>()

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
  return [...participants].sort((a, b) => a[key].localeCompare(b[key]) * direction)
})

function getSortIcon(key: SortKey): string {
  const isDesc = sortKey.value === key && sortDirection.value === 'desc'
  if (key === 'name') {
    return isDesc ? 'bi-sort-alpha-up' : 'bi-sort-alpha-down'
  }
  return isDesc ? 'bi-sort-up' : 'bi-sort-down'
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
              :class="{ 'sort-button--active': sortKey === 'birthDate' }"
              @click="toggleSort('birthDate')"
            >
              Date of Birth <i class="bi" :class="getSortIcon('birthDate')"></i>
            </button>
          </th>
          <th scope="col">Email</th>
          <th scope="col">Phone number</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(participant, index) in sortedParticipants" :key="participant.id">
          <td class="text-muted">{{ index + 1 }}</td>
          <td>{{ participant.name }}</td>
          <td>{{ participant.birthDate }}</td>
          <td>{{ participant.email }}</td>
          <td>{{ participant.phone }}</td>
          <td>
            <BaseButton size="sm" variant="outline-primary" @click="emit('edit', participant)">
              Edit data
            </BaseButton>
          </td>
          <td>
            <BaseButton size="sm" variant="outline-danger" @click="emit('delete', participant)">
              Delete participant
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.participants-table {
  th,
  td {
    white-space: nowrap;
  }
}

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
