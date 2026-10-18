<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import WinnerItem from '@/components/WinnerItem.vue'
import type { Participant } from '@/types/participant'

const { winners, canAddWinner } = defineProps<{
  winners: Participant[]
  canAddWinner: boolean
}>()

const emit = defineEmits<{
  add: []
  remove: [id: number]
}>()
</script>

<template>
  <div class="d-flex align-items-center gap-3">
    <div class="form-control winners-field">
      <WinnerItem
        v-for="winner in winners"
        :key="winner.id"
        :name="winner.name"
        @remove="emit('remove', winner.id)"
      />
      <span class="text-muted">Winners</span>
    </div>
    <BaseButton class="text-nowrap" :disabled="!canAddWinner" @click="emit('add')">
      New winner
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
.winners-field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  min-height: 38px;
  background-color: #fff;
}
</style>
