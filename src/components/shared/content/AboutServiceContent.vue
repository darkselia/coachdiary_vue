<script setup lang="ts">
import AboutSiteCard from '@/components/shared/content/AboutSiteCard.vue';
import CapabilitiesCard from '@/components/shared/content/CapabilitiesCard.vue';
import PublicSectionHeading from '@/components/shared/content/PublicSectionHeading.vue';

const capabilities = [
  {
    icon: 'mdi-account-plus-outline',
    title: 'Вход и создание аккаунта',
    description:
      'Личный аккаунт помогает сохранять данные и настраивать рабочее пространство под задачи конкретного тренера.',
  },
  {
    icon: 'mdi-filter-cog-outline',
    title: 'Быстрый поиск учеников',
    description:
      'Фильтры помогают находить учеников по классу, полу, возрасту и результатам, чтобы быстрее работать с большой группой.',
  },
  {
    icon: 'mdi-database-outline',
    title: 'Управление нормативами',
    description:
      'Создавайте физические и технические нормативы, назначайте их нужным годам обучения и обновляйте в любое время.',
  },
  {
    icon: 'mdi-chart-line',
    title: 'Результаты и прогресс',
    description:
      'Храните результаты учеников, сравнивайте показатели и используйте отчёты для планирования следующих занятий.',
  },
] as const;

const serviceStories = [
  {
    src: '/images/backgrounds/about-service-girl.jpg',
    alt: 'Спортсменка на тренировке',
    eyebrow: 'Всё необходимое рядом',
    title: 'Следите за прогрессом без лишних таблиц',
    badge: 'Для тренеров и учителей',
    aspectRatio: 596 / 650,
    mirrored: false,
    description:
      '«Дневник Тренера» помогает управлять успеваемостью учеников спортивных секций. Сервис создан специально для тренеров и учителей физкультуры, которым важно быстро видеть результаты каждого ученика и всей группы.',
  },
  {
    src: '/images/backgrounds/about-service-training.webp',
    alt: 'Совместная спортивная тренировка',
    eyebrow: 'Продумано для практики',
    title: 'Организуйте тренировочный процесс',
    badge: 'Рабочий процесс',
    aspectRatio: 3 / 2,
    mirrored: true,
    description:
      'Спорт играет важную роль в физическом и психологическом развитии. Сервис предлагает цельный подход к работе с классами, нормативами и результатами, помогая сохранять порядок и уделять больше времени самой тренировке.',
  },
  {
    src: '/images/backgrounds/about-service-team.jpg',
    alt: 'Команда после тренировки',
    eyebrow: 'Решения на основе данных',
    title: 'Замечайте изменения и планируйте точнее',
    badge: 'Наглядные результаты',
    aspectRatio: 596 / 650,
    mirrored: false,
    description:
      'Наглядные результаты помогают отслеживать индивидуальный прогресс и общую успеваемость группы. Так тренеру проще корректировать планы занятий и выбирать подходящие задачи для дальнейшего развития учеников.',
  },
] as const;
</script>

<template>
  <section id="Capabilities" class="public-page-content about-service-content">
    <PublicSectionHeading
      align="center"
      eyebrow="Возможности сервиса"
      title="Меньше рутины — больше внимания ученикам"
    >
      <p>
        «Дневник Тренера» собирает классы, нормативы и результаты в одном понятном рабочем
        пространстве.
      </p>
    </PublicSectionHeading>

    <div class="capabilities-grid">
      <CapabilitiesCard
        v-for="capability in capabilities"
        :key="capability.title"
        :icon="capability.icon"
        :title="capability.title"
      >
        <p>{{ capability.description }}</p>
      </CapabilitiesCard>
    </div>

    <div class="service-stories">
      <AboutSiteCard
        v-for="story in serviceStories"
        :key="story.title"
        :alt="story.alt"
        :aspect-ratio="story.aspectRatio"
        :badge="story.badge"
        :eyebrow="story.eyebrow"
        :mirrored="story.mirrored"
        :src="story.src"
        :title="story.title"
        grayscale
      >
        <p>{{ story.description }}</p>
      </AboutSiteCard>
    </div>

    <section class="join-callout">
      <div>
        <p class="join-callout__eyebrow">Начните работу</p>
        <h2>Сделайте прогресс учеников заметным</h2>
        <p>Создайте аккаунт и соберите учебный процесс в одном месте.</p>
      </div>
      <v-btn :to="{ name: 'login' }" rounded="pill" size="x-large" variant="flat">
        Зарегистрироваться
      </v-btn>
    </section>
  </section>
</template>

<style scoped>
.about-service-content,
.service-stories {
  display: grid;
  gap: 40px;
}

.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.join-callout {
  display: flex;
  gap: 32px;
  align-items: center;
  justify-content: space-between;
  padding: clamp(28px, 5vw, 58px);
  border: 1px solid var(--v-public-primary-border-strong);
  border-radius: 24px;
  background: linear-gradient(135deg, var(--v-public-primary-tint-strong), transparent 65%),
    rgb(var(--v-theme-surface));
  box-shadow: 0 8px 26px var(--v-public-card-shadow);
}

.join-callout > div {
  max-width: 780px;
}

.join-callout__eyebrow {
  margin: 0 0 10px;
  color: rgb(var(--v-theme-primary-lighten-2));
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.join-callout h2 {
  margin: 0 0 16px;
  color: rgb(var(--v-theme-primary));
  font-size: clamp(28px, 3.5vw, 44px);
  line-height: 1.15;
}

.join-callout p:last-child {
  margin: 0;
  font-size: clamp(16px, 1.5vw, 20px);
  line-height: 1.7;
}

.join-callout .v-btn {
  flex: 0 0 auto;
}

@media (max-width: 800px) {
  .about-service-content,
  .service-stories {
    gap: 28px;
  }

  .capabilities-grid {
    grid-template-columns: 1fr;
  }

  .join-callout {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .join-callout {
    padding: 24px;
  }

  .join-callout .v-btn {
    width: 100%;
  }
}
</style>
