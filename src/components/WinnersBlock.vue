<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import WinnerItem from '@/components/WinnerItem.vue'
import type { User } from '@/types/user'

const { winners, canAddWinner } = defineProps<{
  winners: User[]
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
        :name="`${winner.firstName} ${winner.lastName}`"
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
// поле виглядає як input, а всередині бейджі переможців
.winners-field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  min-height: 38px;
  background-color: #fff;
}
</style>
