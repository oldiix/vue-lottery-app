<script setup lang="ts">
import { computed, ref } from 'vue'
import RegisterForm from '@/components/RegisterForm.vue'
import type { Participant, ParticipantForm } from '@/types/participant'

const participants = ref<Participant[]>([])

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

    <pre>{{ participants }}</pre>
  </main>
</template>
