<script setup lang="ts">
import { computed, useId } from 'vue'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

defineOptions({ inheritAttrs: false })

const {
  label,
  id,
  type = 'text',
  placeholder = '',
  error = '',
} = defineProps<{
  label: string
  id?: string
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date'
  placeholder?: string
  error?: string
}>()

const model = defineModel<string>({ required: true })

const generatedId = useId()
const inputId = computed(() => id ?? generatedId)
</script>

<template>
  <div class="app-input">
    <label :for="inputId" class="app-input__label">{{ label }}</label>
    <InputText
      :id="inputId"
      v-model.trim="model"
      v-bind="$attrs"
      :type="type"
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
.app-input {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;

  &__label {
    font-weight: 600;
  }
}
</style>
