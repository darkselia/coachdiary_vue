<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import GuideSection from '@/components/shared/content/GuideSection.vue';
import GuideSteps from '@/components/shared/content/GuideSteps.vue';
import PageFooter from '@/components/shared/layout/PageFooter.vue';
import PublicHero from '@/components/shared/content/PublicHero.vue';
import PublicNotice from '@/components/shared/content/PublicNotice.vue';

type Audience = 'teacher' | 'student';

const isScrollToTopVisible = ref(false);
const activeAudience = ref<Audience>('teacher');
let mediaObserver: IntersectionObserver | undefined;

function observeRenderedVideos(): void {
  mediaObserver?.disconnect();
  document.querySelectorAll<HTMLVideoElement>('video.guide-media').forEach((video) => {
    mediaObserver?.observe(video);
  });
}

const audienceContents = computed(() =>
  activeAudience.value === 'teacher'
    ? [
        { href: '#students', label: 'Ученики и приглашения' },
        { href: '#standards', label: 'Нормативы' },
        { href: '#diary', label: 'Дневник и результаты' },
        { href: '#reports', label: 'Профиль и отчёты' },
        { href: '#help', label: 'Если что-то не получается' },
      ]
    : [
        { href: '#student', label: 'Регистрация по приглашению' },
        { href: '#student-results', label: 'Просмотр результатов' },
        { href: '#help', label: 'Если что-то не получается' },
      ],
);

function updateScrollToTopVisibility(): void {
  isScrollToTopVisible.value = window.scrollY >= window.innerHeight;
}

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectAudience(audience: Audience): void {
  activeAudience.value = audience;
  scrollToTop();
}

onMounted(() => {
  if (window.location.hash === '#student' || window.location.hash === '#student-results') {
    activeAudience.value = 'student';
  }
  updateScrollToTopVisibility();
  window.addEventListener('scroll', updateScrollToTopVisibility, { passive: true });

  mediaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });
    },
    { threshold: [0, 0.25] },
  );

  nextTick(observeRenderedVideos);
});

watch(activeAudience, () => nextTick(observeRenderedVideos), { flush: 'post' });

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollToTopVisibility);
  mediaObserver?.disconnect();
  mediaObserver = undefined;
});
</script>

