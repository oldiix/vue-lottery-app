<script setup lang="ts">
import { computed } from 'vue'

const { currentPage, totalPages } = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const SIBLINGS = 2

const pages = computed(() => {
  const start = Math.max(1, currentPage - SIBLINGS)
  const end = Math.min(totalPages, currentPage + SIBLINGS)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

function goTo(page: number): void {
  if (page >= 1 && page <= totalPages && page !== currentPage) {
    emit('change', page)
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button
          type="button"
          class="page-link"
          :disabled="currentPage === 1"
          aria-label="Previous page"
          @click="goTo(currentPage - 1)"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
      </li>

      <li
        v-for="page in pages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <button
          type="button"
          class="page-link"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button
          type="button"
          class="page-link"
          :disabled="currentPage === totalPages"
          aria-label="Next page"
          @click="goTo(currentPage + 1)"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </li>
    </ul>
  </nav>
</template>
