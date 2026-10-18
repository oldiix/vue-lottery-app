<script setup lang="ts">
interface NavigationItem {
  label: string
  to: string
}

const items: NavigationItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About author', to: '/about' },
  { label: 'Users', to: '/users' },
  { label: 'Login', to: '/login' },
]
</script>

<template>
  <nav aria-label="Main navigation">
    <ul class="app-navigation">
      <li v-for="item in items" :key="item.to">
        <RouterLink :to="item.to" class="app-navigation__link">
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.app-navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;

  &__link {
    display: block;
    padding: 0.375rem 0.75rem;
    border-radius: var(--bs-border-radius);
    color: var(--bs-body-color);
    text-decoration: none;

    &:hover {
      background-color: var(--bs-tertiary-bg);
    }

    // активний пункт меню
    &.router-link-active {
      background-color: var(--bs-primary);
      color: #fff;
    }
  }
}
</style>
