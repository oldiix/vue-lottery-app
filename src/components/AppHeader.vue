<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import AppNavigation from '@/components/AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <AppLogo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background-color: #fff;
  border-bottom: 1px solid var(--bs-border-color);

  &__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 960px;
    margin: 0 auto;
    padding: 0.75rem 1rem;
  }
}
</style>
