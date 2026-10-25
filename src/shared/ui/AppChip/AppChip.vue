<script setup lang="ts">
import Chip from 'primevue/chip'

const { label } = defineProps<{
  label: string
}>()

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <Chip :label="label" removable @remove="emit('remove')" />
</template>
