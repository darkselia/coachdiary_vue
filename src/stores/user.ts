import { defineStore } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { logout as logoutApi } from '@/api/auth';
import { getProfile } from '@/api/profile';
import { getErrorText } from '@/api/http';
import type { UserRole } from '@/types/user';

export const useUserStore = defineStore('user', () => {
  const route = useRoute();
  const router = useRouter();
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');
  const userType = ref<UserRole>((localStorage.getItem('userType') as UserRole) ?? 'guest');
  const studentId = ref<number | null>(Number(localStorage.getItem('studentId')));

  const isStudent = computed(() => userType.value === 'student');
  const isTeacher = computed(() => userType.value === 'teacher');

  function clearLocalStorage() {
    isLoggedIn.value = false;
    userType.value = 'guest';
    studentId.value = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('studentId');
  }

  async function login() {
    await fetchProfile();
    isLoggedIn.value = true;
    localStorage.setItem('isLoggedIn', 'true');
  }

  async function logout() {
    try {
      await logoutApi();
      clearLocalStorage();
      await router.push({ name: 'login' });
    } catch (error) {
      toast.error(getErrorText(error, 'Не удалось выйти из аккаунта, попробуйте ещё раз'));
    }
  }

  async function fetchProfile() {
    try {
      const data = await getProfile();
      userType.value = data.role;
      localStorage.setItem('userType', data.role);
      if (data.role === 'student') {
        studentId.value = data.id;
        localStorage.setItem('studentId', String(data.id));
      }
      if (!data.is_email_verified) {
        toast.error('Пожалуйста, подтвердите почту, чтобы получить доступ ко всем функциям');
      }
    } catch {
      clearLocalStorage();
      if (route.fullPath.startsWith('/app')) {
        await router.push({ name: 'home' });
      }
    }
  }

  return {
    isLoggedIn,
    studentId,
    isStudent,
    isTeacher,

    login,
    logout,
    fetchProfile,
    clearLocalStorage,
  };
});
