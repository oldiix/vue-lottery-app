<script setup lang="ts">
import { ThemeToggle } from '@/features/theme-toggle'
import AppLogo from './AppLogo.vue'
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <AppLogo />
      <div class="app-header__right">
        <AppNavigation />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background-color: var(--p-content-background);
  border-bottom: 1px solid var(--p-content-border-color);

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

  &__right {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
