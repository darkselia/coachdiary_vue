<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <footer>
    <div class="footer">
      <div class="footer-column">
        <div class="header">Компания</div>
        <RouterLink :to="{ name: 'about-site' }">О сайте</RouterLink>
        <RouterLink :to="{ name: 'about-us' }" variant="text">О нас</RouterLink>
        <RouterLink :to="{ name: 'privacy-policy' }" variant="text">
          Политика конфиденциальности
        </RouterLink>
      </div>

      <div class="footer-column">
        <div class="header">Возможности</div>
        <RouterLink to="/#Capabilities">Преподавателям</RouterLink>
      </div>

      <div class="footer-column">
        <div class="header">Контакты</div>
        <div class="logo">
          <v-btn href="https://t.me/coach0diary" variant="text" target="_blank">
            <img src="/telegram-svgrepo-com.svg" alt="Telegram" width="24" height="24" />
          </v-btn>
          <v-btn href="https://vk.com/coach0diary" variant="text" target="_blank">
            <img src="/vk-1-logo-svgrepo-com.svg" alt="VK" width="24" height="24" />
          </v-btn>
        </div>
        <div>
          2023 - 2025 —
          <strong>Дневник Тренера</strong>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  padding: 20px 30px;
  background-color: rgb(var(--v-theme-primary-darken-1));
  color: rgb(var(--v-theme-on-surface-variant));
}

.footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;

  @media (width <= 600px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.header {
  font-weight: bold;
  margin-bottom: 5px;
}

footer :deep(a) {
  color: #bebebe;
  text-decoration: none;
  font-size: 14px;
}

.logo {
  display: flex;
  gap: 10px;
}

.logo :deep(.v-btn) {
  width: fit-content;
  height: fit-content;
  padding: 0;
  min-width: 0;
}
</style>
