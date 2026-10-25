<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const storageKey = 'cookieNoticeDismissed';
const isVisible = ref(true);

try {
  isVisible.value = localStorage.getItem(storageKey) !== 'true';
} catch {
  // Keep the notice available when browser storage is blocked.
}

function dismiss() {
  isVisible.value = false;

  try {
    localStorage.setItem(storageKey, 'true');
  } catch {
    // Closing still works for the current visit without browser storage.
  }
}
</script>

<template>
  <v-footer
    v-if="isVisible"
    app
    :order="-1"
    tag="aside"
    aria-label="Использование файлов cookie"
    color="surface"
    elevation="4"
    class="cookie-notice"
  >
    <div class="cookie-notice__content">
      <p class="cookie-notice__text">
        На сайте используются файлы cookie, необходимые для работы его базовых функций. Продолжая
        пользоваться сайтом, вы подтверждаете согласие с нашей
        <RouterLink :to="{ name: 'privacy' }" class="cookie-notice__link">
          Политикой конфиденциальности
        </RouterLink>
        .
      </p>
      <v-btn class="cookie-notice__dismiss" @click="dismiss">Понятно</v-btn>
    </div>
  </v-footer>
</template>

<style scoped>
.cookie-notice {
  padding: 16px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(var(--v-theme-primary), 0.18);
}

.cookie-notice__content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.cookie-notice__text {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

.cookie-notice__link {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

@media (max-width: 599px) {
  .cookie-notice__content {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: start;
    gap: 12px;
  }

  .cookie-notice__dismiss {
    grid-column: 1;
    justify-self: start;
  }
}
</style>
