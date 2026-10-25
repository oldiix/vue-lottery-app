<script setup lang="ts">
import Dialog from 'primevue/dialog'
import AppButton from '../AppButton/AppButton.vue'

const {
  header,
  message = '',
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  loading = false,
} = defineProps<{
  header: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}>()

const visible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="header"
    :closable="!loading"
    :close-on-escape="!loading"
    :style="{ width: '28rem' }"
    :breakpoints="{ '575px': '90vw' }"
  >
    <slot>{{ message }}</slot>

    <template #footer>
      <AppButton
        :label="confirmLabel"
        severity="danger"
        :loading="loading"
        @click="emit('confirm')"
      />
      <AppButton
        :label="cancelLabel"
        severity="secondary"
        variant="outlined"
        :disabled="loading"
        @click="visible = false"
      />
    </template>
  </Dialog>
</template>
