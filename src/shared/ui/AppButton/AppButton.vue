<script setup lang="ts">
import Button from 'primevue/button'
import type { RouteLocationRaw } from 'vue-router'

const {
  label,
  type = 'button',
  severity,
  variant,
  size,
  icon,
  loading = false,
  disabled = false,
  to,
  href,
} = defineProps<{
  label: string
  type?: 'button' | 'submit'
  severity?: 'secondary' | 'danger' | 'success' | 'contrast'
  variant?: 'outlined' | 'text'
  size?: 'small' | 'large'
  icon?: string
  loading?: boolean
  disabled?: boolean
  to?: RouteLocationRaw
  href?: string
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Button
    :as="to ? 'router-link' : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    :type="to || href ? undefined : type"
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
