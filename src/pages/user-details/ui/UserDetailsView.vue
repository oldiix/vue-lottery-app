<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { AppButton, AppMessage, AppSpinner } from '@/shared/ui'
import { useUsersStore, type User } from '@/entities/user'

interface DetailRow {
  label: string
  value: string | number | undefined
}

const { id } = defineProps<{
  id: string
}>()

const route = useRoute()
const { fetchUser } = useUsersStore()

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadUser(): Promise<void> {
  isLoading.value = true
  error.value = null
  try {
    user.value = await fetchUser(Number(id))
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
  <AppSpinner v-if="isLoading" />

  <div v-else-if="error" class="card">
    <div class="card-body p-4">
      <AppMessage class="mb-3">{{ error }}</AppMessage>
      <AppButton
        label="Back to users"
        icon="bi bi-arrow-left"
        severity="secondary"
        variant="outlined"
        :to="{ name: 'users' }"
      />
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
          <AppButton
            label="Back to users"
            icon="bi bi-arrow-left"
            severity="secondary"
            variant="outlined"
            :to="{ name: 'users' }"
          />
          <AppButton
            v-if="!isEditing"
            label="Edit"
            icon="bi bi-pencil"
            :to="{ name: 'user-edit', params: { id } }"
          />
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
  border: 1px solid var(--p-content-border-color);
  object-fit: cover;

  &--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: var(--p-text-muted-color);
    background-color: var(--p-content-hover-background);
  }
}

.user-details {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 0.5rem 1rem;
  margin-bottom: 1.5rem;

  dt {
    color: var(--p-text-muted-color);
    font-weight: 400;
  }

  dd {
    margin: 0;
  }
}
</style>
