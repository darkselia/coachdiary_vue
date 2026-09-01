<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import PageFooter from '@/components/shared/layout/PageFooter.vue';
import { useUserStore } from '@/stores/user';
import {
  confirmPasswordReset,
  getInvitation,
  requestPasswordReset,
  signIn as signInApi,
  signUp as signUpApi,
} from '@/api/auth';
import { getErrorText } from '@/api/http';
import type {
  InvitationResponse,
  LoginPageType,
  RegistrationRequest,
} from '@/types/auth';
import type { PasswordFieldType } from '@/types/ui';

const pageType = ref<LoginPageType>('signIn');
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const privacyPolicy = ref(false);
const firstName = ref('');
const lastName = ref('');
const patronymic = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

const passwordType = ref<PasswordFieldType>('password');
const passwordConfirmationType = ref<PasswordFieldType>('password');

const isLoading = ref(false);
const invitationData = ref<InvitationResponse | null>(null);
const invitationToken = ref('');

const resetPasswordToken = ref('');

const isSendButtonDisabled = computed(() => {
  if (pageType.value === 'reset-password') {
    return (
      !password.value?.length ||
      !passwordConfirmation.value?.length ||
      password.value !== passwordConfirmation.value
    );
  }
  if (pageType.value === 'tokenSignUp') {
    return !invitationToken.value?.length;
  }
  if (!/.@./.test(email.value)) {
    return true;
  }
  if (pageType.value === 'signIn') {
    return !password.value?.length;
  }
  if (pageType.value === 'signUp') {
    return (
      !password.value?.length ||
      !firstName.value?.length ||
      !lastName.value?.length ||
      !passwordConfirmation.value?.length ||
      password.value !== passwordConfirmation.value ||
      !privacyPolicy.value
    );
  }
  if (pageType.value === 'restore') {
    return !email.value?.length;
  }

  return false;
});

const title = computed(() => {
  switch (pageType.value) {
    case 'signUp':
      return 'Регистрация';
    case 'restore':
      return 'Восстановление пароля';
    case 'reset-password':
      return 'Сброс пароля';
    case 'signIn':
    default:
      return 'Войти';
  }
});
const buttonText = computed(() => {
  switch (pageType.value) {
    case 'signUp':
      return 'Зарегистрироваться';
    case 'restore':
      return 'Восстановить пароль';
    case 'reset-password':
      return 'Задать новый пароль';
    case 'tokenSignUp':
    case 'signIn':
    default:
      return 'Войти';
  }
});

