<script lang="ts" setup>
import TopPanel from '@/components/shared/layout/TopPanel.vue';
import DataTableSideNav from '@/components/shared/ui/DataTableSideNav.vue';
import MyDiaryTable from '@/components/diary/MyDiaryTable.vue';
import FilterBlock from '@/components/diary/FilterBlock.vue';
import ClassesPanel from '@/components/classes/ClassesPanel.vue';
import BottomSheetWithButton from '@/components/shared/ui/BottomSheetWithButton.vue';
import type { StudentFilters, StudentValueResponse, StudentValueRequest } from '@/types/student';
import type { DiaryPageType } from '@/types/ui';
import type { StandardType } from '@/types/standard';
import type { StudentResponse } from '@/types/student';

import { computed, nextTick, onMounted, ref } from 'vue';
import { getErrorText } from '@/api/http';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useDisplay } from 'vuetify';
import SideNavButtons from '@/components/shared/ui/SideNavButtons.vue';
import { getStudents, getStudentsResults, saveStudentsValues } from '@/api/students';
import { useStandardsStore } from '@/stores/standards';
import { useClassesStore } from '@/stores/classes';

const router = useRouter();
const route = useRoute();
const { smAndUp, width } = useDisplay();
const standardsStore = useStandardsStore();
const classesStore = useClassesStore();
const w800 = computed(() => width.value <= 800);

const pageType = ref<DiaryPageType>((route.query.pageType as DiaryPageType) || 'single');
const isLoading = ref(false);

const activeClassNumber = ref(+route.query.classNumber! || -1);
const className = ref((route.query.letter as string) || '');
const selectedStandardId = ref(-1);
const selectedStandardIds = ref<number[]>([]);

const classesData = computed(() => classesStore.classes);
const standardsData = computed(() => standardsStore.standards);
const filteredData = ref<StudentValueResponse[]>([]);
const filters = ref<StudentFilters>({
  gender: null,
  grades: [],
  birthYearFrom: null,
  birthYearUntil: null,
});
let studentsValueData: StudentValueResponse[] = [];
let studentsData: StudentResponse[] = [];

const standardButtonText = computed(() => {
  if (pageType.value === 'single') {
    return standards.value.find((v) => v.id === selectedStandardId.value)?.label ?? 'Нормативы';
  } else {
    if (selectedStandardIds.value.length <= 1) {
      return 'Выберите минимум 2 норматива';
    }
    return 'Режим сравнения';
  }
});
const classButtonText = computed(() => {
  if (activeClassNumber.value === 12) {
    return 'Все';
  } else if (activeClassNumber.value === -1) {
    return 'Классы';
  } else {
    return activeClassNumber.value + className.value;
  }
});

const selectedStandardType = computed<StandardType>(() => {
  if (standardsData.value.find((v) => v.id === selectedStandardId.value)?.has_numeric_value) {
    return 'physical';
  } else {
    return 'technical';
  }
});

const standards = computed(() => {
  let result = standardsData.value;

  if (activeClassNumber.value !== 12) {
    result = result.filter((standard) =>
      standard.levels.some((level) => level.level_number === activeClassNumber.value),
    );
  }
  return result
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map((standard) => ({
      id: standard.id,
      label: standard.name,
    }));
});

function initSelectedStandards() {
  const standard = route.query.standard;
  if (Array.isArray(standard)) {
    selectedStandardIds.value = standard.map(Number);
    selectedStandardId.value = -1;
  } else if (standard !== undefined && standard !== '' && standard !== null) {
    selectedStandardId.value = +standard;
    selectedStandardIds.value = [];
  } else {
    selectedStandardId.value = -1;
    selectedStandardIds.value = [];
  }
}

function sortSelectedStandardIds() {
  const standardsById = new Map(standardsData.value.map((s) => [s.id, s.name]));

  selectedStandardIds.value.sort((a, b) => {
    const nameA = standardsById.get(a) || '';
    const nameB = standardsById.get(b) || '';
    return nameA.localeCompare(nameB);
  });
}

function updateStudentsData(students: StudentResponse[], classNumber: number, letter: string) {
  activeClassNumber.value = classNumber;
  className.value = letter;
  studentsData = students;
  filteredData.value = [];

  filters.value = {
    gender: null,
    grades: [],
    birthYearFrom: null,
    birthYearUntil: null,
  };

  if (
    pageType.value === 'single' &&
    !standards.value.some((v) => v.id === selectedStandardId.value)
  )
    selectedStandardId.value = -1;
  if (
    pageType.value === 'multiple' &&
    !standards.value.some((v) => selectedStandardIds.value.includes(v.id))
  )
    selectedStandardIds.value = [];

  getStudentsData();
}

