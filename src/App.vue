<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import SearchBar from '@/components/SearchBar.vue'
import WinnersBlock from '@/components/WinnersBlock.vue'
import type { Participant, ParticipantForm } from '@/types/participant'

const STORAGE_KEY = 'lottery-participants'
const MAX_WINNERS = 3

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

//  Переможці
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

//  Пошук

const nameFilter = ref('')

// спочатку фільтрую тут, а сортування вже в таблиці
const filteredParticipants = computed(() => {
  const query = nameFilter.value.toLowerCase()
  return participants.value.filter((participant) => participant.name.toLowerCase().includes(query))
})

//  Редагування

const editingParticipant = ref<Participant | null>(null)

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

//  Видалення

const deletingParticipant = ref<Participant | null>(null)

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
  <main class="app">
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
        <SearchBar class="mb-3" @filter-by-name="nameFilter = $event" />
        <ParticipantsTable
          :participants="filteredParticipants"
          @edit="editingParticipant = $event"
          @delete="deletingParticipant = $event"
        />
      </div>
    </div>

    <BaseModal
      v-if="editingParticipant"
      title="Edit participant"
      @close="editingParticipant = null"
    >
      <RegisterForm
        :initial-data="editingParticipant"
        :taken-emails="editTakenEmails"
        submit-text="Update data"
        @save="updateParticipant"
      />
    </BaseModal>

    <BaseModal
      v-if="deletingParticipant"
      title="Delete participant"
      @close="deletingParticipant = null"
    >
      <p class="mb-0">
        Are you sure you want to delete participant "{{ deletingParticipant.name }}", "{{
          deletingParticipant.email
        }}"?
      </p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Yes</BaseButton>
        <BaseButton variant="secondary" @click="deletingParticipant = null">No</BaseButton>
      </template>
    </BaseModal>
  </main>
</template>
