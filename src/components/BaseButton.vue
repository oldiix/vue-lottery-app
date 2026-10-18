<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'danger' | 'outline-primary' | 'outline-danger'
  size?: 'sm' | 'lg'
  disabled?: boolean
}

const { type = 'button', variant = 'primary', size, disabled = false } = defineProps<Props>()
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn-${variant}`, size ? `btn-${size}` : '']"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