async function selectClass(classNumber: number, letter: string) {
  try {
    await router.replace({
      query: {
        ...route.query,
        classNumber,
        letter,
      },
    });
    const students =
      classNumber === 12
        ? await getStudents()
        : await getStudents({ student_class: classNumber + letter });
    updateStudentsData(students, classNumber, letter);
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
    );
  }
}

function setQuery() {
  router.replace({
    query: {
      ...route.query,
      standard: pageType.value === 'single' ? selectedStandardId.value : selectedStandardIds.value,
      pageType: pageType.value,
    },
  });
}

async function getStudentsData() {
  setQuery();
  if (selectedStandardId.value === -1 && selectedStandardIds.value.length <= 1) return;

  isLoading.value = true;

  let currentClasses: number[];
  let currentStudentsData: StudentResponse[];

  if (activeClassNumber.value === 12) {
    const standardsLevels = standardsData.value.reduce(
      (acc, v) => {
        acc[v.id] = v.levels.map((level) => level.level_number);
        return acc;
      },
      {} as Record<number, number[]>,
    );

    if (pageType.value === 'single') {
      currentClasses = classesData.value
        .filter((klass) => standardsLevels[selectedStandardId.value].includes(klass.number))
        .map((klass) => klass.id);
    } else {
      currentClasses = classesData.value
        .filter((klass) =>
          selectedStandardIds.value.every((id) => standardsLevels[id].includes(klass.number)),
        )
        .map((klass) => klass.id);
    }

    currentStudentsData = studentsData.filter((student) =>
      currentClasses.includes(student.student_class.id),
    );
  } else {
    currentClasses = classesData.value
      .filter(
        (klass) =>
          klass.number === activeClassNumber.value &&
          (className.value ? klass.class_name === className.value : true),
      )
      .map((klass) => klass.id);
    currentStudentsData = studentsData;
  }

  try {
    const standardIds =
      pageType.value === 'single' ? [selectedStandardId.value] : selectedStandardIds.value;
    const currentStudentsValue = await getStudentsResults(currentClasses, standardIds);

    if (pageType.value === 'multiple' && selectedStandardIds.value.length > 1) {
      studentsValueData = currentStudentsValue.filter(
        (student) => student.average_grade && student.average_value,
      );
    } else {
      studentsValueData = currentStudentsData.map((student) => {
        const result = currentStudentsValue.find((v) => v.id === student.id);
        return (
          result ?? {
            ...student,
            standards_details: [
              {
                grade: null,
                value: null,
                standard_id: selectedStandardId.value,
              },
            ],
            average_value: null,
            average_grade: null,
          }
        );
      });
    }
    acceptFilters();
  } catch (error) {
    toast.error(getErrorText(error, 'Ошибка при получении данных, попробуйте позже'));
  } finally {
    isLoading.value = false;
  }
}

function acceptFilters() {
  filteredData.value = studentsValueData.filter(
    (student) =>
      (filters.value.gender ? student.gender === filters.value.gender : true) &&
      (filters.value.grades.length
        ? filters.value.grades.includes(Math.round(student.average_grade ?? 0))
        : true) &&
      (filters.value.birthYearFrom
        ? +student.birthday.slice(0, 4) >= filters.value.birthYearFrom
        : true) &&
      (filters.value.birthYearUntil
        ? +student.birthday.slice(0, 4) <= filters.value.birthYearUntil
        : true),
  );
}

async function saveStudentsValue(changedData: StudentValueRequest[]) {
  try {
    isLoading.value = true;
    await saveStudentsValues(changedData);
    await getStudentsData();
    acceptFilters();
  } catch (error) {
    toast.error(getErrorText(error, 'Ошибка при сохранении данных, попробуйте позже'));
  } finally {
    isLoading.value = false;
  }
}

function removeStandardId(id: number) {
  selectedStandardIds.value = selectedStandardIds.value.filter((stdId) => stdId !== id);
  if (selectedStandardIds.value.length > 1) {
    getStudentsData();
  } else {
    selectedStandardIds.value = [];
    filteredData.value = [];
  }
}

onMounted(async () => {
  try {
    await classesStore.fetchClasses();
    await standardsStore.fetchStandards();
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
    );
  }
  initSelectedStandards();
  if (activeClassNumber.value !== -1) {
    await selectClass(activeClassNumber.value, className.value);
  }
  nextTick();
});
</script>

