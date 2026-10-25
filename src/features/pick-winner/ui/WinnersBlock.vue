<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { BaseButton } from '@/shared/ui'
import { useWinnersStore } from '../model/winners.store'
import WinnerItem from './WinnerItem.vue'

const winnersStore = useWinnersStore()
const { winners, canAddWinner } = storeToRefs(winnersStore)
const { addRandomWinner, removeWinner } = winnersStore
</script>

<template>
  <div class="d-flex align-items-center gap-3">
    <div class="form-control winners-field">
      <WinnerItem
        v-for="winner in winners"
        :key="winner.id"
        :name="`${winner.firstName} ${winner.lastName}`"
        @remove="removeWinner(winner.id)"
      />
      <span class="text-muted">Winners</span>
    </div>

    <BaseButton class="text-nowrap" :disabled="!canAddWinner" @click="addRandomWinner">
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
