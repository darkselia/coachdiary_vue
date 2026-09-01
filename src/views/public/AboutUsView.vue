<script setup lang="ts">
import AboutSiteCard from '@/components/shared/content/AboutSiteCard.vue';
import PageFooter from '@/components/shared/layout/PageFooter.vue';
import PublicHero from '@/components/shared/content/PublicHero.vue';
import PublicSectionHeading from '@/components/shared/content/PublicSectionHeading.vue';
</script>

<template>
  <main>
    <PublicHero
      eyebrow="Команда проекта"
      title="О нас"
      description="Мы создаём «Дневник Тренера», чтобы цифровые инструменты помогали спортивному сообществу развиваться."
      image="/images/team/team-overview.webp"
    />

    <section class="public-page-content about-us-content">
      <AboutSiteCard
        alt="Команда проекта Дневник Тренера"
        :aspect-ratio="947 / 1017"
        badge="Команда проекта"
        eyebrow="Кто мы"
        src="/images/team/team-overview.webp"
        title="Объединяем спорт и технологии"
      >
        <p>
          Мы — группа студентов, увлечённых идеей создания эффективных решений для тренеров и
          учителей физкультуры. Веря в силу спорта как средства для развития и
          самосовершенствования, мы применили знания и навыки в программировании для создания
          «Дневника Тренера».
        </p>
        <template #footer>
          <div class="project-values" aria-label="Направления работы команды">
            <span>Идея</span>
            <span>Дизайн</span>
            <span>Разработка</span>
          </div>
        </template>
      </AboutSiteCard>

      <AboutSiteCard
        alt="Дарья, участница команды Дневника Тренера"
        :aspect-ratio="16 / 9"
        badge="Дарья"
        eyebrow="Создаём вместе"
        mirrored
        src="/images/team/dasha.webp"
        title="Учимся на реальных задачах"
      >
        <p>
          В процессе разработки «Дневника Тренера» мы не только применили академические знания, но и
          учились на реальных задачах и вызовах. Каждый из нас внёс уникальный вклад в проект,
          сочетая разные навыки и интересы — от веб-дизайна до программирования и анализа данных. Мы
          стремились создать инструмент, который будет функциональным, удобным и вдохновит
          пользователей на постоянное улучшение и достижение целей.
        </p>
      </AboutSiteCard>

      <section class="mission-story">
        <div class="mission-copy">
          <PublicSectionHeading eyebrow="Наша миссия" title="Делаем прогресс заметным">
            <p>
              Наша миссия выходит за рамки создания ещё одного веб-сервиса. Мы хотим вдохновить
              спортивное сообщество использовать цифровые технологии для улучшения тренировочного
              процесса, повышения мотивации и достижения лучших результатов. Мы верим, что «Дневник
              Тренера» может стать мостом между традиционными методами тренировок и современными
              технологическими решениями, делая спорт доступнее и эффективнее.
            </p>
          </PublicSectionHeading>
        </div>

        <div class="team-photos">
          <figure class="member-photo">
            <v-img
              alt="Вика, участница команды Дневника Тренера"
              :aspect-ratio="16 / 9"
              cover
              src="/images/team/vika.webp"
            />
            <figcaption>Вика</figcaption>
          </figure>
          <figure class="member-photo">
            <v-img
              alt="Матвей, участник команды Дневника Тренера"
              :aspect-ratio="16 / 9"
              cover
              src="/images/team/matvey.webp"
            />
            <figcaption>Матвей</figcaption>
          </figure>
        </div>
      </section>
    </section>
  </main>
  <PageFooter />
</template>

<style scoped>
.about-us-content {
  display: grid;
  gap: 40px;
}

.project-values {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.project-values span {
  padding: 8px 14px;
  border: 1px solid var(--v-public-primary-border-strong);
  border-radius: 999px;
  background: var(--v-public-primary-tint);
  color: rgb(var(--v-theme-primary));
  font-size: 14px;
  font-weight: 700;
}

.mission-story {
  overflow: hidden;
  padding-bottom: clamp(28px, 4vw, 54px);
  border: 1px solid var(--v-public-primary-border);
  border-radius: 24px;
  background: radial-gradient(
      circle at 100% 0%,
      var(--v-public-primary-tint-strong),
      transparent 38%
    ),
    rgb(var(--v-theme-surface));
  box-shadow: 0 8px 26px var(--v-public-card-shadow);
}

.mission-copy {
  padding: clamp(28px, 5vw, 68px) clamp(28px, 5vw, 68px) clamp(24px, 3vw, 38px);
}

.team-photos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 430px));
  justify-content: center;
  gap: clamp(16px, 3vw, 30px);
  padding: 0 clamp(20px, 5vw, 68px);
}

.member-photo {
  position: relative;
  width: 100%;
  max-width: 430px;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--v-public-primary-border);
  border-radius: 20px;
  background: var(--v-public-primary-tint);
  box-shadow: 0 12px 30px rgba(var(--v-theme-primary), 0.12);
}

.member-photo figcaption {
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(var(--v-theme-primary-darken-1), 0.82);
  color: white;
  backdrop-filter: blur(6px);
  font-size: 14px;
  font-weight: 700;
}

@media (max-width: 800px) {
  .about-us-content {
    gap: 28px;
  }

  .mission-copy {
    padding: 28px;
  }
}

@media (max-width: 560px) {
  .team-photos {
    grid-template-columns: minmax(0, 430px);
  }

  .mission-copy {
    padding: 24px;
  }

  .project-values {
    gap: 8px;
  }

  .project-values span {
    padding: 7px 11px;
  }
}
</style>
