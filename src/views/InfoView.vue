<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { verifyEmail as verifyEmailApi } from '@/api/auth';
import { getErrorText } from '@/api/http';

const route = useRoute();
const title = ref('');
const loading = ref(false);
const success = ref(false);
const error = ref('');
let emailToken = '';

async function verifyEmail() {
  try {
    loading.value = true;
    await verifyEmailApi(emailToken);
    success.value = true;
    emailToken = '';
  } catch (caughtError) {
    error.value = getErrorText(caughtError, 'Не удалось подтвердить Email');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (route.params.token) {
    switch (route.name) {
      case 'verify-email':
        title.value = 'Подтверждение Email';
        emailToken = route.params.token as string;
        await verifyEmail();
        break;
      default:
        title.value = 'Ошибка приглашения';
        error.value = route.params.error as string;
        break;
    }
  }
});
</script>

<template>
  <main class="main">
    <div class="container">
      <div class="content-wrapper">
        <h1 class="title">Подтверждение Email</h1>

        <div v-if="loading" class="status-block">
          <v-progress-circular indeterminate color="primary" size="32" />
          <div class="text">
            <p>Проверяем ваш адрес электронной почты</p>
            <p class="small">Пожалуйста, подождите...</p>
          </div>
        </div>

        <div v-else-if="success" class="status-block success">
          <v-icon icon="mdi-check-circle" color="success" size="64" class="status-icon" />
          <div class="text">
            <p class="welcome">Поздравляем!</p>
            <p>Ваш email успешно подтвержден</p>
            <div class="divider" />
            <p class="brand">Добро пожаловать в "Дневник Тренера"!</p>
            <p class="small">Теперь вы можете использовать все возможности сервиса</p>
            <v-btn
              color="primary"
              variant="outlined"
              class="mt-6"
              :to="{ name: 'my-diary' }"
              rounded
            >
              Зайти в сервис
            </v-btn>
          </div>
        </div>

        <div v-else class="status-block error">
          <v-icon icon="mdi-alert-circle" color="error" size="64" class="status-icon" />
          <div class="text">
            <p class="error-title">Что-то пошло не так</p>
            <p>{{ error }}</p>
            <p class="small">Возможно, ссылка устарела или была использована ранее</p>
            <v-btn color="primary" variant="outlined" class="mt-6" :to="{ name: 'home' }" rounded>
              Вернуться на главную
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  display: grid;
  place-items: center;
  height: 100%;
}

.container {
  width: 100%;
  max-width: 700px;
  background: rgb(var(--v-theme-surface));
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.content-wrapper {
  padding: 60px 40px;
  text-align: center;
}

.title {
  font-size: 28px;
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  margin-bottom: 16px;
}

.status-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.status-icon {
  animation: fadeIn 0.5s ease-out;
}

.text {
  font-size: 20px;
  line-height: 1.5;
}

.welcome {
  font-size: 24px;
  font-weight: 600;
  color: rgb(var(--v-theme-success));
  margin-bottom: 8px;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: rgb(var(--v-theme-error));
  margin-bottom: 8px;
}

.brand {
  font-size: 22px;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.small {
  font-size: 16px;
  color: rgb(var(--v-theme-text-secondary));
  margin-top: 8px;
}

.divider {
  height: 2px;
  background: rgba(var(--v-theme-primary), 0.1);
  margin: 24px auto;
  width: 100%;
  border-radius: 2px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 800px) {
  .container {
    background: transparent;
    box-shadow: none;
  }

  .content-wrapper {
    padding: 20px;
  }
}
</style>
