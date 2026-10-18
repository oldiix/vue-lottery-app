<script setup lang="ts">
import { ref, useId } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { CreateUserDto, Gender } from '@/types/user'

interface UserFormValues {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: string
  gender: Gender | ''
  phone: string
}

const PHONE_REGEXP = /^\+?[\d\s()-]{7,20}$/

const {
  action,
  initialData,
  submitText = 'Save',
  resetAfterSubmit = false,
} = defineProps<{
  action: (data: CreateUserDto) => Promise<unknown>
  initialData?: Partial<CreateUserDto>
  submitText?: string
  resetAfterSubmit?: boolean
}>()

const uid = useId()

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
    // порожнє поле - це "не заповнено", а не помилка формату
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

const submitError = ref('')

const onSubmit = handleSubmit(async (values) => {
  submitError.value = ''
  try {
    await action({
      ...values,
      age: Number(values.age),
      gender: values.gender as Gender,
    })
    if (resetAfterSubmit) {
      resetForm()
    }
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Something went wrong'
  }
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div v-if="submitError" class="alert alert-danger" role="alert">{{ submitError }}</div>

    <div class="user-form__grid">
      <BaseInput
        :id="`${uid}-first-name`"
        v-model="firstName"
        v-bind="firstNameAttrs"
        label="First name"
        placeholder="Enter first name"
        :error="errors.firstName"
      />
      <BaseInput
        :id="`${uid}-last-name`"
        v-model="lastName"
        v-bind="lastNameAttrs"
        label="Last name"
        placeholder="Enter last name"
        :error="errors.lastName"
      />
      <BaseInput
        :id="`${uid}-email`"
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        label="Email"
        placeholder="Enter email"
        :error="errors.email"
      />
      <BaseInput
        :id="`${uid}-username`"
        v-model="username"
        v-bind="usernameAttrs"
        label="Username"
        placeholder="Enter username"
        :error="errors.username"
      />
      <BaseInput
        :id="`${uid}-password`"
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        label="Password"
        placeholder="Enter password"
        autocomplete="new-password"
        :error="errors.password"
      />
      <BaseInput
        :id="`${uid}-age`"
        v-model="age"
        v-bind="ageAttrs"
        type="number"
        label="Age"
        placeholder="Enter age"
        :error="errors.age"
      />

      <div class="mb-3">
        <label :for="`${uid}-gender`" class="form-label">Gender</label>
        <select
          :id="`${uid}-gender`"
          v-model="gender"
          v-bind="genderAttrs"
          class="form-select"
          :class="{ 'is-invalid': errors.gender }"
        >
          <option value="" disabled>Choose gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <div v-if="errors.gender" class="invalid-feedback">{{ errors.gender }}</div>
      </div>

      <BaseInput
        :id="`${uid}-phone`"
        v-model="phone"
        v-bind="phoneAttrs"
        type="tel"
        label="Phone number"
        placeholder="+380 63 123 4567"
        :error="errors.phone"
      />
    </div>

    <div class="d-flex justify-content-end mt-2">
      <BaseButton type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : submitText }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  column-gap: 1rem;
}
</style>
