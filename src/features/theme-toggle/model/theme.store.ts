import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('app-dark', theme === 'dark')
  root.setAttribute('data-bs-theme', theme)
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(getInitialTheme())

  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme(): void {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  watch(
    theme,
    (value) => {
      applyTheme(value)
      localStorage.setItem(STORAGE_KEY, value)
    },
    { immediate: true },
  )

  return { theme, isDark, toggleTheme }
})
