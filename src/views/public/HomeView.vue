<script setup lang="ts">
import AboutServiceContent from '@/components/shared/content/AboutServiceContent.vue';
import PageFooter from '@/components/shared/layout/PageFooter.vue';
</script>

<template>
  <main>
    <v-img class="main-img" cover src="/images/backgrounds/training-session-hero.webp">
      <div class="main-img-overlay">
        <h1 class="main-text main-header">Дневник Тренера</h1>
        <p class="main-text describe">Универсальное приложение для тренеров спортивных секций</p>
        <v-btn :to="{ name: 'login' }" class="sign-up-btn" rounded size="x-large" variant="flat">
          Зарегистрироваться
        </v-btn>
      </div>
    </v-img>

    <AboutServiceContent />
  </main>
  <PageFooter />
</template>

<style scoped>
.main-img {
  height: calc(100dvh - 64px);
}

.main-img-overlay {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 24px;
  backdrop-filter: brightness(80%);
  text-align: center;
  font-family: 'Roboto Condensed', sans-serif;
}

.main-text {
  --border-size: 3px;
  color: white;
  text-shadow:
    calc(-1 * var(--border-size)) calc(-1 * var(--border-size)) 0 rgb(var(--v-theme-primary)),
    var(--border-size) calc(-1 * var(--border-size)) 0 rgb(var(--v-theme-primary)),
    calc(-1 * var(--border-size)) var(--border-size) 0 rgb(var(--v-theme-primary)),
    var(--border-size) var(--border-size) 0 rgb(var(--v-theme-primary));
  font-weight: 700;
}

.main-header {
  margin: 0;
  font-size: clamp(48px, 8vw, 80px);
  line-height: 1.05;
  text-transform: uppercase;
}

.describe {
  --border-size: 2px;
  width: 700px;
  max-width: 100%;
  margin: 20px 0 30px;
  font-size: clamp(20px, 3vw, 25px);
}

.sign-up-btn {
  font-size: 20px;
}

@media (max-width: 600px) {
  .main-img {
    height: max(520px, calc(100dvh - 45px));
  }

  .main-header {
    font-size: clamp(42px, 15vw, 60px);
  }

  .sign-up-btn {
    width: min(100%, 320px);
    font-size: 17px;
  }
}
</style>
