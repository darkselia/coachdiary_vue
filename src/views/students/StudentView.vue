<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import TopPanel from '@/components/shared/layout/TopPanel.vue';
import LevelPanel from '@/components/shared/ui/LevelPanel.vue';
import DataTableSideNav from '@/components/shared/ui/DataTableSideNav.vue';
import StudentTable from '@/components/students/StudentTable.vue';
import BottomSheetWithButton from '@/components/shared/ui/BottomSheetWithButton.vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { toast } from 'vue-sonner';
import { useDisplay } from 'vuetify';
import { useUIStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import {
  deleteStudentById,
  getStudent,
  getStudentStandards,
  saveStudentResults,
} from '@/api/students';
import type {
  StudentStandardChange,
  StudentResponse,
  StudentStandardRequest,
  StudentStandardsResponse,
} from '@/types/student';
import { getErrorText } from '@/api/http';

const route = useRoute();
const uiStore = useUIStore();
const userStore = useUserStore();
const { smAndUp } = useDisplay();
const isLoading = ref(false);
const studentId = computed(() => +route.params.id);
const studentInfo = ref<StudentResponse | null>(null);
const standardsInfo = ref<StudentStandardsResponse>({
  summary_grade: -1,
  standards: [],
});
const selectedLevelNumber = ref(-1);

const fullName = computed(() => {
  if (!studentInfo.value) return '';
  return `${studentInfo.value.last_name} ${studentInfo.value.first_name} ${studentInfo.value.patronymic}`;
});

const standards = computed(() =>
  standardsInfo.value.standards.toSorted((a, b) => a.standard.name.localeCompare(b.standard.name)),
);

const levelButtonText = computed(() =>
  selectedLevelNumber.value !== -1 ? `${selectedLevelNumber.value} год обучения` : 'Года обучения',
);

const labels = computed(() => {
  if (!studentInfo.value) return [];
  return [
    {
      id: 0,
      label: `Дата рождения: ${new Date(studentInfo.value.birthday).toLocaleDateString()}`,
    },
    {
      id: 1,
      label: `Класс: ${studentInfo.value.student_class.number}${studentInfo.value.student_class.class_name}`,
    },
    {
      id: 2,
      label: `Пол: ${studentInfo.value.gender === 'm' ? 'муж' : 'жен'}`,
    },
    {
      id: 3,
      label: `Код приглашения: ${
        studentInfo.value.is_used_invitation
          ? 'Использован'
          : studentInfo.value.invitation_link.split('/').pop()
      }`,
    },
  ];
});

function editStudent(): void {
  router.push({ name: 'update-student', params: { id: studentId.value } });
}

async function loadStudentPage() {
  try {
    isLoading.value = true;
    studentInfo.value = await getStudent(studentId.value);
    selectedLevelNumber.value = studentInfo.value.student_class.number;
    await fetchStandards();
    uiStore.mobileTitle = fullName.value || 'Студент не найден';
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function loadStandards() {
  try {
    isLoading.value = true;
    await fetchStandards();
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function deleteStudent() {
  await uiStore.showConfirmDialog({
    title: 'Удаление ученика',
    text: 'Вы уверены, что хотите удалить этого ученика?',
  });

  try {
    isLoading.value = true;
    await deleteStudentById(studentId.value);
    await router.push({ name: 'my-diary' });
    toast.success('Ученик успешно удален');
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function saveStudentValue(changedValues: StudentStandardChange[]) {
  try {
    isLoading.value = true;
    const request: StudentStandardRequest[] = changedValues.map((value) => ({
      student_id: studentId.value,
      standard_id: value.standard_id,
      value: value.value,
      level_number: value.level_number,
    }));

    await saveStudentResults(request);
    await fetchStandards();
    toast.success('Данные успешно обновлены');
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function fetchStandards() {
  standardsInfo.value = await getStudentStandards(studentId.value, selectedLevelNumber.value);
}

onMounted(async () => {
  await loadStudentPage();
});

onUnmounted(() => {
  uiStore.mobileTitle = '';
});
</script>

<template>
  <TopPanel v-if="smAndUp" :is-loading class="top-panel">
    <div class="top-panel-title">{{ fullName ?? 'Студент не найден' }}</div>
  </TopPanel>

  <div v-if="!smAndUp" class="top-panel-mobile">
    <BottomSheetWithButton :button-text="levelButtonText" sheet-title="Года обучения" eager>
      <template #default="{ toggle }">
        <LevelPanel
          v-model="selectedLevelNumber"
          :class-number="studentInfo?.student_class.number ?? 0"
          class="level-button-mobile"
          mobile
          color="secondary"
          @update:model-value="
            toggle();
            loadStandards();
          "
        />
      </template>
    </BottomSheetWithButton>

    <BottomSheetWithButton button-text="Информация" sheet-title="Информация" wrap-button>
      <template #default="{ toggle }">
        <DataTableSideNav
          :data="labels"
          is-content-static-text
          page-type="student"
          @delete="deleteStudent"
          @edit="editStudent"
          @update:model-value="toggle"
        />
      </template>
    </BottomSheetWithButton>
  </div>

  <div class="main">
    <LevelPanel
      v-if="smAndUp"
      v-model="selectedLevelNumber"
      :class-number="studentInfo?.student_class.number ?? 0"
      class="level-panel"
      @update:model-value="loadStandards"
    />

    <div class="grid">
      <StudentTable
        :standards="standards"
        :summary-grade="standardsInfo.summary_grade"
        :hide-save-button="!userStore.isTeacher"
        :readonly-input="!userStore.isTeacher"
        :is-loading
        class="table"
        @save-data="saveStudentValue"
      />

      <DataTableSideNav
        v-if="smAndUp"
        :data="labels"
        :has-action-buttons="userStore.isTeacher"
        is-content-static-text
        page-type="student"
        title="Информация"
        class="info-panel"
        @delete="deleteStudent"
        @edit="editStudent"
      />
    </div>
  </div>
</template>

<style scoped>
.main {
  max-width: 1200px;
  margin: 10px auto 0;

  @media (max-width: 1200px) {
    margin: 10px;
  }
}

.grid {
  display: flex;
  gap: 10px;
}

.table {
  height: calc(100dvh - 220px);

  @media (max-width: 600px) {
    height: calc(100dvh - 182px);
  }
}

.info-panel {
  height: calc(100dvh - 220px);
}

.level-panel {
  margin-bottom: 10px;
}

.top-panel-mobile {
  display: flex;
  justify-content: space-between;
  margin: 0 10px 15px;
}

.level-button-mobile {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
</style>
