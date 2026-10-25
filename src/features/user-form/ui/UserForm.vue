<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { AppButton, AppInput, AppSelect, useNotify, type AppSelectOption } from '@/shared/ui'
import type { CreateUserDto, Gender } from '@/entities/user'

interface UserFormValues {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: string
  gender: string
  phone: string
}

const PHONE_REGEXP = /^\+?[\d\s()-]{7,20}$/

const GENDER_OPTIONS: AppSelectOption[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

const {
  action,
  initialData,
  submitText = 'Save',
  successMessage = 'Saved',
  resetAfterSubmit = false,
} = defineProps<{
  action: (data: CreateUserDto) => Promise<unknown>
  initialData?: Partial<CreateUserDto>
  submitText?: string
  successMessage?: string
  resetAfterSubmit?: boolean
}>()

const notify = useNotify()

const validationSchema = yup.object({
  firstName: yup.string().trim().required('First name is required'),
  lastName: yup.string().trim().required('Last name is required'),
  email: yup.string().trim().required('Email is required').email('Enter a valid email'),
  username: yup
    .string()
    .trim()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  age: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Age must be a number')
    .required('Age is required')
    .integer('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be at most 120'),
  gender: yup.string().required('Gender is required').oneOf(['male', 'female'], 'Choose gender'),
  phone: yup
    .string()
    .trim()
    .required('Phone is required')
    .matches(PHONE_REGEXP, 'Enter a valid phone number'),
})

function createInitialValues(data?: Partial<CreateUserDto>): UserFormValues {
  return {
    firstName: data?.firstName ?? '',
    lastName: data?.lastName ?? '',
    email: data?.email ?? '',
    username: data?.username ?? '',
    password: data?.password ?? '',
    age: data?.age !== undefined ? String(data.age) : '',
    gender: data?.gender ?? '',
    phone: data?.phone ?? '',
  }
}

const { defineField, errors, handleSubmit, isSubmitting, resetForm } = useForm<UserFormValues>({
  validationSchema,
  initialValues: createInitialValues(initialData),
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [age, ageAttrs] = defineField('age')
const [gender, genderAttrs] = defineField('gender')
const [phone, phoneAttrs] = defineField('phone')

const onSubmit = handleSubmit(async (values) => {
  try {
    await action({
      ...values,
      age: Number(values.age),
      gender: values.gender as Gender,
    })
    notify.success(successMessage)
    if (resetAfterSubmit) {
      resetForm()
    }
  } catch (error) {
    notify.error('Something went wrong', error instanceof Error ? error.message : undefined)
  }
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="user-form__grid">
      <AppInput
        v-model="firstName"
        v-bind="firstNameAttrs"
        label="First name"
        placeholder="Enter first name"
        :error="errors.firstName"
      />
      <AppInput
        v-model="lastName"
        v-bind="lastNameAttrs"
        label="Last name"
        placeholder="Enter last name"
        :error="errors.lastName"
      />
      <AppInput
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        label="Email"
        placeholder="Enter email"
        :error="errors.email"
      />
      <AppInput
        v-model="username"
        v-bind="usernameAttrs"
        label="Username"
        placeholder="Enter username"
        :error="errors.username"
      />
      <AppInput
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        label="Password"
        placeholder="Enter password"
        autocomplete="new-password"
        :error="errors.password"
      />
      <AppInput
        v-model="age"
        v-bind="ageAttrs"
        type="number"
        label="Age"
        placeholder="Enter age"
        :error="errors.age"
      />
      <AppSelect
        v-model="gender"
        v-bind="genderAttrs"
        label="Gender"
        placeholder="Choose gender"
        :options="GENDER_OPTIONS"
        :error="errors.gender"
      />
      <AppInput
        v-model="phone"
        v-bind="phoneAttrs"
        type="tel"
        label="Phone number"
        placeholder="+380 63 123 4567"
        :error="errors.phone"
      />
    </div>

    <div class="user-form__actions">
      <AppButton type="submit" :label="submitText" :loading="isSubmitting" />
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    column-gap: 1rem;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
