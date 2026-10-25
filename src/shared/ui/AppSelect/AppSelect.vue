<script setup lang="ts">
import { computed, useId } from 'vue'
import Select from 'primevue/select'
import Message from 'primevue/message'
import type { AppSelectOption } from './types'

defineOptions({ inheritAttrs: false })

const {
  label,
  options,
  id,
  placeholder = '',
  error = '',
} = defineProps<{
  label: string
  options: AppSelectOption[]
  id?: string
  placeholder?: string
  error?: string
}>()

const model = defineModel<string>({ required: true })

const generatedId = useId()
const inputId = computed(() => id ?? generatedId)
</script>

<template>
  <div class="app-select">
    <label :for="inputId" class="app-select__label">{{ label }}</label>
    <Select
      v-model="model"
      v-bind="$attrs"
      :input-id="inputId"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      :invalid="Boolean(error)"
      fluid
    />
    <Message v-if="error" severity="error" size="small" variant="simple">
      {{ error }}
    </Message>
  </div>
</template>

<style scoped lang="scss">
.app-select {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;

  &__label {
    font-weight: 600;
  }
}
</style>
