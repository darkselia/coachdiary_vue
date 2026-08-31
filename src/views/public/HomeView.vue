<script lang="ts" setup>
import CapabilitiesCard from '@/components/shared/content/CapabilitiesCard.vue';
import PageFooter from '@/components/shared/layout/PageFooter.vue';
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay();
</script>

<template>
  <v-img class="main-img" cover src="/luthfi-alfarizi-8i_KGxVeLtQ-unsplash.webp">
    <div class="main-img-overlay">
      <h1 class="main-text main-header">Дневник Тренера</h1>
      <!--      <SVGLogo class="icon" />
            <img src="/mobile_logo_blue (2).png" alt="ss">-->
      <p class="main-text describe">Универсальное приложение для тренеров спортивных секций</p>
      <div class="text">
        <v-btn :to="{ name: 'login' }" class="sigh-up-btn" rounded size="x-large" variant="flat">
          Зарегистрироваться
        </v-btn>
      </div>
    </div>
  </v-img>

  <section id="Capabilities" class="anchor-scroll">
    <h2 class="header">Возможности сервиса</h2>

    <v-carousel v-if="smAndDown" :show-arrows="false" height="330" cycle>
      <v-carousel-item content-class="carousel-item">
        <CapabilitiesCard icon="mdi-arrow-up-thin-circle-outline" title="Вход и создание аккаунта">
          Пользователи могут создать собственный аккаунт “Дневника Тренера”. Это обеспечивает
          безопасность данных, и позволяет каждому тренеру персонализировать свой опыт использования
          платформы.
        </CapabilitiesCard>
      </v-carousel-item>
      <v-carousel-item content-class="carousel-item">
        <CapabilitiesCard
          icon="mdi-filter-cog-outline"
          title="Фильтрация для эффективного поиска в базе учеников"
        >
          Наш сервис позволяет тренерам быстро находить нужную информацию о учениках, фильтруя
          данные по дисциплинам, классам или результатам. Такая функция облегчит планирование
          тренировок и отслеживание прогресса учеников.
        </CapabilitiesCard>
      </v-carousel-item>
      <v-carousel-item content-class="carousel-item">
        <CapabilitiesCard icon="mdi-database-outline" title="Управление базой нормативов">
          Пользователь может создавать таблицы нормативов, представленные спортивными федерациями
          или собственными тренировочными программами. Нормативы возможно просматривать и обновлять
          в любое время!
        </CapabilitiesCard>
      </v-carousel-item>
      <v-carousel-item content-class="carousel-item">
        <CapabilitiesCard
          icon="mdi-information-slab-circle-outline"
          title="Работа с информацией об учениках"
        >
          Функционал “Дневника Тренера” позволяет удобно управлять информацией об учениках, включая
          их личные данные, спортивный класс, достигнутые результаты и прогресс по нормативам.
        </CapabilitiesCard>
      </v-carousel-item>
    </v-carousel>

    <div v-else class="cap-container">
      <CapabilitiesCard icon="mdi-arrow-up-thin-circle-outline" title="Вход и создание аккаунта">
        Пользователи могут создать собственный аккаунт “Дневника Тренера”. Это обеспечивает
        безопасность данных, и позволяет каждому тренеру персонализировать свой опыт использования
        платформы.
      </CapabilitiesCard>
      <CapabilitiesCard
        icon="mdi-filter-cog-outline"
        title="Фильтрация для эффективного поиска в базе учеников"
      >
        Наш сервис позволяет тренерам быстро находить нужную информацию о учениках, фильтруя данные
        по дисциплинам, классам или результатам. Такая функция облегчит планирование тренировок и
        отслеживание прогресса учеников.
      </CapabilitiesCard>
      <CapabilitiesCard icon="mdi-database-outline" title="Управление базой нормативов">
        Пользователь может создавать таблицы нормативов, представленные спортивными федерациями или
        собственными тренировочными программами. Нормативы возможно просматривать и обновлять в
        любое время!
      </CapabilitiesCard>
      <CapabilitiesCard
        icon="mdi-information-slab-circle-outline"
        title="Работа с информацией об учениках"
      >
        Функционал “Дневника тренера” позволяет удобно управлять информацией об учениках, включая их
        личные данные, спортивный класс, достигнутые результаты и прогресс по нормативам.
      </CapabilitiesCard>
    </div>
    <p class="text">
      Каждая из возможностей разработана с учетом потребностей тренеров и учителей физкультуры,
      поэтому наш сервис максимально облегчает управление тренировочным процессом и отслеживанием
      успеваемости учеников. “Дневник Тренера” стремится предоставить инструменты для создания
      оптимальной тренировочной среды, способствующей развитию и достижению лучших результатов.
    </p>
  </section>

  <PageFooter />
</template>

<style scoped>
.anchor-scroll {
  scroll-margin-top: 64px;
}

.main-img {
  height: calc(100dvh - 64px);
}

.main-img-overlay {
  backdrop-filter: brightness(80%);
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
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
  font-weight: bold;
}

.main-header {
  font-size: 80px;
  text-transform: uppercase;
}

.icon {
  height: 250px;
  color: black;
}

.describe {
  --border-size: 2px;
  font-size: 25px;
  width: 700px;
  max-width: 100%;
}

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
  text-align: center;
  margin: 30px auto 0;
  max-width: 1200px;
}

.sigh-up-btn {
  font-size: 22px;
}

.cap-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 800px) {
  .main-header {
    font-size: 60px;
  }

  .describe {
    font-size: 20px;
  }

  .cap-container {
    grid-template-columns: 1fr;
  }

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
}
</style>
