<script setup lang="ts">
import TopPanel from '@/components/shared/layout/TopPanel.vue';
import ClassesPanel from '@/components/classes/ClassesPanel.vue';
import { useDisplay } from 'vuetify';
import MyClassesStudent from '@/components/students/MyClassesStudent.vue';
import BottomSheetWithButton from '@/components/shared/ui/BottomSheetWithButton.vue';
import LoadingOverlay from '@/components/shared/ui/LoadingOverlay.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { getClassQRCodesPdf, getStudents } from '@/api/students';
import { getErrorText } from '@/api/http';
import { useClassesStore } from '@/stores/classes';
import { useUIStore } from '@/stores/ui';
import type { StudentResponse } from '@/types/student';
import { openBlob, useDebounce } from '@/composables/utils';

const { smAndUp } = useDisplay();
const route = useRoute();
const router = useRouter();
const classesStore = useClassesStore();
const uiStore = useUIStore();

const activeLevelNumber = ref(+(route.query.classNumber ?? -1));
const activeClassName = ref((route.query.letter as string) || '');
const activeClasses = ref<string[]>([]);
const search = ref((route.query.search as string) || '');
const studentsData = ref<StudentResponse[]>([]);
const isLoading = ref(false);
const loadingText = ref('Загрузка классов и учеников...');

const groupedStudentsClasses = computed(() => {
  const students = studentsData.value.toSorted((a, b) => {
    if (a.student_class.number !== b.student_class.number) {
      return a.student_class.number - b.student_class.number;
    }
    if (a.student_class.class_name !== b.student_class.class_name) {
      return a.student_class.class_name.localeCompare(b.student_class.class_name);
    }
    return a.full_name.localeCompare(b.full_name);
  });
  const result: Record<number, Record<string, StudentResponse[]>> = {};

  for (const student of students) {
    const levelNumber = student.student_class.number;
    const className = student.student_class.class_name;
    result[levelNumber] ??= {};
    result[levelNumber][className] ??= [];
    result[levelNumber][className].push(student);
  }

  return result;
});

async function selectClass(classNumber: number, letter: string) {
  activeLevelNumber.value = classNumber;
  activeClassName.value = letter;
  activeClasses.value = [];
  search.value = '';

  await router.replace({ query: { classNumber, letter } });

  try {
    studentsData.value =
      classNumber === 12
        ? await getStudents()
        : await getStudents({ student_class: classNumber + letter });
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
    );
  }
}

async function runSearch(searchValue: string) {
  try {
    activeLevelNumber.value = -1;
    activeClassName.value = '';
    search.value = searchValue;
    await router.replace({ query: { search: searchValue } });
    studentsData.value = await getStudents({ full_name: searchValue });
    activeClasses.value = Object.entries(groupedStudentsClasses.value).flatMap(
      ([levelNumber, classes]) => Object.keys(classes).map((className) => levelNumber + className),
    );
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
    );
  }
}

const searchStudentsDebounced = useDebounce(runSearch);

function searchStudents(searchValue: string) {
  if (searchValue.length === 0 && activeLevelNumber.value === -1) {
    studentsData.value = [];
  }
  if (searchValue.length < 2) {
    searchStudentsDebounced.cancel();
    return;
  }

  searchStudentsDebounced(searchValue);
}

