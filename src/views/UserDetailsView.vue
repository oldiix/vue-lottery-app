<script setup lang="ts">
const { id } = defineProps<{
  id: string
}>()
</script>

<template>
  <h1>User #{{ id }}</h1>
  <!-- сюди підставиться вкладений маршрут редагування -->
  <RouterView />
</template>
