<script setup lang="ts">
import AppHeader from '@/widgets/app-header/ui/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="default-layout">
    <slot />
  </main>
</template>

<style scoped lang="scss">
.default-layout {
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
}
</style>
