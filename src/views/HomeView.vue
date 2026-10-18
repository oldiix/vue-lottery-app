<script setup lang="ts">
interface Technology {
  name: string
  description: string
}

const REPOSITORY_URL = 'https://github.com/oldiix/vue-lottery-app'

const features: string[] = [
  'Random selection of up to three winners',
  'Users list from DummyJSON API with pagination and search',
  'Creating, editing and deleting users',
  'JWT authorization with automatic token refresh',
  'Protected pages available only after login',
]

const technologies: Technology[] = [
  { name: 'Vue 3', description: 'Composition API, script setup' },
  { name: 'TypeScript', description: 'Static typing' },
  { name: 'Vue Router', description: 'Routing, guards, lazy loading' },
  { name: 'Pinia', description: 'State management' },
  { name: 'VeeValidate + Yup', description: 'Form validation' },
  { name: 'Bootstrap 5 + SCSS', description: 'Styling' },
  { name: 'Vite', description: 'Build tool and dev server' },
  { name: 'DummyJSON', description: 'REST API and JWT auth' },
]
</script>

<template>
  <section class="card mb-4">
    <div class="card-body p-4">
      <h1 class="h3 fw-bold mb-3">Vue Lottery App</h1>
      <p class="text-muted mb-4">
        A lottery application where you can manage participants and randomly choose winners. The
        project was created as a laboratory work for learning Vue.js: components, routing, working
        with REST API and authorization.
      </p>
      <div class="d-flex flex-wrap gap-2">
        <RouterLink to="/users" class="btn btn-primary">Open lottery</RouterLink>
        <a
          :href="REPOSITORY_URL"
          class="btn btn-outline-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="bi bi-github"></i> Project on GitHub
        </a>
      </div>
    </div>
  </section>

  <section class="card mb-4">
    <div class="card-body p-4">
      <h2 class="h5 fw-bold mb-3">Features</h2>
      <ul class="mb-0">
        <li v-for="feature in features" :key="feature">{{ feature }}</li>
      </ul>
    </div>
  </section>

  <section class="card">
    <div class="card-body p-4">
      <h2 class="h5 fw-bold mb-3">Technologies</h2>
      <div class="technologies">
        <div v-for="technology in technologies" :key="technology.name" class="technologies__item">
          <div class="fw-bold">{{ technology.name }}</div>
          <div class="text-muted small">{{ technology.description }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.technologies {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;

  &__item {
    padding: 0.75rem 1rem;
    border: 1px solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
  }
}
</style>
