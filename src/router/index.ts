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
import AboutSiteView from '@/views/public/AboutSiteView.vue';
import AboutUsView from '@/views/public/AboutUsView.vue';
import MyClassesView from '@/views/classes/MyClassesView.vue';
import PrivacyPolicyView from '@/views/public/PrivacyPolicyView.vue';
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
    {
      path: '/about-site',
      name: 'about-site',
      component: AboutSiteView,
      meta: { mobileTitle: 'Дневник тренера' },
    },
    {
      path: '/about-us',
      name: 'about-us',
      component: AboutUsView,
      meta: { mobileTitle: 'Дневник Тренера' },
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
    return { top: 0 };
  },
});

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
