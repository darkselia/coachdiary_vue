<script setup lang="ts">
import AboutSiteCart from '@/components/shared/content/AboutSiteCard.vue';
import PageFooter from '@/components/shared/layout/PageFooter.vue';
</script>

<template>
  <section>
    <h2 class="header">Почему "Дневник Тренера"?</h2>

    <AboutSiteCart
      alt="Тренер работает с дневником на планшете"
      eyebrow="Для тренеров"
      src="/main-page-girl.jpg"
      title="Управляйте прогрессом учеников"
    >
      Добро пожаловать в “Дневник Тренера” – ваш надежный помощник в управлении и контроле
      успеваемости учеников спортивных секций! Он создан специально для тренеров и учителей
      физкультуры. “Дневник Тренера” - уникальный сервис для эффективного отслеживания и анализа
      прогресса каждого ученика.
    </AboutSiteCart>
    <AboutSiteCart
      alt="Спортивная команда на тренировке"
      eyebrow="Организованный подход"
      mirrored
      src="/jesse-orrico-mse1vdzZXjA-unsplash.webp"
      title="Всё необходимое — в одном месте"
    >
      В мире, где спорт играет ключевую роль в физическом и психологическом развитии молодежи,
      важность четкого и организованного подхода к тренировочному процессу не может быть
      переоценена. “Дневник Тренера” призван стать инструментом в руках тренеров, предлагая
      комплексное решение для управления успеваемостью и прогрессом учеников спортивных секций.
    </AboutSiteCart>
    <AboutSiteCart
      alt="Люди обсуждают результаты тренировок"
      eyebrow="Практичный сервис"
      src="/main-page-people.jpg"
      title="Создан для спортивного сообщества"
    >
      Разработанный с учетом реальных потребностей и задач спортивного сообщества, “Дневник Тренера”
      объединяет в себе функциональность и удобство, делая процесс управления спортивным обучением
      более эффективным и результативным. С его помощью вы сможете не только следить за
      индивидуальным прогрессом каждого ученика, но и визуализировать успеваемость группы в целом,
      что позволит более целенаправленно подходить к планированию тренировок и обучения.
    </AboutSiteCart>
    <p class="text">
      Присоединяйтесь к "Дневник Тренера" сегодня и начните новую эру в управлении спортивным
      обучением!
    </p>
    <div class="text">
      <v-btn :to="{ name: 'login' }" class="sigh-up-btn" rounded size="x-large" variant="flat">
        Зарегистрироваться
      </v-btn>
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
  text-align: center;
  margin: 30px auto 0;
  max-width: 1200px;
}

.sigh-up-btn {
  font-size: 22px;
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
}
</style>
