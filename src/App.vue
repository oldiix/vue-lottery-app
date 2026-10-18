<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import type { Participant, ParticipantForm } from '@/types/participant'

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
</script>

<template>
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
