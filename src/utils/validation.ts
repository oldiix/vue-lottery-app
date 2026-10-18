import type { FormErrors, ParticipantForm } from '@/types/participant'

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEXP = /^\+380\d{9}$/

export function getToday(): string {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function validateField(field: keyof ParticipantForm, value: string): string {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'This value is required.'
  }
  if (field === 'email' && !EMAIL_REGEXP.test(trimmed)) {
    return 'Please enter a valid email.'
  }
  if (field === 'phone' && !PHONE_REGEXP.test(trimmed)) {
    return 'Phone must be in format +380XXXXXXXXX.'
  }
  if (field === 'birthDate' && trimmed > getToday()) {
    return 'Date of birth cannot be in the future.'
  }
  return ''
}

export function validateForm(form: ParticipantForm): FormErrors {
  const errors: FormErrors = {}
  const fields = Object.keys(form) as (keyof ParticipantForm)[]

  fields.forEach((field) => {
    const error = validateField(field, form[field])
    if (error) {
      errors[field] = error
    }
  })

  return errors
}
