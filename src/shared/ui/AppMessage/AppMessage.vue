<script setup lang="ts">
import Message from 'primevue/message'

const { severity = 'error' } = defineProps<{
  severity?: 'error' | 'success' | 'info' | 'warn'
}>()
</script>

<template>
  <Message :severity="severity">
    <slot />
  </Message>
</template>
