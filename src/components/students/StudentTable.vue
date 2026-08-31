<script setup lang="ts">
import type { StudentStandard, StudentStandardChange } from '@/types/student';
import { ref } from 'vue';

const {
  standards,
  summaryGrade,
  isLoading = false,
} = defineProps<{
  standards: StudentStandard[];
  summaryGrade: number;
  hideSaveButton?: boolean;
  readonlyInput?: boolean;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  saveData: [changedData: StudentStandardChange[]];
}>();

const headers = [
  { title: 'Норматив', value: 'standard.name', sortable: true },
  { title: 'Результат', value: 'value', sortable: true, width: 100 },
  { title: 'Оценка', value: 'grade', sortable: true, width: 80 },
];

const changedValues = ref<StudentStandardChange[]>([]);

function getMarkColor(mark: number): string {
  if (mark <= 1) {
    return '';
  } else if (mark <= 2) {
    return 'mark-bad';
  } else if (mark <= 3) {
    return 'mark-okay';
  } else if (mark <= 4) {
    return 'mark-good';
  } else if (mark <= 5) {
    return 'mark-great';
  }
  return '';
}

function validateValueByStandardType(value: string | number | null) {
  if (value === null || value === '') return true;

  if (+value > 5) {
    return 'Значение не должно превышать 5';
  }

  return true;
}

function trackValueChange(standardId: number, value: number | null, levelNumber: number) {
  if (value === +'') value = null;

  const existingIndex = changedValues.value.findIndex(
    (item) => item.level_number === levelNumber && item.standard_id === standardId,
  );

  if (existingIndex !== -1) {
    changedValues.value[existingIndex].value = value;
  } else {
    changedValues.value.push({ level_number: levelNumber, standard_id: standardId, value });
  }
}

function saveData() {
  emit('saveData', changedValues.value);
  changedValues.value = [];
}
</script>

<template>
  <v-data-table
    :fixed-header="true"
    :headers="headers"
    :items="standards"
    :itemsPerPageOptions="[10, 20, 30, { title: 'Все', value: -1 }]"
    :mobile="false"
    :show-current-page="true"
    class="table"
    item-key="id"
    no-data-text="Нет данных о нормативах на данном уровне"
  >
    <template #item.value="{ item }">
      <v-text-field
        v-if="item.standard.has_numeric_value"
        v-model="item.value"
        type="number"
        :disabled="isLoading"
        :readonly="readonlyInput"
        @update:model-value="trackValueChange(item.standard.id, item.value, item.level_number)"
      />
    </template>
    <template #item.grade="{ item }">
      <div
        v-if="item.standard.has_numeric_value"
        :class="getMarkColor(item.grade ?? 0)"
        class="mark"
      >
        {{ item.grade }}
      </div>
      <v-text-field
        v-else
        v-model="item.grade"
        type="number"
        class="mark"
        max="5"
        min="1"
        :disabled="isLoading"
        :rules="[validateValueByStandardType]"
        :readonly="readonlyInput"
        :class="getMarkColor(item.grade ?? 0)"
        @update:model-value="trackValueChange(item.standard.id, item.grade, item.level_number)"
      />
    </template>
    <template #body.append>
      <tr class="total-rate">
        <td>Итого</td>
        <td></td>
        <td>{{ summaryGrade.toFixed(2) }}</td>
      </tr>
    </template>
    <template #footer.prepend>
      <v-btn v-if="!hideSaveButton" class="button" color="primary" @click="saveData">
        Сохранить
      </v-btn>
      <div class="space" />
    </template>
  </v-data-table>
</template>

<style scoped>
.table {
  width: 100%;
  border-spacing: 0;
  overflow: hidden;
}

.total-rate {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-secondary));
  text-transform: uppercase;
  position: sticky;
  bottom: 0;
  font-weight: bold;
}

.space {
  flex: 1;
}

.table:deep(.v-data-table-header__content) {
  color: black;
  text-transform: uppercase;
  font-weight: bold;
}

.table:deep(.v-data-table__tr):nth-child(odd) {
  background: rgb(var(--v-theme-background));
}

.mark {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.mark-bad {
  color: red;
}

.mark-okay {
  color: #ff8800;
}

.mark-good {
  color: #0ecc00;
}

.mark-great {
  color: green;
}

@media (max-width: 850px) {
  .table {
    font-weight: 400;
  }

  .table :deep(th),
  .table :deep(td) {
    padding: 0 5px !important;
  }
}
</style>
