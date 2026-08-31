<script lang="ts" setup>
import TopPanel from '@/components/TopPanel.vue';
import FieldSet from '@/components/FieldSet.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import type { Gender, NullableGender } from '@/types/common';
import type { StudentFormPageType, StudentRequest } from '@/types/student';
import { toast } from 'vue-sonner';
import { createStudent, getStudent, updateStudent } from '@/api/students';
import { getErrorText } from '@/api/http';
import { useClassesStore } from '@/stores/classes';

const route = useRoute();
const router = useRouter();
const classesStore = useClassesStore();
const pageType = ref<StudentFormPageType>(route.name as StudentFormPageType);
const isLoading = ref(false);

const firstName = ref('');
const lastName = ref('');
const patronymic = ref('');
const genderType = ref<NullableGender>(null);
const birthdayDate = ref(''); //2024-05-08
const classNumber = ref(-1);
const className = ref('');

const isSaveButtonDisabled = computed(() => {
  return (
    isLoading.value ||
    !firstName.value ||
    !lastName.value ||
    !genderType.value ||
    !birthdayDate.value ||
    classNumber.value === -1 ||
    !className.value
  );
});

async function createOrUpdateStudent() {
  try {
    isLoading.value = true;
    const requestData: StudentRequest = {
      first_name: firstName.value,
      last_name: lastName.value,
      patronymic: patronymic.value,
      student_class: {
        number: classNumber.value,
        class_name: className.value,
      },
      birthday: birthdayDate.value,
      gender: genderType.value as Gender,
    };
    if (pageType.value === 'create-student') {
      await createStudent(requestData);
      toast.success('Ученик успешно создан');
      firstName.value = '';
      lastName.value = '';
      patronymic.value = '';
      genderType.value = null;
      birthdayDate.value = '';
    } else {
      await updateStudent(+route.params.id, requestData);
      toast.success('Данные о ученике успешно обновлены');
      router.push({ name: 'student', params: { id: route.params.id } });
    }
    classesStore.invalidateClasses();
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  if (pageType.value === 'update-student') {
    try {
      const data = await getStudent(+route.params.id);
      firstName.value = data.first_name;
      lastName.value = data.last_name;
      patronymic.value = data.patronymic;
      genderType.value = data.gender;
      birthdayDate.value = data.birthday;
      classNumber.value = data.student_class.number;
      className.value = data.student_class.class_name;
    } catch (error) {
      toast.error(
        getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
      );
    }
  }
});
</script>

<template>
  <TopPanel :is-loading class="top-panel">
    {{ pageType === 'create-student' ? 'Создание ученика' : 'Обновление ученика' }}
  </TopPanel>
  <div class="container">
    <div class="names">
      <v-text-field v-model="lastName" :disabled="isLoading" class="text-field" label="Фамилия" />
      <v-text-field v-model="firstName" :disabled="isLoading" class="text-field" label="Имя" />
      <v-text-field
        v-model="patronymic"
        :disabled="isLoading"
        class="text-field"
        label="Отчество"
      />
    </div>

    <div class="left">
      <FieldSet title="Пол">
        <v-radio-group v-model="genderType" :disabled="isLoading">
          <v-radio label="Женский" value="f" />
          <v-radio label="Мужской" value="m" />
        </v-radio-group>
      </FieldSet>

      <v-text-field
        v-model="birthdayDate"
        :disabled="isLoading"
        class="text-field"
        label="Дата рождения"
        type="date"
      />
    </div>

    <FieldSet class="class" title="Класс">
      <div>
        <p class="levels-text">Уровень</p>
        <v-radio-group
          v-model="classNumber"
          :disabled="isLoading"
          class="radio-group"
          height="100px"
        >
          <v-radio v-for="n in 11" :key="n" :label="n.toString()" :value="n" density="compact" />
        </v-radio-group>
      </div>
      <v-text-field
        v-model="className"
        :disabled="isLoading"
        class="text-field class-name"
        label="Буква"
        @update:model-value="className = $event.toUpperCase()"
      />
    </FieldSet>

    <v-btn
      :disabled="isSaveButtonDisabled"
      class="button"
      color="primary"
      rounded
      text="Сохранить"
      @click="createOrUpdateStudent"
    />
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: rgb(var(--v-theme-surface));
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 100px;
}

.names {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  grid-column: 1 / -1;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: stretch;
}

.text-field {
  flex: 0;
}

.text-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.5;
}

.text-field :deep(.v-label:not(:has(+ input:empty))) {
  opacity: 1;
  color: black;
}

.class {
  display: grid;
  grid-template-columns: 1fr 150px;
  align-items: start;
  justify-items: start;
  gap: 20px;
  padding: 20px;
}

.class-name {
  justify-self: stretch;
}

.radio-group:deep(.v-selection-control-group) {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 170px;
  gap: 0 32px;
  margin-top: 10px;
}

.levels-text {
  text-align: center;
  line-height: 120%;
  font-weight: bold;
}

.button {
  grid-column: span 2;
  justify-self: end;
}

@media (max-width: 1000px) {
  .container {
    background: transparent;
  }
}

@media (width <= 800px) {
  .container {
    gap: 20px 30px;
  }

  .class {
    grid-template-columns: 1fr 100px;
  }
}

@media (max-width: 600px) {
  .top-panel {
    display: none;
  }

  .container {
    width: 100%;
    grid-template-columns: 1fr;
    margin: 10px auto;
    gap: 15px;
    padding: 10px 20px;
  }

  .names {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .button {
    grid-column: 1;
  }
}
</style>
