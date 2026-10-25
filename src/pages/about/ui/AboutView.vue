<script setup lang="ts">
import { AppButton } from '@/shared/ui'

interface SkillGroup {
  title: string
  skills: string[]
}

const FULL_NAME = 'Kateryna Doroftei'
const GITHUB_URL = 'https://github.com/oldiix'

const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'HTML', 'CSS / SCSS'],
  },
  {
    title: 'Frameworks & libraries',
    skills: ['Vue 3', 'Vue Router', 'Pinia', 'VeeValidate', 'Bootstrap'],
  },
  {
    title: 'Tools',
    skills: ['Git', 'GitHub', 'WebStorm', 'Vite', 'ESLint', 'Prettier', 'npm'],
  },
]
</script>

<template>
  <section class="card mb-4">
    <div class="card-body p-4">
      <h1 class="h3 fw-bold mb-1">{{ FULL_NAME }}</h1>
      <p class="text-muted mb-3">Student, frontend developer</p>
      <AppButton label="GitHub profile" icon="bi bi-github" variant="outlined" :href="GITHUB_URL" />
    </div>
  </section>

  <section class="card">
    <div class="card-body p-4">
      <h2 class="h5 fw-bold mb-3">Technical skills</h2>
      <div v-for="group in skillGroups" :key="group.title" class="mb-3">
        <h3 class="h6 text-muted mb-2">{{ group.title }}</h3>
        <div class="d-flex flex-wrap gap-2">
          <span v-for="skill in group.skills" :key="skill" class="skill">{{ skill }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.skill {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--p-primary-color);
  border-radius: 1rem;
  color: var(--p-primary-color);
  font-size: 0.875rem;
}
</style>
