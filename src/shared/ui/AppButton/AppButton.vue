<script setup lang="ts">
import Button from 'primevue/button'

const {
  label,
  type = 'button',
  severity,
  variant,
  size,
  icon,
  loading = false,
  disabled = false,
} = defineProps<{
  label: string
  type?: 'button' | 'submit'
  severity?: 'secondary' | 'danger' | 'success' | 'contrast'
  variant?: 'outlined' | 'text'
  size?: 'small' | 'large'
  icon?: string
  loading?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Button
    :type="type"
    :label="label"
    :severity="severity"
    :variant="variant"
    :size="size"
    :icon="icon"
    :loading="loading"
    :disabled="disabled"
    @click="emit('click', $event)"
  />
</template>
