<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import type { Participant } from '@/types/participant'

type SortKey = 'name' | 'birthDate'
type SortDirection = 'asc' | 'desc'

// ---------- Props і події ----------

const { participants } = defineProps<{
  participants: Participant[]
}>()

// таблиця сама нічого не змінює, тільки повідомляє App
const emit = defineEmits<{
  edit: [participant: Participant]
  delete: [participant: Participant]
}>()

// ---------- Сортування ----------

// null - без сортування, в порядку додавання
const sortKey = ref<SortKey | null>(null)
const sortDirection = ref<SortDirection>('asc')

// повторний клік по тій самій колонці міняє напрямок
function toggleSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

// сортую копію, щоб не чіпати вихідний список
const sortedParticipants = computed(() => {
  const key = sortKey.value
  if (!key) {
    return participants
  }
  const direction = sortDirection.value === 'asc' ? 1 : -1
  return [...participants].sort((a, b) => a[key].localeCompare(b[key]) * direction)
})

// ---------- Іконки сортування ----------

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
      <!-- Header with sort controls -->
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

      <!-- Participants rows -->
      <tbody>
      <tr v-for="(participant,
