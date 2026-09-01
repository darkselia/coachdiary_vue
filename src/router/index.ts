import { createRouter, createWebHistory, type RouteLocationRaw } from 'vue-router';
import { useUserStore } from '@/stores/user';
import HomeView from '@/views/public/HomeView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import MyDiaryView from '@/views/diary/MyDiaryView.vue';
import MyStandardsView from '@/views/standards/MyStandardsView.vue';
import ProfileView from '@/views/profile/ProfileView.vue';
import CreateOrUpdateStandardView from '@/views/standards/CreateOrUpdateStandardView.vue';
import CreateOrUpdateStudentView from '@/views/students/CreateOrUpdateStudentView.vue';
import StudentView from '@/views/students/StudentView.vue';
// import AboutSiteView from '@/views/public/AboutSiteView.vue';
import AboutUsView from '@/views/public/AboutUsView.vue';
import MyClassesView from '@/views/classes/MyClassesView.vue';
import PrivacyPolicyView from '@/views/public/PrivacyPolicyView.vue';
import InstructionView from '@/views/public/InstructionView.vue';
import InfoView from '@/views/auth/InfoView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { mobileTitle: 'Дневник тренера' },
    },
    /* {
      path: '/about-site',
      name: 'about-site',
      component: AboutSiteView,
      meta: { mobileTitle: 'Дневник тренера' },
    }, */
    {
      path: '/about-us',
      name: 'about-us',
      component: AboutUsView,
      meta: { mobileTitle: 'Дневник Тренера' },
    },
    {
      path: '/instruction',
      name: 'instruction',
      component: InstructionView,
      meta: { mobileTitle: 'Инструкция' },
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: PrivacyPolicyView,
      meta: { mobileTitle: 'Дневник Тренера' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { mobileTitle: 'Дневник Тренера' },
      beforeEnter: isNotAuthenticated,
    },
    {
      path: '/join/:token',
      name: 'join',
      component: LoginView,
      props: true,
      meta: { mobileTitle: 'Дневник Тренера' },
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: LoginView,
      props: true,
      meta: { mobileTitle: 'Дневник Тренера' },
    },
    {
      path: '/verify-email/:token',
      name: 'verify-email',
      component: InfoView,
      props: true,
      meta: { mobileTitle: 'Дневник Тренера' },
    },
    {
      path: '/info/:error',
      name: 'info',
      component: InfoView,
      props: true,
      meta: { mobileTitle: 'Дневник Тренера' },
    },
    {
      path: '/app',
      name: 'app',
      redirect: { name: 'my-diary' },
      meta: { mobileTitle: 'Дневник тренера' },
      beforeEnter: isAuthenticatedTeacher,
    },
    {
      path: '/app/my-diary',
      name: 'my-diary',
      component: MyDiaryView,
      meta: { mobileTitle: 'Дневник' },
      beforeEnter: isAuthenticatedTeacher,
    },
    {
      path: '/app/my-classes',
      name: 'my-classes',
      component: MyClassesView,
      meta: { mobileTitle: 'Мои ученики' },
      beforeEnter: isAuthenticatedTeacher,
    },
    {
      path: '/app/my-classes/create',
      name: 'create-student',
      component: CreateOrUpdateStudentView,
      meta: { mobileTitle: 'Создание ученика' },
      beforeEnter: isAuthenticatedTeacher,
    },
    {
      path: '/app/my-classes/update/:id',
      name: 'update-student',
      component: CreateOrUpdateStudentView,
      meta: { mobileTitle: 'Обновление ученика' },
      beforeEnter: isAuthenticatedTeacher,
    },
    {
      path: '/app/my-classes/:id',
      name: 'student',
      component: StudentView,
      meta: { mobileTitle: 'Ученик' },
      beforeEnter: isAuthenticated,
    },
    {
      path: '/app/my-standards',
      name: 'my-standards',
      component: MyStandardsView,
      meta: { mobileTitle: 'Мои нормативы' },
      beforeEnter: isAuthenticatedTeacher,
    },
    {
      path: '/app/my-standards/create',
      name: 'create-standard',
      component: CreateOrUpdateStandardView,
      meta: { mobileTitle: 'Создание норматива' },
      beforeEnter: isAuthenticatedTeacher,
    },
    {
      path: '/app/my-standards/update/:id',
      name: 'update-standard',
      component: CreateOrUpdateStandardView,
      meta: { mobileTitle: 'Обновление норматива' },
      beforeEnter: isAuthenticatedTeacher,
    },
    {
      path: '/app/profile',
      name: 'profile',
      component: ProfileView,
      meta: { mobileTitle: 'Профиль' },
      beforeEnter: isAuthenticated,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, top: 80, behavior: 'smooth' };
    }
    return { top: 0 };
  },
});

const publicPageSeo: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Дневник Тренера — сервис для спортивных секций',
    description:
      'Сервис для ведения базы учеников, спортивных нормативов и отслеживания прогресса тренировок.',
  },
  /* '/about-site': {
    title: 'О сервисе — Дневник Тренера',
    description:
      'Узнайте о возможностях сервиса «Дневник Тренера» для спортивных секций и учителей физкультуры.',
  }, */
  '/about-us': {
    title: 'О нас — Дневник Тренера',
    description: 'Команда сервиса «Дневник Тренера».',
  },
  '/instruction': {
    title: 'Инструкция по работе с сервисом — Дневник Тренера',
    description:
      'Пошаговая инструкция для тренеров и учеников: регистрация, классы, нормативы, результаты, отчёты и профиль.',
  },
  '/privacy-policy': {
    title: 'Политика конфиденциальности — Дневник Тренера',
    description: 'Политика обработки и защиты персональных данных в сервисе «Дневник Тренера».',
  },
};

router.afterEach((to) => {
  const seo = publicPageSeo[to.path];
  const title = seo?.title ?? 'Дневник Тренера';
  const description = seo?.description ?? 'Сервис для спортивных секций.';
  const canonicalUrl = `https://coachdiary.ru${to.path}`;
  const robots = seo ? 'index, follow' : 'noindex, nofollow';

  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[name="robots"]', robots);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', canonicalUrl);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  document
    .querySelector<HTMLLinkElement>('link[rel="canonical"]')
    ?.setAttribute('href', canonicalUrl);
});

function setMetaContent(selector: string, content: string): void {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

function isAuthenticated(): RouteLocationRaw | undefined {
  if (!useUserStore().isLoggedIn) {
    return {
      name: 'login',
    };
  }
}

function isAuthenticatedTeacher(): RouteLocationRaw | undefined {
  isAuthenticated();
  if (!useUserStore().isTeacher) {
    return {
      name: 'student',
      params: { id: useUserStore().studentId },
    };
  }
}

function isNotAuthenticated(): RouteLocationRaw | undefined {
  if (useUserStore().isLoggedIn) {
    return {
      name: 'my-diary',
    };
  }
}

export default router;
