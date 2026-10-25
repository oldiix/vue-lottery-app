<script setup lang="ts">
const { name } = defineProps<{
  name: string
}>()

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <span class="badge bg-primary winner-item">
    {{ name }}
    <button
      type="button"
      class="winner-item__remove"
      :aria-label="`Remove ${name}`"
      @click="emit('remove')"
    >
      <i class="bi bi-x"></i>
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &__remove {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    line-height: 1;
  }
}
</style>
