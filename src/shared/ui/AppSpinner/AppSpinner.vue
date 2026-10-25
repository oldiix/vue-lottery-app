<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
</script>

<template>
  <div class="app-spinner">
    <ProgressSpinner class="app-spinner__icon" stroke-width="4" aria-label="Loading" />
  </div>
</template>

<style scoped lang="scss">
.app-spinner {
  display: flex;
  justify-content: center;
  padding: 3rem 0;

  &__icon {
    width: 3rem;
    height: 3rem;
  }
}
</style>
