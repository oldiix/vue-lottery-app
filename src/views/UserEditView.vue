<script setup lang="ts">
const { id } = defineProps<{
  id: string
}>()
</script>

<template>
  <h2>Edit user #{{ id }}</h2>
</template>
