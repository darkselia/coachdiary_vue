<script setup lang="ts">
import AboutSiteCart from '@/components/shared/content/AboutSiteCard.vue';
import PageFooter from '@/components/shared/layout/PageFooter.vue';
</script>

<template>
  <section>
    <h2 class="header">О нас</h2>
    <AboutSiteCart class="team-img" src="/team_photo.webp">
      Мы — группа студентов, увлеченных идеей создания эффективных решений для тренеров и учителей
      физкультуры. Веря в силу спорта как средства для развития и самосовершенствования, мы решили
      применить наши знания и навыки в программировании для создания Дневник тренера.
    </AboutSiteCart>
    <p class="text">
      В процессе разработки Дневник Тренера, мы не только применили наши академические знания, но и
      учились на реальных задачах и вызовах. Каждый из нас внес уникальный вклад в проект, сочетая в
      себе разнообразные навыки и интересы — от веб-дизайна до программирования и анализа данных.
      Работая над Дневником Тренера, мы стремились создать инструмент, который был бы не только
      функциональным и удобным в использовании, но и вдохновлял пользователей на постоянное
      улучшение и достижение целей.
    </p>
    <div class="team_photos">
      <img alt="Dasha" class="Dasha-img" src="/Dasha.webp" />
    </div>
    <p class="text">
      Наша миссия превышает рамки создания просто еще одного веб-сервиса. Мы хотим вдохновить
      спортивное сообщество на использование цифровых технологий как средства для улучшения
      тренировочного процесса, повышения мотивации и, в конечном итоге, достижения лучших
      результатов. Мы верим, что Дневник Тренера может стать мостом между традиционными методами
      тренировок и современными технологическими решениями, делая спорт более доступным и
      эффективным для всех.
    </p>
    <div class="team_photos">
      <img alt="Vika" src="/Vika.webp" />
      <img alt="Matvey" src="/Matvey.webp" />
    </div>
  </section>
  <PageFooter />
</template>

<style scoped>
section {
  padding-top: 60px;
  margin: 0 50px 80px;
  font-size: 22px;
}

.header {
  text-align: center;
  font-size: 40px;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 40px;
}

.text {
  margin: 30px auto 0;
  max-width: 1200px;
}

.team_photos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 30px auto 0;
  gap: 30px;
  max-width: 1000px;
}

.team_photos > img {
  width: 100%;
}

img.Dasha-img {
  grid-column: span 2;
  width: 50%;
  justify-self: center;
}

@media (max-width: 800px) {
  .header {
    font-size: 30px;
  }

  section {
    padding-top: 30px;
    margin: 0 20px 30px;
  }

  .text {
    font-size: 16px;
  }

  .team-img :deep(img) {
    object-fit: contain;
  }

  .team-img :deep(.img-border) {
    aspect-ratio: 1;
    height: 75%;
  }

  .team_photos {
    grid-template-columns: 1fr;
  }

  img.Dasha-img {
    width: 100%;
  }
}
</style>
