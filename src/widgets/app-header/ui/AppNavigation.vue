<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/entities/session'
import { LogoutButton } from '@/features/auth'

interface NavigationItem {
  label: string
  to: string
}

const { isAuthenticated, user } = storeToRefs(useSessionStore())

const items: NavigationItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About author', to: '/about' },
  { label: 'Users', to: '/users' },
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

      <template v-if="isAuthenticated">
        <li v-if="user" class="app-navigation__user">
          <i class="bi bi-person-circle"></i> {{ user.firstName }}
        </li>
        <li>
          <LogoutButton class="app-navigation__link" />
        </li>
      </template>
      <li v-else>
        <RouterLink to="/login" class="app-navigation__link">Login</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.app-navigation {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;

  &__link {
    display: block;
    padding: 0.375rem 0.75rem;
    border: 0;
    border-radius: var(--bs-border-radius);
    background: none;
    color: var(--bs-body-color);
    text-decoration: none;

    &:hover {
      background-color: var(--bs-tertiary-bg);
    }

    &.router-link-active {
      background-color: var(--bs-primary);
      color: #fff;
    }
  }

  &__user {
    padding: 0 0.75rem;
    color: var(--bs-secondary-color);
  }
}
</style>
