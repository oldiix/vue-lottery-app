<script setup lang="ts">
import AppLogo from '@/widgets/app-header/ui/AppLogo.vue'
</script>

<template>
  <main class="auth-layout">
    <div class="auth-layout__box">
      <div class="auth-layout__logo">
        <AppLogo />
      </div>
      <div class="card">
        <div class="card-body p-4">
          <slot />
        </div>
      </div>
      <RouterLink to="/" class="auth-layout__back">
        <i class="bi bi-arrow-left"></i> Back to Home
      </RouterLink>
    </div>
  </main>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;

  &__box {
    width: 100%;
    max-width: 400px;
  }

  &__logo {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  &__back {
    display: block;
    margin-top: 1rem;
    text-align: center;
  }
}
</style>
