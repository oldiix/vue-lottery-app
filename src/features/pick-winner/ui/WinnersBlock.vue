<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AppButton, AppChip } from '@/shared/ui'
import { useWinnersStore } from '../model/winners.store'

const winnersStore = useWinnersStore()
const { winners, canAddWinner } = storeToRefs(winnersStore)
const { addRandomWinner, removeWinner } = winnersStore
</script>

<template>
  <div class="winners-block">
    <div class="winners-block__field">
      <AppChip
        v-for="winner in winners"
        :key="winner.id"
        :label="`${winner.firstName} ${winner.lastName}`"
        @remove="removeWinner(winner.id)"
      />
      <span class="winners-block__placeholder">Winners</span>
    </div>

    <AppButton label="New winner" :disabled="!canAddWinner" @click="addRandomWinner" />
  </div>
</template>

<style scoped lang="scss">
.winners-block {
  display: flex;
  align-items: center;
  gap: 1rem;

  &__field {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
    min-height: 2.5rem;
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--p-content-border-color);
    border-radius: var(--p-content-border-radius);
    background-color: var(--p-content-background);
  }

  &__placeholder {
    color: var(--p-text-muted-color);
  }
}
</style>