<template>
  <main class="instruction-page">
    <PublicHero
      eyebrow="Помощь пользователям"
      title="Как пользоваться «Дневником Тренера»"
      description="Здесь собраны основные действия для тренеров и учеников — от регистрации до работы с результатами. Выполняйте шаги по порядку или сразу перейдите к нужному разделу."
      image="/images/backgrounds/about-service-team.jpg"
    />

    <div class="content-layout">
      <nav class="contents" aria-label="Содержание инструкции">
        <v-btn-toggle
          v-model="activeAudience"
          class="audience-switcher"
          color="primary"
          mandatory
          @update:model-value="selectAudience"
        >
          <v-btn value="teacher" prepend-icon="mdi-whistle-outline">Я тренер</v-btn>
          <v-btn value="student" prepend-icon="mdi-account-school-outline">Я ученик</v-btn>
        </v-btn-toggle>
        <h2>Содержание</h2>
        <a v-for="item in audienceContents" :key="item.href" :href="item.href">{{ item.label }}</a>
      </nav>

      <article class="guide">
        <GuideSection
          v-if="activeAudience === 'teacher'"
          id="teacher"
          type="highlighted"
          icon="mdi-whistle-outline"
          section-label="Роль: тренер или учитель"
          title="Подготовка к работе"
        >
          <p>
            После входа тренеру доступны три основных раздела:
            <strong>«Мои классы»</strong>
            ,
            <strong>«Дневник»</strong>
            и
            <strong>«Мои нормативы»</strong>
            . Удобнее всего сначала добавить учеников и нормативы, а затем перейти к заполнению
            дневника.
          </p>
          <PublicNotice
            title="На телефоне"
            description="Основные разделы находятся на нижней панели. Кнопка с плюсом открывает форму создания ученика или норматива в зависимости от текущего раздела."
          />

          <video
            class="guide-media"
            src="/video/teacher-navigation.webm"
            controls
            muted
            loop
            playsinline
            preload="metadata"
          />
        </GuideSection>

        <GuideSection
          v-if="activeAudience === 'teacher'"
          id="students"
          section-label="Шаг 1"
          title="Добавление учеников и работа с классами"
        >
          <p>
            В разделе
            <strong>«Мои классы»</strong>
            можно создавать классы и карточки учеников, искать нужного ученика, просматривать его
            результаты и отправлять приглашения для регистрации в сервисе.
          </p>

          <h3>Как добавить ученика</h3>
          <GuideSteps>
            <li>Нажмите кнопку с плюсом.</li>
            <li>Заполните ФИО, пол и дату рождения ученика.</li>
            <li>Выберите номер и букву школьного класса.</li>
            <li>
              Нажмите
              <strong>«Сохранить»</strong>
              .
            </li>
          </GuideSteps>
          <p>
            Если класса ещё нет, он появится автоматически после добавления первого ученика. Номер
            класса также используется как текущий год обучения и определяет доступные нормативы.
          </p>

          <video
            class="guide-media"
            src="/video/teacher-create-student.webm"
            controls
            muted
            loop
            playsinline
            preload="metadata"
          />
          <PublicNotice
            type="danger"
            title="Удаление класса удаляет весь класс."
            description="Перед подтверждением проверьте название класса и убедитесь, что данные его и учеников больше не нужны."
          />

          <h3>Поиск и карточка ученика</h3>
          <GuideSteps>
            <li>
              Выберите класс на боковой панели или начните вводить имя ученика в строке поиска.
            </li>
            <li>После выбора ученика нажмите на его имя, чтобы открыть его карточку.</li>
          </GuideSteps>
          <p>
            В карточке ученика можно переключать годы обучения и видеть все нормативы, результаты,
            оценки и итоговую среднюю оценку. Тренер также может исправить значения и сохранить
            изменения.
          </p>
          <video
            class="guide-media"
            src="/video/teachet-student-card.webm"
            controls
            muted
            loop
            playsinline
            preload="metadata"
          />

          <h3>Как пригласить ученика</h3>
          <GuideSteps>
            <li>В списке класса найдите код приглашения напротив нужного ученика.</li>
            <li>Передайте ученику код или ссылку-приглашение.</li>
            <li>
              Чтобы подготовить приглашения сразу для класса, нажмите
              <strong>«Скачать QR-коды приглашений»</strong>
              .
            </li>
          </GuideSteps>
          <p>
            Один аккаунт ученика связан с одной заранее созданной карточкой. Не публикуйте коды и
            QR-коды в открытом доступе.
          </p>

          <video
            class="guide-media"
            src="/video/teachet-QRcodes.webm"
            controls
            muted
            loop
            playsinline
            preload="metadata"
          />

          <h3>Перевод классов на следующий год</h3>
          <p>
            В разделе «Мои классы» кнопка
            <strong>«Перевести на следующий год»</strong>
            увеличивает номер всех классов, сохраняя их буквы. Выпускные 11-е классы при этом
            удаляются. Однако ученик может продолжать просматривать свои результаты в личном
            аккаунте.
          </p>
          <PublicNotice
            type="warning"
            title="Сначала скачайте отчёт и резервную копию."
            description="Запускайте перевод только один раз в конце учебного года и внимательно прочитайте окно подтверждения."
          />
        </GuideSection>

        <GuideSection
          v-if="activeAudience === 'teacher'"
          id="standards"
          section-label="Шаг 2"
          title="Создание нормативов"
        >
          <p>
            В разделе
            <strong>«Мои нормативы»</strong>
            можно переключаться между физическими и техническими нормативами, выбирать год обучения,
            просматривать нормы, изменять или удалять выбранный норматив.
          </p>

          <h3>Как создать норматив</h3>
          <GuideSteps>
            <li>Нажмите кнопку с плюсом в разделе «Мои нормативы».</li>
            <li>Введите понятное название и выберите тип норматива.</li>
            <li>Отметьте годы обучения, для которых он применяется.</li>
            <li>Заполните параметры норматива и проверьте введённые значения.</li>
            <li>
              Нажмите
              <strong>«Сохранить»</strong>
              .
            </li>
          </GuideSteps>

          <h3>Физический норматив</h3>
          <p>
            Подходит для измеримого результата: времени, количества повторений, расстояния и других
            чисел. Выберите, что считается лучшим результатом:
          </p>
          <ul>
            <li>
              <strong>«Больше — лучше»</strong>
              , например количество повторений;
            </li>
            <li>
              <strong>«Меньше — лучше»</strong>
              , например время прохождения дистанции.
            </li>
          </ul>
          <h3>Технический норматив</h3>
          <p>
            Используйте его, когда результат оценивается тренером вручную по шкале от 1 до 5. Для
            такого норматива достаточно названия и выбора годов обучения — числовые пороги не нужны.
          </p>

          <video
            class="guide-media"
            src="/video/teacher-create-standard.webm"
            controls
            muted
            loop
            playsinline
            preload="metadata"
          />
        </GuideSection>

        <GuideSection
          v-if="activeAudience === 'teacher'"
          id="diary"
          section-label="Шаг 3"
          title="Дневник и результаты"
        >
          <h3>Как внести результат</h3>
          <GuideSteps>
            <li>
              Откройте раздел
              <strong>«Дневник»</strong>
              .
            </li>
            <li>Выберите класс.</li>
            <li>
              В правой части выберите режим
              <strong>«Один»</strong>
              и нужный норматив.
            </li>
            <li>
              Для физического норматива введите результат — оценка будет рассчитана по заданным
              нормам. Для технического норматива поставьте оценку от 1 до 5.
            </li>
            <li>
              Нажмите
              <strong>«Сохранить»</strong>
              под таблицей.
            </li>
          </GuideSteps>

          <video
            class="guide-media"
            src="/video/teacher-diary-single.webm"
            controls
            muted
            loop
            playsinline
            preload="metadata"
          />

          <h3>Фильтры дневника</h3>
          <p>
            Слева находятся фильтры по полу, оценке и году рождения. Выберите условия и нажмите
            <strong>«Принять»</strong>
            . Кнопка
            <strong>«Сбросить»</strong>
            снова покажет всех учеников.
          </p>

          <h3>Сравнение результатов</h3>
          <p>
            Переключите режим с
            <strong>«Один»</strong>
            на
            <strong>«Несколько»</strong>
            и выберите не менее двух нормативов. В таблице появятся средние значения и оценки. Такой
            режим удобен для общего сравнения успеваемости учеников.
          </p>

          <video
            class="guide-media"
            src="/video/teacher-diary-multyple.webm"
            controls
            muted
            loop
            playsinline
            preload="metadata"
          />
        </GuideSection>

        <GuideSection
          v-if="activeAudience === 'teacher'"
          id="reports"
          section-label="Дополнительные возможности"
          title="Профиль, отчёты и перенос данных"
        >
          <p>
            В разделе
            <strong>«Профиль»</strong>
            можно изменить имя, почту или пароль. После смены пароля сайт попросит войти заново.
            Если новая почта ещё не подтверждена, отправьте письмо повторно с этой же страницы.
          </p>
          <v-img class="guide-media" src="/video/teacher-profile.png" alt="Профиль тренера" />

          <h3>Отчёт XLSX</h3>
          <GuideSteps>
            <li>
              В профиле откройте
              <strong>«Данные и отчёты»</strong>
              .
            </li>
            <li>
              Выберите содержимое файла: таблицу нормативов, сводные результаты и/или отдельные
              листы нормативов.
            </li>
            <li>
              Нажмите
              <strong>«Скачать отчёт»</strong>
              .
            </li>
          </GuideSteps>

          <h3>Резервная копия JSON</h3>
          <p>
            Кнопка
            <strong>«Экспортировать»</strong>
            сохраняет все данные аккаунта в JSON-файл. Для переноса данных выберите
            <strong>«Импортировать»</strong>
            и укажите ранее сохранённый файл.
          </p>

          <video
            class="guide-media"
            src="/video/teacher-export.webm"
            controls
            muted
            loop
            playsinline
            preload="metadata"
          />

          <PublicNotice
            type="warning"
            title="Перед импортом сохраните текущие данные."
            description="Используйте только JSON-файл, ранее полученный из «Дневника Тренера», и не изменяйте его вручную."
          />
        </GuideSection>

        <GuideSection
          v-if="activeAudience === 'student'"
          id="student"
          type="highlighted"
          icon="mdi-account-school-outline"
          section-label="Роль: ученик"
          title="Регистрация и просмотр результатов"
        >
          <h3>Регистрация по приглашению</h3>
          <GuideSteps>
            <li>Получите у тренера ссылку, код приглашения или QR-код.</li>
            <li>
              Откройте ссылку или на странице входа нажмите
              <strong>«Использовать код приглашения»</strong>
              и введите код.
            </li>
            <li>Проверьте ФИО, которое заранее указал тренер.</li>
            <li>Введите свою почту, придумайте пароль и завершите регистрацию.</li>
            <li>Подтвердите почту по ссылке из письма и войдите в аккаунт.</li>
          </GuideSteps>

          <video
            class="guide-media"
            src="/video/student-login.webm"
            controls
            muted
            loop
            playsinline
            preload="metadata"
          />
        </GuideSection>
        <GuideSection
          v-if="activeAudience === 'student'"
          id="student-results"
          title="Как посмотреть результаты"
        >
          <p>
            После входа откройте
            <strong>«Мои результаты»</strong>
            . Выберите нужный год обучения. В таблице указаны нормативы, ваши результаты, оценки и
            итоговая средняя оценка. Ученик не может изменять результаты — это делает тренер.
          </p>
          <PublicNotice
            title="На телефоне"
            description="Кнопки «Мои результаты» и «Профиль» находятся на нижней панели, а выбор года обучения открывается отдельной кнопкой над таблицей."
          />

          <video
            class="guide-media"
            src="/video/student-diary.webm"
            controls
            muted
            loop
            playsinline
            preload="metadata"
          />

          <p>
            В профиле ученик может изменить почту и пароль. ФИО изменяет тренер в карточке ученика,
            чтобы данные в журнале и аккаунте оставались одинаковыми.
          </p>
        </GuideSection>

        <GuideSection id="help" section-label="Помощь" title="Если что-то не получается">
          <ul class="check-list">
            <li>
              Прочитайте сообщение в верхней или нижней части экрана — там указана причина ошибки.
            </li>
            <li>Проверьте подключение к интернету и попробуйте выполнить действие ещё раз.</li>
            <li>Если не приходит письмо, проверьте папки «Спам» и «Рассылки».</li>
            <li>Письмо для подтверждения почты можно отправить повторно из профиля.</li>
            <li>Если страница отображается неправильно, обновите её и снова войдите в аккаунт.</li>
          </ul>

          <p>Если проблема осталась, напишите нам:</p>
          <div class="support-links">
            <v-btn
              href="https://vk.com/coach0diary"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-account-group"
            >
              ВКонтакте
            </v-btn>
          </div>
        </GuideSection>
      </article>
    </div>
  </main>

  <v-btn
    v-show="isScrollToTopVisible"
    class="scroll-to-top"
    color="primary"
    elevation="6"
    prepend-icon="mdi-arrow-up"
    rounded="pill"
    text="Вверх"
    aria-label="Вернуться к началу страницы"
    @click="scrollToTop"
  />

  <PageFooter />