<template>
  <TopPanel v-if="smAndUp" :is-loading class="top-panel">
    <ClassesPanel
      v-model="activeClassNumber"
      :classes-data="classesData"
      :selected-letter="className"
      menu
      @select="selectClass"
    />
    <template #right v-if="w800">
      <BottomSheetWithButton
        button-color="secondary"
        button-text="фильтры"
        icon="mdi-filter"
        sheet-title="Фильтры"
      >
        <template #default="{ toggle }">
          <FilterBlock
            v-model="filters"
            class="filters-block-mobile"
            mobile
            @accept="
              acceptFilters();
              toggle();
            "
          />
        </template>
      </BottomSheetWithButton>
    </template>
  </TopPanel>

  <div v-if="!smAndUp" class="top-panel-mobile">
    <div class="buttons-panel">
      <keep-alive>
        <BottomSheetWithButton :button-text="classButtonText" sheet-title="Классы" eager>
          <template #default="{ toggle }">
            <ClassesPanel
              v-model="activeClassNumber"
              :classes-data="classesData"
              :selected-letter="className"
              menu
              direction-column
              @select="
                (classNumber, letter) => {
                  selectClass(classNumber, letter);
                  toggle();
                }
              "
            />
          </template>
        </BottomSheetWithButton>
      </keep-alive>

      <BottomSheetWithButton
        :button-text="standardButtonText"
        sheet-title="Нормативы"
        wrap-button
        :width="width - 180 + 'px'"
      >
        <template #default="{ toggle }">
          <SideNavButtons
            v-model="pageType"
            :types="{ first: 'single', second: 'multiple' }"
            :labels="{ first: 'Один', second: 'Несколько' }"
            @typeChanged="
              selectedStandardId = -1;
              selectedStandardIds = [];
              filteredData = [];
            "
          />
          <DataTableSideNav
            v-model:selected-id="selectedStandardId"
            v-model:selected-ids="selectedStandardIds"
            :data="standards"
            :has-action-buttons="false"
            :multiple-select="pageType === 'multiple'"
            :is-loading
            class="data-table-side-nav-mobile"
            @update:selected-id="
              getStudentsData();
              toggle();
            "
            @update:selected-ids="
              sortSelectedStandardIds();
              getStudentsData();
            "
          />
        </template>
      </BottomSheetWithButton>
    </div>

    <BottomSheetWithButton button-text="фильтры" icon="mdi-filter" sheet-title="Фильтры">
      <template #default="{ toggle }">
        <FilterBlock
          v-model="filters"
          class="filters-block-mobile"
          mobile
          @accept="
            acceptFilters();
            toggle();
          "
        />
      </template>
    </BottomSheetWithButton>
  </div>

  <div
    v-if="!smAndUp && pageType === 'multiple' && selectedStandardIds.length > 1"
    class="selected-standards-chips"
  >
    <v-chip
      v-for="id in selectedStandardIds"
      :key="id"
      color="primary"
      size="small"
      variant="flat"
      class="standard-chip"
      closable
      @click:close="removeStandardId(id)"
    >
      {{ standards.find((standard) => standard.id === id)?.label }}
    </v-chip>
  </div>

  <div class="grid">
    <FilterBlock v-if="!w800" v-model="filters" class="filters-block" @accept="acceptFilters" />

    <MyDiaryTable
      :data="filteredData"
      :standard-type="selectedStandardType"
      :page-type
      class="table"
      @saveData="saveStudentsValue"
    />
    <div>
      <SideNavButtons
        v-if="smAndUp"
        v-model="pageType"
        :types="{ first: 'single', second: 'multiple' }"
        :labels="{ first: 'Один', second: 'Несколько' }"
        @typeChanged="
          selectedStandardId = -1;
          selectedStandardIds = [];
          filteredData = [];
        "
      />
      <DataTableSideNav
        v-if="smAndUp"
        v-model:selected-id="selectedStandardId"
        v-model:selected-ids="selectedStandardIds"
        :data="standards"
        :has-action-buttons="false"
        :multiple-select="pageType === 'multiple'"
        class="data-table-side-nav"
        title="Нормативы"
        @update:selected-id="getStudentsData"
        @update:selected-ids="
          sortSelectedStandardIds();
          getStudentsData();
        "
      />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 150px 1fr 230px;
  gap: 10px;
  max-width: 1200px;
  margin: 30px auto 0;

  @media (max-width: 1230px) {
    margin-inline: 8px;
  }
}

.data-table-side-nav {
  height: calc(100dvh - 200px);
}

.table {
  height: calc(100dvh - 180px);
  max-width: calc(100dvw - 20px);
}

.top-panel-mobile {
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
  align-items: center;
}

.selected-standards-chips {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 15px 10px;
  width: 100%;
  scrollbar-width: thin;
  gap: 8px;
}

.standard-chip {
  flex: 0 0 auto;
}

.buttons-panel {
  display: flex;
  gap: 10px;
}

.filters-block-mobile,
:is(.filters-block-mobile) :deep(.v-btn) {
  color: white !important;
}

@media (width <= 950px) {
  .grid {
    grid-template-columns: 136px 1fr 160px;
  }

  .data-table-side-nav {
    width: min-content;
  }

  .filters-block {
    width: min-content;
  }
}

@media (width <= 800px) {
  .grid {
    grid-template-columns: 1fr 160px;
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
    padding: 0 10px 10px;
    margin: 5px 0;
  }

  .table {
    height: calc(100dvh - 200px);
  }
}
</style>