async function downloadClassQrCodes(number: number, name: string) {
  const id = classesStore.getClassIdByNumberAndName(number, name);
  if (id === undefined) {
    toast.error('Класс не найден');
    return;
  }

  try {
    isLoading.value = true;
    loadingText.value = 'генерация QR-кодов';
    openBlob(await getClassQRCodesPdf(id));
    toast.success('QR-коды успешно скачаны');
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function removeClass(number: number, name: string) {
  await uiStore.showConfirmDialog({
    title: 'Удаление класса',
    text: 'Вы уверены, что хотите удалить весь класс?',
  });

  const id = classesStore.getClassIdByNumberAndName(number, name);
  if (id === undefined) {
    toast.error('Класс не найден');
    return;
  }

  try {
    await classesStore.deleteClass(id);
    router.go(0);
    toast.success('Класс успешно удален');
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  }
}

async function transferToNextYear() {
  await uiStore.showConfirmDialog({
    title: 'Перевод на следующий год',
    text: 'Это действие переведет все классы на следующий год (сохраняя букву) и удаляет выпущенные 11 классы. Вы уверены, что хотите сделать перевод?',
  });

  try {
    isLoading.value = true;
    loadingText.value = 'перевод классов на следующий год';
    await classesStore.promoteClasses();
    router.go(0);
    toast.success('Все классы успешно переведены на следующий год');
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  try {
    await classesStore.fetchClasses();
    if (search.value) {
      searchStudents(search.value);
    } else if (activeLevelNumber.value !== -1) {
      await selectClass(activeLevelNumber.value, activeClassName.value);
    }
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
    );
  }
});

onUnmounted(searchStudentsDebounced.cancel);
</script>

<template>
  <TopPanel class="top-panel" :is-loading>
    <BottomSheetWithButton
      v-if="!smAndUp"
      button-text="Классы"
      sheet-title="Классы"
      eager
      button-color="rgb(var(--v-theme-secondary))"
    >
      <template #default="{ toggle }">
        <ClassesPanel
          v-model="activeLevelNumber"
          :classes-data="classesStore.classes"
          :selected-letter="activeClassName"
          @select="
            (classNumber, letter) => {
              selectClass(classNumber, letter);
              toggle();
            }
          "
        />
        <v-btn
          size="small"
          color="secondary"
          variant="outlined"
          text="Перевести на следующий год"
          class="transfer-button"
          @click="transferToNextYear"
        />
      </template>
    </BottomSheetWithButton>
    <v-combobox
      v-model="search"
      :items="studentsData.map((v) => v.full_name)"
      density="compact"
      class="search"
      placeholder="Введите имя ученика"
      prepend-inner-icon="mdi-magnify"
      variant="solo"
      menu-icon=""
      clearable
      rounded
      hide-details
      @update:search="searchStudents"
    />
    <template #left v-if="smAndUp">
      <v-btn
        size="small"
        color="secondary"
        variant="outlined"
        text="Перевести на следующий год"
        @click="transferToNextYear"
      />
    </template>
    <template #right v-if="smAndUp">
      <v-btn
        :to="{ name: 'create-student' }"
        color="secondary"
        icon="mdi-plus"
        variant="outlined"
      />
    </template>
  </TopPanel>

  <div class="classes-panel" v-if="smAndUp">
    <ClassesPanel
      v-model="activeLevelNumber"
      :classes-data="classesStore.classes"
      direction-column
      :selected-letter="activeClassName"
      @select="selectClass"
    />
  </div>

  <div class="container">
    <div class="students-container">
      <template v-for="(levelClasses, levelNumber) in groupedStudentsClasses" :key="levelNumber">
        <v-expansion-panels v-model="activeClasses" multiple>
          <v-expansion-panel
            v-for="(students, className) in levelClasses"
            :key="levelNumber + className"
            :value="levelNumber + className"
          >
            <v-expansion-panel-title>
              <strong>{{ levelNumber + className }}</strong>
            </v-expansion-panel-title>

            <v-expansion-panel-text class="expansion-panel-text">
              <div class="students-list">
                <div>№</div>
                <div style="padding: 0 16px">ФИО</div>
                <div v-if="smAndUp">Код приглашения</div>
                <div v-else>Код</div>
              </div>

              <div class="students-list" v-for="i in students.length" :key="students[i - 1].id">
                <MyClassesStudent :i="i" :student="students[i - 1]" />
              </div>

              <div class="action-buttons">
                <v-btn
                  size="small"
                  color="info"
                  variant="outlined"
                  text="Скачать qr коды приглашений"
                  @click="downloadClassQrCodes(+levelNumber, className)"
                />
                <v-btn
                  size="small"
                  color="error"
                  variant="outlined"
                  text="Удалить"
                  @click="removeClass(+levelNumber, className)"
                />
                <!--    <v-btn size="small" color="warning" variant="outlined">Архивировать</v-btn>
                        <v-btn size="small" color="info" variant="outlined">Перевести на след. год</v-btn>-->
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </div>
  </div>

  <LoadingOverlay v-model="isLoading" :task="loadingText" />
</template>

<style scoped>
.top-panel {
  position: sticky;
  top: 64px;
  z-index: 1000;
}

.search {
  max-width: 500px;
  margin: 0 auto;
}

.classes-panel {
  position: fixed;
  top: 124px;
  background-color: rgb(var(--v-theme-primary));
  z-index: 1000;
  padding: 10px;
  height: calc(100dvh - 124px);
}

.container {
  margin: 30px 10px 60px 100px;
}

.students-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 30px auto 0;
  max-width: 100%;
  width: 600px;
}

.students-list {
  display: grid;
  grid-template-columns: 20px 1fr 136px;
  gap: 10px;
  align-items: center;
  margin-bottom: 5px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  margin: 20px 10px 0;
  align-items: center;
  width: 100%;
}

.transfer-button {
  margin-top: 50px;
  width: 100%;
}

@media (max-width: 600px) {
  .top-panel {
    top: 56px;
  }

  .students-container {
    width: 100%;
  }

  .container {
    grid-template-columns: 0 1fr;
    margin: 10px;
  }

  .students-list {
    grid-template-columns: 20px 1fr 80px;
  }

  .expansion-panel-text:deep(.v-expansion-panel-text__wrapper) {
    padding: 8px 10px 16px;
  }
}
</style>
