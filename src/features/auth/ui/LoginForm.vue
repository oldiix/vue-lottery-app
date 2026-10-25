<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { BaseButton, BaseInput } from '@/shared/ui'
import { useSessionStore, type LoginCredentials } from '@/entities/session'

const session = useSessionStore()
const route = useRoute()
const router = useRouter()

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

const authError = ref('')

function getRedirectPath(): string {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/users'
}

const onSubmit = handleSubmit(async (values) => {
  authError.value = ''
  try {
    await session.login(values)
    await router.push(getRedirectPath())
  } catch (error) {
    authError.value = error instanceof Error ? error.message : 'Login failed'
  }
})
</script>

<template>
  <div v-if="authError" class="alert alert-danger" role="alert">{{ authError }}</div>

  <form novalidate @submit.prevent="onSubmit">
    <BaseInput
      id="login-username"
      v-model="username"
      v-bind="usernameAttrs"
      label="Username"
      placeholder="Enter username"
      autocomplete="username"
      :error="errors.username"
    />
    <BaseInput
      id="login-password"
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      label="Password"
      placeholder="Enter password"
      autocomplete="current-password"
      :error="errors.password"
    />
    <BaseButton type="submit" class="w-100 mt-2" :disabled="isSubmitting">
      {{ isSubmitting ? 'Signing in...' : 'Login' }}
    </BaseButton>
  </form>
</template>
