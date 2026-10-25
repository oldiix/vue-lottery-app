<script setup lang="ts" generic="T extends object">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { AppTableColumn } from './types'

const {
  rows,
  columns,
  dataKey = 'id',
  emptyMessage = 'No data',
} = defineProps<{
  rows: T[]
  columns: AppTableColumn[]
  dataKey?: string
  emptyMessage?: string
}>()
</script>

<template>
  <DataTable :value="rows" :data-key="dataKey" removable-sort striped-rows>
    <Column
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :header="column.header"
      :sortable="column.sortable"
    >
      <template #body="{ data, index }">
        <slot :name="`cell-${column.field}`" :row="data as T" :index="index">
          {{ data[column.field] }}
        </slot>
      </template>
    </Column>

    <Column v-if="$slots.actions">
      <template #body="{ data }">
        <div class="app-table__actions">
          <slot name="actions" :row="data as T" />
        </div>
      </template>
    </Column>

    <template #empty>{{ emptyMessage }}</template>
  </DataTable>
</template>

<style scoped lang="scss">
.app-table__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  white-space: nowrap;
}
</style>
