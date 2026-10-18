<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const { title } = defineProps<{
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = useTemplateRef<HTMLDivElement>('modal')

// Фокус на модальному вікні, щоб Esc спрацював одразу
onMounted(() => {
  modalRef.value?.focus()
})
</script>

<template>
  <div
    ref="modal"
    class="modal d-block"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    @click.self="emit('close')"
    @keydown.esc="emit('close')"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop show"></div>
</template>
