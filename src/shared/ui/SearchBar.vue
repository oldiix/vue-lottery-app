<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  'filter-by-name': [value: string]
}>()

const query = ref('')

watch(query, (value, _oldValue, onCleanup) => {
  const timerId = setTimeout(() => {
    emit('filter-by-name', value.trim())
  }, 300)

  onCleanup(() => clearTimeout(timerId))
})
</script>

<template>
  <div class="search-bar">
    <i class="bi bi-search search-bar__icon"></i>
    <input
      v-model="query"
      type="search"
      class="form-control search-bar__input"
      placeholder="Search by name"
      aria-label="Search by name"
    />
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  position: relative;

  &__icon {
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    color: var(--bs-secondary-color);
  }

  &__input {
    padding-left: 2.25rem;
  }
}
</style>
