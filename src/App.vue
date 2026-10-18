<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import type { Participant, ParticipantForm } from '@/types/participant'
import WinnersBlock from '@/components/WinnersBlock.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'

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

const editingParticipant = ref<Participant | null>(null)
const deletingParticipant = ref<Participant | null>(null)

const editTakenEmails = computed(() =>
  participants.value
    .filter((participant) => participant.id !== editingParticipant.value?.id)
    .map((participant) => participant.email.toLowerCase()),
)

function updateParticipant(data: ParticipantForm): void {
  const participant = participants.value.find((item) => item.id === editingParticipant.value?.id)
  if (participant) {
    Object.assign(participant, data)
  }
  editingParticipant.value = null
}

function confirmDelete(): void {
  const target = deletingParticipant.value
  if (!target) {
    return
  }
  participants.value = participants.value.filter((participant) => participant.id !== target.id)
  removeWinner(target.id)
  deletingParticipant.value = null
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
        <ParticipantsTable
          :participants="participants"
          @edit="editingParticipant = $event"
          @delete="deletingParticipant = $event"
        />
      </div>
    </div>

    <BaseModal
      v-if="editingParticipant"
      title="Редагування учасника"
      @close="editingParticipant = null"
    >
      <RegisterForm
        :initial-data="editingParticipant"
        :taken-emails="editTakenEmails"
        submit-text="Оновити дані"
        @save="updateParticipant"
      />
    </BaseModal>

    <BaseModal
      v-if="deletingParticipant"
      title="Видалення учасника"
      @close="deletingParticipant = null"
    >
      <p class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ deletingParticipant.name }}", "{{
          deletingParticipant.email
        }}"?
      </p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="deletingParticipant = null">Ні</BaseButton>
      </template>
    </BaseModal>
  </main>
</template>
