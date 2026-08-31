<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import LoadingOverlay from '@/components/shared/ui/LoadingOverlay.vue';
import FieldSet from '@/components/shared/ui/FieldSet.vue';
import { useDisplay } from 'vuetify';
import router from '@/router';
import { toast } from 'vue-sonner';
import {
  changeProfileDetails,
  changeProfileEmail,
  changeProfilePassword,
  exportProfileData,
  exportProfileReport,
  getProfile,
  importProfileData,
  resendProfileVerificationEmail,
} from '@/api/profile';
import { getErrorText } from '@/api/http';
import type { ProfileExportType, ProfilePageType, ProfileResponse } from '@/types/profile';
import { downloadBlob, selectFile } from '@/composables/utils';
import type { PasswordFieldType } from '@/types/ui';

const { smAndUp } = useDisplay();
const userStore = useUserStore();
const pageType = ref<ProfilePageType>('personal-info');
const isLoading = ref(false);
const isImporting = ref(false);
const isEmailVerified = ref(true);

const currentFirstName = ref('');
const currentLastName = ref('');
const currentPatronymic = ref('');
const currentEmail = ref('');

const firstName = ref('');
const lastName = ref('');
const patronymic = ref('');
const email = ref('');
const password = ref('');
const newPassword = ref('');
const passwordConfirmation = ref('');

const passwordType = ref<PasswordFieldType>('password');
const newPasswordType = ref<PasswordFieldType>('password');
const passwordConfirmationType = ref<PasswordFieldType>('password');

const exportIncludesNorms = ref(false);
const exportIncludesResults = ref(false);
const exportIncludesStandards = ref(false);

const canUpdateName = computed(() => {
  return (
    !isLoading.value &&
    firstName.value.trim().length > 0 &&
    lastName.value.trim().length > 0 &&
    (firstName.value.trim() !== currentFirstName.value ||
      lastName.value.trim() !== currentLastName.value ||
      patronymic.value.trim() !== currentPatronymic.value)
  );
});

const canUpdateEmail = computed(() => {
  return (
    !isLoading.value && email.value.trim().length > 0 && email.value.trim() !== currentEmail.value
  );
});

const canUpdatePassword = computed(() => {
  return (
    !isLoading.value &&
    password.value.trim().length > 0 &&
    newPassword.value.trim().length > 0 &&
    newPassword.value.trim() === passwordConfirmation.value.trim()
  );
});

const canExportReport = computed(() => {
  return (
    !isLoading.value &&
    (exportIncludesNorms.value || exportIncludesResults.value || exportIncludesStandards.value)
  );
});

const isTestTeacherAccount = computed(() => {
  const testEmailPattern = /^user[0-2]@example\.com$/;
  return (
    testEmailPattern.test(currentEmail.value) &&
    userStore.isTeacher &&
    import.meta.env.VITE_DEBUG !== 'TRUE'
  );
});

const navigationItems = computed(() => {
  if (userStore.isTeacher) {
    return [
      { title: 'Личные данные', value: 'personal-info', icon: 'mdi-account' },
      { title: 'Безопасность', value: 'security', icon: 'mdi-lock' },
      { title: 'Данные и отчеты', value: 'data-reports', icon: 'mdi-database' },
    ];
  }
  return [
    { title: 'Личные данные', value: 'personal-info', icon: 'mdi-account' },
    { title: 'Безопасность', value: 'security', icon: 'mdi-lock' },
  ];
});

