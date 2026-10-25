<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { AppButton, AppInput, useNotify } from '@/shared/ui'
import { useSessionStore, type LoginCredentials } from '@/entities/session'

const session = useSessionStore()
const route = useRoute()
const router = useRouter()
const notify = useNotify()

const validationSchema = yup.object({
  username: yup.string().trim().required('Username is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

const { defineField, errors, handleSubmit, isSubmitting } = useForm<LoginCredentials>({
  validationSchema,
  initialValues: { username: '', password: '' },
})

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

function getRedirectPath(): string {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/users'
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await session.login(values)
    await router.push(getRedirectPath())
  } catch (error) {
    notify.error('Login failed', error instanceof Error ? error.message : undefined)
  }
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <AppInput
      v-model="username"
      v-bind="usernameAttrs"
      label="Username"
      placeholder="Enter username"
      autocomplete="username"
      :error="errors.username"
    />
    <AppInput
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      label="Password"
      placeholder="Enter password"
      autocomplete="current-password"
      :error="errors.password"
    />
    <AppButton type="submit" label="Login" class="w-100 mt-2" :loading="isSubmitting" />
  </form>
</template>
