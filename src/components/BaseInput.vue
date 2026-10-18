<script setup lang="ts">
defineOptions({ inheritAttrs: false })

interface Props {
  id: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'date'
  placeholder?: string
  error?: string
  isValid?: boolean
}

const {
  id,
  label,
  type = 'text',
  placeholder = '',
  error = '',
  isValid = false,
} = defineProps<Props>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :id="id"
      v-model.trim="model"
      v-bind="$attrs"
      :type="type"
      :placeholder="placeholder"
      class="form-control"
      :class="{ 'is-invalid': error, 'is-valid': isValid }"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>