async function sendData() {
  if (isSendButtonDisabled.value || isLoading.value) {
    return;
  }
  isLoading.value = true;
  try {
    if (pageType.value === 'signIn') {
      await signIn();
    } else if (pageType.value === 'signUp') {
      await signUp();
    } else if (pageType.value === 'restore') {
      await restore();
    } else if (pageType.value === 'reset-password') {
      await resetPassword();
    } else if (pageType.value === 'tokenSignUp') {
      await studentSignUp();
    }
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

async function signIn() {
  await signInApi({ email: email.value, password: password.value });
  await userStore.login();
  await router.push({ name: 'app' });
}

async function signUp() {
  const requestData: RegistrationRequest = {
    email: email.value,
    password: password.value,
    confirm_password: passwordConfirmation.value,
    first_name: firstName.value,
    last_name: lastName.value,
    patronymic: patronymic.value,
    invite_code: '',
  };

  requestData.invite_code = invitationToken.value;
  await signUpApi(requestData);

  pageType.value = 'signIn';
  email.value = '';
  password.value = '';
  firstName.value = '';
  lastName.value = '';
  patronymic.value = '';
  passwordConfirmation.value = '';
  invitationToken.value = '';
  toast.success('Регистрация успешна. Проверьте вашу почту для подтверждения аккаунта.');
}

async function studentSignUp() {
  pageType.value = 'signUp';

  try {
    const data = await getInvitation(invitationToken.value);
    invitationData.value = data;
    firstName.value = data.student.first_name;
    lastName.value = data.student.last_name;
    patronymic.value = data.student.patronymic;
  } catch (error) {
    const errorText = getErrorText(error, 'Ошибка приглашения');
    toast.error(errorText);
    invitationToken.value = '';
    pageType.value = 'signIn';
    await router.push({ name: 'info', params: { error: errorText } });
  }
}

async function restore() {
  await requestPasswordReset({ email: email.value });
  toast.success('Письмо с инструкциями по восстановлению пароля отправлено на указанную почту');
  pageType.value = 'signIn';
  email.value = '';
}

async function resetPassword() {
  const requestData = {
    token: resetPasswordToken.value,
    new_password: password.value,
    confirm_password: passwordConfirmation.value,
  };
  await confirmPasswordReset(requestData);
  toast.success('Пароль успешно изменен');
  pageType.value = 'signIn';
  passwordConfirmation.value = '';
  password.value = '';
  resetPasswordToken.value = '';
  await router.push({ name: 'login' });
}

onMounted(async () => {
  if (route.params.token) {
    switch (route.name) {
      case 'reset-password':
        resetPasswordToken.value = route.params.token as string;
        pageType.value = 'reset-password';
        break;
      case 'join':
        invitationToken.value = route.params.token as string;
        await studentSignUp();
        break;
      default:
        break;
    }
  }
});
</script>

<template>
  <div class="page">
    <div class="container rounded-lg">
      <div class="text">{{ title }}</div>
      <form class="border-container" @submit.prevent="sendData">
        <v-text-field
          v-if="pageType === 'signUp'"
          v-model="lastName"
          :disabled="isLoading || !!invitationToken"
          clearable
          label="Фамилия"
          persistent-clear
          variant="outlined"
        />
        <v-text-field
          v-if="pageType === 'signUp'"
          v-model="firstName"
          :disabled="isLoading || !!invitationToken"
          clearable
          label="Имя"
          persistent-clear
          variant="outlined"
        />
        <v-text-field
          v-if="pageType === 'signUp'"
          v-model="patronymic"
          :disabled="isLoading || !!invitationToken"
          clearable
          label="Отчество"
          persistent-clear
          variant="outlined"
        />
        <v-text-field
          v-if="pageType !== 'tokenSignUp' && pageType !== 'reset-password'"
          v-model="email"
          :disabled="isLoading"
          clearable
          label="Почта"
          persistent-clear
          placeholder="example@example.com"
          variant="outlined"
        />
        <v-text-field
          v-if="pageType !== 'restore' && pageType !== 'tokenSignUp'"
          v-model="password"
          :append-inner-icon="password ? 'mdi-eye' : undefined"
          :disabled="isLoading"
          :type="passwordType"
          clearable
          label="Пароль"
          persistent-clear
          variant="outlined"
          @click:append-inner="passwordType = passwordType === 'password' ? 'text' : 'password'"
        />
        <v-text-field
          v-if="pageType === 'signUp' || pageType === 'reset-password'"
          v-model="passwordConfirmation"
          :append-inner-icon="passwordConfirmation ? 'mdi-eye' : undefined"
          :disabled="isLoading"
          :type="passwordConfirmationType"
          clearable
          label="Повторите пароль"
          persistent-clear
          persistent-crear
          variant="outlined"
          @click:append-inner="
            passwordConfirmationType = passwordConfirmationType === 'password' ? 'text' : 'password'
          "
        />

        <v-text-field
          v-if="pageType === 'tokenSignUp'"
          v-model="invitationToken"
          :disabled="isLoading"
          clearable
          label="Код приглашения"
          persistent-clear
          variant="outlined"
        />

        <v-checkbox v-if="pageType === 'signUp'" v-model="privacyPolicy" :disabled="isLoading">
          <template #label>
            <span>
              Я соглашаюсь с
              <RouterLink :to="{ name: 'privacy-policy' }" target="_blank">
                политикой в отношении персональных данных
              </RouterLink>
            </span>
          </template>
        </v-checkbox>

        <v-btn
          :disabled="isSendButtonDisabled || isLoading"
          :text="buttonText"
          class="button"
          rounded
          type="submit"
        />
      </form>
      <div v-if="pageType === 'signIn'">
        <v-btn
          :disabled="isLoading"
          size="small"
          text="Регистрация"
          variant="text"
          @click="pageType = 'signUp'"
        />
        <v-btn
          :disabled="isLoading"
          size="small"
          text="Восстановление пароля"
          variant="text"
          @click="pageType = 'restore'"
        />
        <v-btn
          :disabled="isLoading"
          size="small"
          text="Использовать код приглашения"
          variant="text"
          @click="pageType = 'tokenSignUp'"
        />
      </div>
      <v-btn
        v-else
        :disabled="isLoading"
        size="small"
        text="Вернуться на страницу входа"
        variant="text"
        @click="
          pageType = 'signIn';
          invitationToken = '';
        "
      />
    </div>
  </div>
  <PageFooter />
</template>

<style scoped>
.page {
  height: 100%;
  display: grid;
  place-items: center;
}

.container {
  max-width: 500px;
  width: 100%;
  text-align: center;
  align-items: stretch;
  color: rgb(var(--v-theme-primary));
  padding: 50px 80px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-surface-bright));
}

.container :deep(.v-btn__content) {
  font-weight: normal;
}

.text {
  font-size: 24px;
  color: black;
}

.user-type {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px;
}

.border-container {
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid rgb(var(--v-theme-surface-bright));
  border-top: 2px solid rgb(var(--v-theme-surface-bright));
  margin: 20px 0;
  padding: 20px 15px;
  gap: 16px;
}

.button {
  align-self: center;
}

@media (max-width: 800px) {
  .container {
    background: transparent;
    border: none;
    padding: 0;
  }
}
</style>
