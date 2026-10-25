<script setup lang="ts">
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'

const { initialValue = '', placeholder = 'Search by name' } = defineProps<{
  initialValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'filter-by-name': [value: string]
}>()

const query = ref(initialValue)

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
    <InputText
      v-model="query"
      type="search"
      :placeholder="placeholder"
      :aria-label="placeholder"
      class="search-bar__input"
      fluid
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
    z-index: 1;
    transform: translateY(-50%);
    color: var(--p-text-muted-color);
  }

  &__input {
    padding-left: 2.25rem;
  }
}
</style>
