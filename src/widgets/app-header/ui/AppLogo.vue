<template>
  <RouterLink to="/" class="app-logo">
    <i class="bi bi-trophy-fill app-logo__icon"></i>
    <span>Vue Lottery</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--bs-body-color);
  text-decoration: none;

  &__icon {
    color: var(--bs-primary);
  }
}
</style>
