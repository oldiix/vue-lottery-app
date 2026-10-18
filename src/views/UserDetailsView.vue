<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/types/user'

interface DetailRow {
  label: string
  value: string | number | undefined
}

const { id } = defineProps<{
  id: string
}>()

const route = useRoute()
const usersStore = useUsersStore()

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadUser(): Promise<void> {
  isLoading.value = true
  error.value = null
  try {
    user.value = await usersStore.getUser(Number(id))
  } catch (e) {
    user.value = null
    error.value = e instanceof Error ? e.message : 'Failed to load user'
  } finally {
    isLoading.value = false
  }
}

watch(() => id, loadUser, { immediate: true })

const fullName = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
)

const details = computed(() => {
  const current = user.value
  if (!current) {
    return []
  }
  const rows: DetailRow[] = [
    { label: 'Username', value: current.username },
    { label: 'Email', value: current.email },
    { label: 'Phone', value: current.phone },
    { label: 'Age', value: current.age },
    { label: 'Gender', value: current.gender },
    { label: 'Birth date', value: current.birthDate },
    { label: 'University', value: current.university },
    {
      label: 'Company',
      value: current.company ? `${current.company.title}, ${current.company.name}` : undefined,
    },
    {
      label: 'Address',
      value: current.address
        ? `${current.address.address}, ${current.address.city}, ${current.address.country}`
        : undefined,
    },
  ]
  return rows.filter((row) => row.value !== undefined && row.value !== '')
})

const isEditing = computed(() => route.name === 'user-edit')
</script>

<template>
  <div v-if="isLoading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status" aria-label="Loading"></div>
  </div>

  <div v-else-if="error" class="card">
    <div class="card-body p-4">
      <div class="alert alert-danger" role="alert">{{ error }}</div>
      <RouterLink :to="{ name: 'users' }" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left"></i> Back to users
      </RouterLink>
    </div>
  </div>

  <template v-else-if="user">
    <section class="card mb-3">
      <div class="card-body p-4">
        <div class="d-flex flex-wrap align-items-center gap-4 mb-4">
          <img v-if="user.image" :src="user.image" :alt="fullName" class="user-avatar" />
          <div v-else class="user-avatar user-avatar--placeholder">
            <i class="bi bi-person"></i>
          </div>
          <div>
            <h1 class="h4 fw-bold mb-1">{{ fullName }}</h1>
            <p class="text-muted mb-0">@{{ user.username }}</p>
          </div>
        </div>

        <dl class="user-details">
          <template v-for="row in details" :key="row.label">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </template>
        </dl>

        <div class="d-flex flex-wrap gap-2">
          <RouterLink :to="{ name: 'users' }" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Back to users
          </RouterLink>
          <RouterLink
            v-if="!isEditing"
            :to="{ name: 'user-edit', params: { id } }"
            class="btn btn-primary"
          >
            <i class="bi bi-pencil"></i> Edit
          </RouterLink>
        </div>
      </div>
    </section>

    <RouterView :user="user" @updated="user = $event" />
  </template>
</template>

<style scoped lang="scss">
.user-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 1px solid var(--bs-border-color);
  object-fit: cover;

  &--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: var(--bs-secondary-color);
    background-color: var(--bs-tertiary-bg);
  }
}

.user-details {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 0.5rem 1rem;
  margin-bottom: 1.5rem;

  dt {
    color: var(--bs-secondary-color);
    font-weight: 400;
  }

  dd {
    margin: 0;
  }
}
</style>
