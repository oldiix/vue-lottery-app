<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'

const session = useSessionStore()
const router = useRouter()

async function logout(): Promise<void> {
  session.clearSession()
  await router.push({ name: 'login' })
}
</script>

<template>
  <button type="button" @click="logout">Logout</button>
</template>
