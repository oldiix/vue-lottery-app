<script setup lang="ts">
import { LoginForm } from '@/features/auth'
</script>

<template>
  <h1 class="h5 fw-bold text-uppercase mb-1">Login</h1>
  <p class="text-muted mb-4">Sign in to manage lottery participants.</p>

  <LoginForm />

  <p class="text-muted small text-center mt-3 mb-0">
    Test account: <code>emilys</code> / <code>emilyspass</code>
  </p>
</template>