async function loadProfile() {
  try {
    isLoading.value = true;
    setProfile(await getProfile());
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function patchName() {
  if (!canUpdateName.value) {
    return;
  }

  try {
    isLoading.value = true;
    await changeProfileDetails({
      first_name: firstName.value,
      last_name: lastName.value,
      patronymic: patronymic.value ?? '',
    });
    setProfile(await getProfile());
    toast.success('Имя успешно изменено');
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function patchEmail() {
  if (!canUpdateEmail.value) {
    return;
  }

  if (isTestTeacherAccount.value) {
    toast.error(
      'Это тестовый аккаунт, для проверки работоспособности приложения, на нем нельзя менять почту',
    );
    return;
  }

  try {
    isLoading.value = true;
    await changeProfileEmail({ email: email.value });
    setProfile(await getProfile());
    toast.success('Почта успешно изменена');
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function putPassword() {
  if (!canUpdatePassword.value) {
    return;
  }

  if (isTestTeacherAccount.value) {
    toast.error(
      'Это тестовый аккаунт, для проверки работоспособности приложения, на нем нельзя менять пароль',
    );
    return;
  }

  try {
    isLoading.value = true;
    await changeProfilePassword({
      new_password: newPassword.value,
      confirm_new_password: passwordConfirmation.value,
      current_password: password.value,
    });
    password.value = '';
    newPassword.value = '';
    passwordConfirmation.value = '';
    toast.success('Пароль успешно изменен');
    userStore.clearLocalStorage();
    await router.push({ name: 'login' });
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function exportData(type: ProfileExportType) {
  if (type === 'xlsx' && !canExportReport.value) {
    return;
  }

  try {
    isLoading.value = true;

    if (type === 'json') {
      const data = await exportProfileData();
      downloadBlob(
        new Blob([JSON.stringify(data)], { type: 'application/json' }),
        'coachdiary-data.json',
      );
      return;
    }

    const blob = await exportProfileReport({
      include_norms: exportIncludesNorms.value,
      include_results: exportIncludesResults.value,
      include_standards: exportIncludesStandards.value,
    });
    downloadBlob(blob, getReportFilename());
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время экспорта данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function importDataJSON() {
  const file = await selectFile('.json');
  if (!file) return;

  try {
    isImporting.value = true;
    const data = await importProfileData(file);
    toast.success(data.message);
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время импорта данных, попробуйте еще раз'),
    );
  } finally {
    isImporting.value = false;
  }
}

async function resendVerificationEmail() {
  try {
    await resendProfileVerificationEmail();
    toast.success('Письмо для подтверждения отправлено на вашу почту');
  } catch (error) {
    toast.error(getErrorText(error, 'Не удалось отправить письмо, попробуйте позже'));
  }
}

function setProfile(data: ProfileResponse) {
  currentFirstName.value = data.first_name;
  currentLastName.value = data.last_name;
  currentPatronymic.value = data.patronymic;
  currentEmail.value = data.email;
  firstName.value = currentFirstName.value;
  lastName.value = currentLastName.value;
  patronymic.value = currentPatronymic.value;
  email.value = currentEmail.value;
  isEmailVerified.value = data.is_email_verified;
}

function getReportFilename() {
  let filename = 'coachdiary-data';
  if (exportIncludesNorms.value) filename += '-все-нормативы';
  if (exportIncludesResults.value) filename += '-результаты';
  if (exportIncludesStandards.value) filename += '-листы-нормативов';
  return `${filename}.xlsx`;
}

onMounted(async () => {
  await loadProfile();
});
</script>

<template>
  <div v-if="smAndUp" class="menu">
    <v-btn
      :variant="pageType === 'personal-info' ? 'tonal' : 'text'"
      @click="pageType = 'personal-info'"
    >
      <v-icon class="mr-2">mdi-account</v-icon>
      Личные данные
    </v-btn>
    <v-btn :variant="pageType === 'security' ? 'tonal' : 'text'" @click="pageType = 'security'">
      <v-icon class="mr-2">mdi-lock</v-icon>
      Безопасность
    </v-btn>
    <v-btn
      :variant="pageType === 'data-reports' ? 'tonal' : 'text'"
      @click="pageType = 'data-reports'"
    >
      <v-icon class="mr-2">mdi-database</v-icon>
      Данные и отчеты
    </v-btn>
    <v-divider class="divider" color="rgb(var(--v-theme-primary-darken-1))" />
    <v-btn color="error" variant="text" @click="userStore.logout">
      <v-icon class="mr-2">mdi-logout</v-icon>
      Выйти из аккаунта
    </v-btn>
  </div>

  <div v-else class="mobile-menu">
    <v-select
      v-model="pageType"
      :items="navigationItems"
      item-title="title"
      item-value="value"
      variant="outlined"
      density="default"
      hide-details
      color="primary"
    >
      <template #selection="{ item }">
        <v-icon class="mr-2">{{ item?.raw?.icon }}</v-icon>
        {{ item?.raw?.title }}
      </template>
      <template #item="{ props, item }">
        <v-list-item v-bind="props">
          <template #prepend>
            <v-icon>{{ item?.raw?.icon }}</v-icon>
          </template>
        </v-list-item>
      </template>
    </v-select>
  </div>

  <div class="main">
    <template v-if="pageType === 'personal-info'">
      <div class="container rounded-lg">
        <div class="title">Аккаунт {{ userStore.isStudent ? 'ученика' : 'учителя' }}</div>
        <form class="text-field mb-4" @submit.prevent="patchName">
          <div class="text-field-fio">
            <v-text-field
              v-model="firstName"
              :readonly="userStore.isStudent"
              :disabled="isLoading"
              :clearable="!userStore.isStudent"
              persistent-clear
              label="Имя"
            />
            <v-text-field
              v-model="lastName"
              :disabled="isLoading"
              :readonly="userStore.isStudent"
              :clearable="!userStore.isStudent"
              persistent-clear
              label="Фамилия"
            />
            <v-text-field
              v-model="patronymic"
              :disabled="isLoading"
              :readonly="userStore.isStudent"
              :clearable="!userStore.isStudent"
              persistent-clear
              label="Отчество"
            />
          </div>
          <v-btn
            v-if="!userStore.isStudent"
            :disabled="!canUpdateName"
            class="button"
            rounded
            text="Изменить"
            type="submit"
          />
        </form>
        <form class="text-field" @submit.prevent="patchEmail">
          <v-text-field
            v-model="email"
            :disabled="isLoading"
            clearable
            persistent-clear
            label="Почта"
            type="email"
          />
          <div class="text-field-email">
            <div v-if="!isEmailVerified" class="verify-email-block">
              <span class="verify-email-text red">Почта не подтверждена</span>
              <v-btn
                variant="text"
                size="small"
                text="Отправить письмо повторно"
                class="button-email"
                @click="resendVerificationEmail"
              />
            </div>
            <span v-else class="verify-email-text green">Почта подтверждена</span>
            <v-btn
              :disabled="!canUpdateEmail"
              class="button"
              rounded
              text="Изменить"
              type="submit"
            />
          </div>
        </form>
      </div>
    </template>

    <template v-if="pageType === 'security'">
      <div class="container rounded-lg">
        <div class="title">Смена пароля</div>
        <div class="text-red text">
          Внимание. После смены пароля
          <br />
          необходимо будет снова войти в аккаунт
        </div>
        <form class="text-field" @submit.prevent="putPassword">
          <v-text-field
            v-model="password"
            :disabled="isLoading"
            :append-inner-icon="password ? 'mdi-eye' : undefined"
            :type="passwordType"
            clearable
            label="Старый пароль"
            persistent-clear
            @click:append-inner="passwordType = passwordType === 'password' ? 'text' : 'password'"
          />

          <v-text-field
            v-model="newPassword"
            :disabled="isLoading"
            :append-inner-icon="newPassword ? 'mdi-eye' : undefined"
            :type="newPasswordType"
            clearable
            label="Новый пароль"
            persistent-clear
            @click:append-inner="
              newPasswordType = newPasswordType === 'password' ? 'text' : 'password'
            "
          />
          <v-text-field
            v-model="passwordConfirmation"
            :disabled="isLoading"
            :append-inner-icon="passwordConfirmation ? 'mdi-eye' : undefined"
            :type="passwordConfirmationType"
            clearable
            label="Проверка пароля"
            persistent-clear
            @click:append-inner="
              passwordConfirmationType =
                passwordConfirmationType === 'password' ? 'text' : 'password'
            "
          />
          <v-btn
            :disabled="!canUpdatePassword"
            class="button"
            rounded
            text="Изменить"
            type="submit"
          />
        </form>
      </div>
    </template>

    <template v-if="pageType === 'data-reports'">
      <div v-if="userStore.isTeacher" class="container rounded-lg">
        <div class="title">Создать отчет</div>
        <div class="text">Вы можете экспортировать данные в формате XLSX.</div>
        <div class="text-field">
          <FieldSet title="Созданный отчет будет содержать:">
            <v-checkbox v-model="exportIncludesNorms" label="Лист с таблицей нормативов" />
            <v-checkbox
              v-model="exportIncludesResults"
              label="Сводный лист с итоговыми результатами"
            />
            <v-checkbox
              v-model="exportIncludesStandards"
              label="Отдельные листы для каждого норматива"
            />
          </FieldSet>
          <v-btn
            :disabled="!canExportReport"
            color="primary"
            class="button"
            rounded
            @click="exportData('xlsx')"
          >
            <v-icon left>mdi-download</v-icon>
            Скачать отчет
          </v-btn>
        </div>
      </div>
      <div v-if="userStore.isTeacher" class="container rounded-lg">
        <div class="title">Импорт и экспорт данных</div>
        <div class="text">
          Вы можете экспортировать и импортировать все свои данные в формате JSON. Это может быть
          полезно, если вы хотите перенести свои данные на другой аккаунт или поделиться ими с
          кем-то
        </div>
        <div class="exp-imp-buttons">
          <v-btn color="primary" rounded @click="exportData('json')">
            <v-icon left>mdi-download</v-icon>
            Экспортировать
          </v-btn>
          <v-btn color="primary" rounded @click="importDataJSON">
            <v-icon left>mdi-upload</v-icon>
            Импортировать
          </v-btn>
        </div>
      </div>
    </template>

    <div v-if="!smAndUp" class="container rounded-lg">
      <div class="title">Выход</div>
      <v-btn color="error" variant="text" @click="userStore.logout">
        <v-icon left>mdi-logout</v-icon>
        Выйти из аккаунта
      </v-btn>
    </div>
  </div>

  <LoadingOverlay v-model="isImporting" task="импорт данных" />
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin: 20px 10px 20px 260px;
}

.menu {
  position: fixed;
  top: 124px;
  left: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
  background-color: rgb(var(--v-theme-surface));
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.divider {
  width: calc(100% - 20px);
  align-self: center;
}

.mobile-menu {
  margin: 0 10px;
}

.container {
  width: 100%;
  max-width: 800px;
  background: rgb(var(--v-theme-surface));
  padding: 50px 80px;
  text-align: center;
}

.title {
  font-size: 24px;
  color: black;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 24px;
}

.text {
  font-size: 20px;
  margin-bottom: 24px;
  margin-top: -10px;
}

.text-red {
  color: rgb(var(--v-theme-error));
  --border-size: 0.4px;
  text-shadow:
    calc(-1 * var(--border-size)) calc(-1 * var(--border-size)) 0 black,
    var(--border-size) calc(-1 * var(--border-size)) 0 black,
    calc(-1 * var(--border-size)) var(--border-size) 0 black,
    var(--border-size) var(--border-size) 0 black;
}

.button {
  justify-self: end;
}

.text-field {
  display: grid;
  gap: 10px;
}

.text-field-fio {
  display: flex;
  gap: 10px;
}

.text-field-email {
  display: flex;
  justify-content: space-between;
}

.verify-email-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
}

.verify-email-text {
  font-size: 14px;
}

.verify-email-text.red {
  color: rgb(var(--v-theme-error));
  font-size: 14px;
}

.verify-email-text.green {
  color: rgb(var(--v-theme-success));
}

.button-email {
  padding: 0 !important;
}

.exp-imp-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

@media (width <= 900px) {
  .text-field-fio {
    flex-direction: column;
  }
}

@media (max-width: 800px) {
  .menu {
    top: 85px;
  }

  .container {
    padding: 20px;
  }

  .text {
    font-size: 18px;
  }
}

@media (max-width: 600px) {
  .main {
    margin: 10px 20px;
  }

  .container {
    background: transparent;
  }
}
</style>
