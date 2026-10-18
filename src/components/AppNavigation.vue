<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface NavigationItem {
  label: string
  to: string
}

const auth = useAuthStore()
const router = useRouter()

const items: NavigationItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About author', to: '/about' },
  { label: 'Users', to: '/users' },
]

async function logout(): Promise<void> {
  auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <nav aria-label="Main navigation">
    <ul class="app-navigation">
      <li v-for="item in items" :key="item.to">
        <RouterLink :to="item.to" class="app-navigation__link">
          {{ item.label }}
        </RouterLink>
      </li>

      <!-- для авторизованого замість Login показую Logout -->
      <template v-if="auth.isAuthenticated">
        <li v-if="auth.user" class="app-navigation__user">
          <i class="bi bi-person-circle"></i> {{ auth.user.firstName }}
        </li>
        <li>
          <button type="button" class="app-navigation__link" @click="logout">Logout</button>
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

    // активний пункт меню
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
