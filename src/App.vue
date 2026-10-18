<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import type { Participant, ParticipantForm } from '@/types/participant'
import WinnersBlock from '@/components/WinnersBlock.vue'

const STORAGE_KEY = 'lottery-participants'

function loadParticipants(): Participant[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Participant[]) : []
  } catch {
    return []
  }
}

const participants = ref<Participant[]>(loadParticipants())

watch(
  participants,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

const takenEmails = computed(() =>
  participants.value.map((participant) => participant.email.toLowerCase()),
)

function addParticipant(data: ParticipantForm): void {
  participants.value.push({ id: Date.now(), ...data })
}

const MAX_WINNERS = 3
const winnerIds = ref<number[]>([])

const winners = computed(() =>
  winnerIds.value
    .map((id) => participants.value.find((participant) => participant.id === id))
    .filter((participant): participant is Participant => participant !== undefined),
)

const candidates = computed(() =>
  participants.value.filter((participant) => !winnerIds.value.includes(participant.id)),
)

const canAddWinner = computed(
  () => winnerIds.value.length < MAX_WINNERS && candidates.value.length > 0,
)

function addWinner(): void {
  if (!canAddWinner.value) {
    return
  }
  const index = Math.floor(Math.random() * candidates.value.length)
  const winner = candidates.value[index]
  if (winner) {
    winnerIds.value.push(winner.id)
  }
}

function removeWinner(id: number): void {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <WinnersBlock
        :winners="winners"
        :can-add-winner="canAddWinner"
        @add="addWinner"
        @remove="removeWinner"
      />
    </div>
  </div>

  <main class="app">
    <div class="card mb-3">
      <div class="card-body p-4">
        <RegisterForm :taken-emails="takenEmails" @save="addParticipant">
          <template #header>
            <h2 class="h6 fw-bold text-uppercase mb-1">Register form</h2>
            <p class="text-muted mb-4">Please fill in all the fields.</p>
          </template>
        </RegisterForm>
      </div>
    </div>

    <div class="card">
      <div class="card-body p-4">
        <ParticipantsTable :participants="participants" />
      </div>
    </div>
  </main>
</template>
