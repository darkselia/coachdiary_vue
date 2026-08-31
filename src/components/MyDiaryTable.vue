<script lang="ts" setup>
import type { VDataTable } from 'vuetify/components';
import type { StudentValueRequest, StudentValueResponse } from '@/types/student';
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { toast } from 'vue-sonner';

const {
  data,
  standardType,
  pageType = 'single',
  isLoading = false,
} = defineProps<{
  data: StudentValueResponse[];
  standardType: 'physical' | 'technical';
  pageType?: 'single' | 'multiple';
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  saveData: [changedData: StudentValueRequest[]];
}>();

const { smAndUp } = useDisplay();
const changedValues = ref<StudentValueRequest[]>([]);

const headers = computed<VDataTable['$props']['headers']>(() => {
  if (pageType === 'multiple') {
    return [
      { title: 'Класс', value: 'student_class.class_name', width: 50 },
      { title: 'ФИО', value: 'full_name', sortable: true },
      { title: 'Пол', value: 'gender', width: 45 },
      { title: 'Средняя оценка', value: 'average_grade', sortable: true, width: 80 },
      { title: 'Значения', value: 'average_value', sortable: true, width: 80 },
    ];
  }
  if (standardType === 'physical') {
    return [
      { title: 'Класс', value: 'student_class.class_name', width: 50 },
      { title: 'ФИО', value: 'full_name', sortable: true },
      { title: 'Пол', value: 'gender', width: 45 },
      { title: 'Результат', value: 'average_value', sortable: true, width: 100 },
      { title: 'Оценка', value: 'average_grade', sortable: true, width: 80 },
    ];
  } else {
    return [
      { title: 'Класс', value: 'student_class.class_name', width: 50 },
      { title: 'ФИО', value: 'full_name', sortable: true },
      { title: 'Пол', value: 'gender', width: 45 },
      { title: 'Оценка', value: 'average_value', sortable: true, width: 80 },
    ];
  }
});

const sortedData = computed(() => {
  return data.toSorted((a, b) => {
    if (a.student_class.number !== b.student_class.number) {
      return a.student_class.number - b.student_class.number;
    }
    if (a.student_class.class_name !== b.student_class.class_name) {
      return a.student_class.class_name.localeCompare(b.student_class.class_name);
    }
    return a.full_name.localeCompare(b.full_name);
  });
});

function results(
  standardsDetails: {
    grade: number | null;
    value: number | null;
    standard_id: number;
  }[],
): string {
  return standardsDetails.map((value) => value.value).join(', ');
}

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

  if (standardType === 'technical' && +value > 5) {
    return 'Значение не должно превышать 5';
  }

  return true;
}

function getStudentName(student: StudentValueResponse) {
  if (smAndUp.value) {
    return student.last_name + ' ' + student.first_name + ' ' + student.patronymic;
  }
  return student.last_name + ' ' + student.first_name[0] + '. ' + student.patronymic[0] + '.';
}

function trackValueChange(studentId: number, standardId: number, value: number | null) {
  if (validateValueByStandardType(value) !== true) {
    toast.info('Значения не должны превышать 5');
    return;
  }

  if (value === +'') value = null;

  const existingIndex = changedValues.value.findIndex(
    (item) => item.student_id === studentId && item.standard_id === standardId,
  );

  if (existingIndex !== -1) {
    changedValues.value[existingIndex].value = value;
  } else {
    changedValues.value.push({ student_id: studentId, standard_id: standardId, value });
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
    :items="sortedData"
    :itemsPerPageOptions="[10, 20, 30, 100, { title: 'Все', value: -1 }]"
    :mobile="false"
    :show-current-page="true"
    :sort-by="
      pageType === 'multiple'
        ? [
            { key: 'average_grade', order: 'desc' },
            { key: 'average_value', order: 'desc' },
          ]
        : []
    "
    multi-sort
    class="table"
    item-key="name"
  >
    <template #no-data>
      <div>
        <br />
        <p>
          Чтобы появились ученики, выберите
          <b>Класс</b>
          , потом
          <b>Норматив</b>
          .
        </p>
        <br />
        <p v-if="pageType === 'multiple'">
          Если выбраны все классы, а ученики не показываются, значит
          <b>для выбранных нормативов нет учеников</b>
          .
        </p>
      </div>
    </template>
    <template #item.student_class.class_name="{ item }">
      {{ item.student_class.number + item.student_class.class_name }}
    </template>
    <template #item.full_name="{ item }">
      <v-btn :to="{ name: 'student', params: { id: item.id } }" class="button" variant="tonal">
        {{ getStudentName(item) }}
      </v-btn>
    </template>
    <template #item.gender="{ item }">
      <div class="gender">
        {{ item.gender === 'f' ? 'Ж' : 'М' }}
        <v-icon
          :class="{
            female: item.gender === 'f',
            male: item.gender === 'm',
          }"
          class="gender-icon"
        >
          {{ item.gender === 'f' ? 'mdi-gender-female' : 'mdi-gender-male' }}
        </v-icon>
      </div>
    </template>
    <template #item.average_value="{ item }">
      <v-text-field
        v-if="pageType === 'single'"
        v-model="item.average_value"
        type="number"
        :disabled="isLoading"
        :max="standardType === 'technical' ? 5 : undefined"
        :rules="[validateValueByStandardType]"
        :class="standardType === 'technical' ? getMarkColor(item.average_value ?? 0) + ' mark' : ''"
        @update:model-value="
          trackValueChange(item.id, item.standards_details[0].standard_id, item.average_value)
        "
      />
      <div v-else>{{ results(item.standards_details) }}</div>
    </template>
    <template #item.average_grade="{ item }">
      <div :class="getMarkColor(item.average_grade ?? 0)" class="mark">
        {{ item.average_grade ? Math.round(item.average_grade * 100) / 100 : '' }}
      </div>
    </template>
    <template #footer.prepend v-if="pageType !== 'multiple'">
      <v-btn color="primary" @click="saveData">Сохранить</v-btn>
      <div class="space" />
    </template>
  </v-data-table>
</template>

<style scoped>
.gender {
  display: flex;
  align-items: center;
  gap: 5px;
}

.gender-icon {
  font-size: 18px;
  color: white;
  border-radius: 5px;
}

.female {
  background-color: deeppink;
}

.male {
  background-color: deepskyblue;
}

.mark {
  font-size: 20px;
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

.button {
  height: auto !important;
  padding-block: 5px;
  margin-block: 5px;
}

.button:deep(.v-btn__content) {
  white-space: normal !important;
}

.space {
  flex: 1;
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
