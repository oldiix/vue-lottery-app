<script setup lang="ts">
import Paginator from 'primevue/paginator'
import type { PageState } from 'primevue/paginator'

const { page, rows, totalRecords } = defineProps<{
  page: number
  rows: number
  totalRecords: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

function onPage(event: PageState): void {
  emit('change', event.page + 1)
}
</script>

<template>
  <Paginator
    v-if="totalRecords > rows"
    :first="(page - 1) * rows"
    :rows="rows"
    :total-records="totalRecords"
    @page="onPage"
  />
</template>
