<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useProfileStore } from '@/stores/profile';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import FieldSet from '@/components/FieldSet.vue';
import { useDisplay } from 'vuetify';
import type { ProfilePageType } from '@/types/profile';

const { smAndUp } = useDisplay();
const userStore = useUserStore();
const profileStore = useProfileStore();
const {
  isLoading,
  isImporting,
  isEmailVerified,
  firstName,
  lastName,
  patronymic,
  email,
  password,
  newPassword,
  passwordConfirmation,
  exportIncludesNorms,
  exportIncludesResults,
  exportIncludesStandards,
  canUpdateName,
  canUpdateEmail,
  canUpdatePassword,
  canExportReport,
} = storeToRefs(profileStore);
const { patchName, patchEmail, putPassword, exportData, importDataJSON, resendVerificationEmail } =
  profileStore;

const pageType = ref<ProfilePageType>('personal-info');

const passwordType = ref<'password' | 'text'>('password');
const newPasswordType = ref<'password' | 'text'>('password');
const passwordConfirmationType = ref<'password' | 'text'>('password');

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

onMounted(async () => {
  await profileStore.loadProfile();
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
