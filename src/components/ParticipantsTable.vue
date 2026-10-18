<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import type { Participant } from '@/types/participant'

const { participants } = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  edit: [participant: Participant]
  delete: [participant: Participant]
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0 participants-table">
      <thead>
        <tr>
          <th scope="col" class="text-muted">#</th>
          <th scope="col">Name</th>
          <th scope="col">Date of Birth</th>
          <th scope="col">Email</th>
          <th scope="col">Phone number</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(participant, index) in participants" :key="participant.id">
          <td class="text-muted">{{ index + 1 }}</td>
          <td>{{ participant.name }}</td>
          <td>{{ participant.birthDate }}</td>
          <td>{{ participant.email }}</td>
          <td>{{ participant.phone }}</td>
          <td>
            <BaseButton size="sm" variant="outline-primary" @click="emit('edit', participant)">
              Edit data
            </BaseButton>
          </td>
          <td>
            <BaseButton size="sm" variant="outline-danger" @click="emit('delete', participant)">
              Delete participant
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.participants-table {
  th,
  td {
    white-space: nowrap;
  }
}
</style>
