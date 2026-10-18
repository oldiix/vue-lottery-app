<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { FormErrors, ParticipantForm } from '@/types/participant'
import { getToday, validateForm } from '@/utils/validation'

type Field = keyof ParticipantForm

interface Props {
  takenEmails: string[]
  initialData?: ParticipantForm
  submitText?: string
}

const { takenEmails, initialData, submitText = 'Save' } = defineProps<Props>()

const emit = defineEmits<{
  save: [data: ParticipantForm]
}>()

const uid = useId()
const today = getToday()

function createEmptyForm(): ParticipantForm {
  return { name: '', birthDate: '', email: '', phone: '' }
}

const form = ref<ParticipantForm>(initialData ? { ...initialData } : createEmptyForm())
const touched = ref<Partial<Record<Field, boolean>>>({})

const errors = computed<FormErrors>(() => {
  const result = validateForm(form.value)
  const email = form.value.email.toLowerCase()

  if (!result.email && takenEmails.includes(email)) {
    result.email = 'Participant with this email already exists.'
  }
  return result
})

const isFormValid = computed(() => Object.keys(errors.value).length === 0)

function touch(field: Field): void {
  touched.value[field] = true
}

function getError(field: Field): string {
  return touched.value[field] ? (errors.value[field] ?? '') : ''
}

function isFieldValid(field: Field): boolean {
  return Boolean(touched.value[field]) && !errors.value[field]
}

function onSubmit(): void {
  touched.value = { name: true, birthDate: true, email: true, phone: true }

  if (!isFormValid.value) {
    return
  }

  emit('save', { ...form.value })
  form.value = createEmptyForm()
  touched.value = {}
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit" @keydown.enter.prevent="onSubmit">
    <slot name="header" />

    <BaseInput
      :id="`${uid}-name`"
      v-model="form.name"
      label="Name"
      placeholder="Enter user name"
      :error="getError('name')"
      :is-valid="isFieldValid('name')"
      @input="touch('name')"
    />
    <BaseInput
      :id="`${uid}-birth-date`"
      v-model="form.birthDate"
      type="date"
      label="Date of Birth"
      :max="today"
      :error="getError('birthDate')"
      :is-valid="isFieldValid('birthDate')"
      @input="touch('birthDate')"
    />
    <BaseInput
      :id="`${uid}-email`"
      v-model="form.email"
      type="email"
      label="Email"
      placeholder="Enter email"
      :error="getError('email')"
      :is-valid="isFieldValid('email')"
      @input="touch('email')"
    />
    <BaseInput
      :id="`${uid}-phone`"
      v-model="form.phone"
      type="tel"
      label="Phone number"
      placeholder="+380XXXXXXXXX"
      :error="getError('phone')"
      :is-valid="isFieldValid('phone')"
      @input="touch('phone')"
    />

    <div class="d-flex justify-content-end mt-4">
      <BaseButton type="submit">{{ submitText }}</BaseButton>
    </div>
  </form>
</template>
