<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AppButton } from '@/shared/ui'
import { useThemeStore } from '../model/theme.store'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>

<template>
  <AppButton
    :label="isDark ? 'Light' : 'Dark'"
    :icon="isDark ? 'bi bi-sun' : 'bi bi-moon'"
    variant="text"
    severity="secondary"
    size="small"
    @click="toggleTheme"
  />
</template>