</template>

<style scoped>
.instruction-page {
  color: rgb(var(--v-theme-on-background));
}

.content-layout {
  display: grid;
  grid-template-columns: 300px minmax(0, 1350px);
  gap: 64px;
  justify-content: center;
  max-width: 1500px;
  margin: 0 auto;
  padding: 52px 24px 80px;
}

.contents {
  position: sticky;
  top: 92px;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
  border: 1px solid var(--v-public-primary-border);
  border-radius: 14px;
  background: rgb(var(--v-theme-surface));
}

.contents h2 {
  margin: 0 0 8px;
  color: rgb(var(--v-theme-primary));
  font-size: 20px;
}

.audience-switcher {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  margin: 0 0 12px;
}

.contents a {
  padding: 7px 0;
  color: rgb(var(--v-theme-on-background));
  text-decoration: none;
  line-height: 1.35;
}

.contents a:hover,
.contents a:focus-visible {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

.guide-section h3 {
  margin: 34px 0 12px;
  color: rgb(var(--v-theme-primary-darken-1));
  font-size: 23px;
}

.guide-section p,
.guide-section li {
  font-size: 18px;
  line-height: 1.7;
}

.guide-section ul:not(.check-list) {
  padding-left: 25px;
}

.guide-media {
  display: block;
  width: 100%;
  max-width: 700px;
  height: auto;
  margin: 28px auto;
  border: 1px solid var(--v-public-primary-border);
  border-radius: 16px;
  object-fit: contain;
}

.check-list {
  padding: 0;
  list-style: none;
}

.check-list li {
  position: relative;
  margin: 12px 0;
  padding-left: 34px;
}

.check-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: rgb(var(--v-theme-primary));
  font-weight: 800;
}

.support-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.back-to-top {
  padding-top: 32px;
  text-align: right;
}

.back-to-top a {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  text-decoration: none;
}

.scroll-to-top {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 1100;
}

@media (max-width: 900px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .contents {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .contents h2 {
    grid-column: 1 / -1;
  }

  .audience-switcher {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .content-layout {
    padding: 28px 16px 56px;
  }

  .contents {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .guide-section p,
  .guide-section li {
    font-size: 16px;
  }

  .guide-section h3 {
    font-size: 21px;
  }

  .scroll-to-top {
    right: 16px;
    bottom: 16px;
  }
}
</style>
