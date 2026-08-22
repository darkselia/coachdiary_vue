import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';
import router from '@/router';
import { useUserStore } from '@/stores/user';
import {
  changeProfileDetails,
  changeProfileEmail,
  changeProfilePassword,
  exportProfileData,
  exportProfileReport,
  getProfile,
  importProfileData,
  resendProfileVerificationEmail,
} from '@/api/profile';
import type { ProfileExportType, ProfileResponse } from '@/types/profile';

export const useProfileStore = defineStore('profile', () => {
  const isLoading = ref(false);
  const isImporting = ref(false);
  const profile = ref<ProfileResponse | null>(null);

  const userId = ref(-1);
  const currentFirstName = ref('');
  const currentLastName = ref('');
  const currentPatronymic = ref('');
  const currentEmail = ref('');
  const isEmailVerified = ref(true);

  const firstName = ref('');
  const lastName = ref('');
  const patronymic = ref('');
  const email = ref('');
  const password = ref('');
  const newPassword = ref('');
  const passwordConfirmation = ref('');

  const exportIncludesNorms = ref(false);
  const exportIncludesResults = ref(false);
  const exportIncludesStandards = ref(false);

  const canUpdateName = computed(() => {
    return (
      !isLoading.value &&
      firstName.value.trim().length > 0 &&
      lastName.value.trim().length > 0 &&
      (firstName.value.trim() !== currentFirstName.value ||
        lastName.value.trim() !== currentLastName.value ||
        patronymic.value.trim() !== currentPatronymic.value)
    );
  });

  const canUpdateEmail = computed(() => {
    return (
      !isLoading.value &&
      email.value.trim().length > 0 &&
      email.value.trim() !== currentEmail.value
    );
  });

  const canUpdatePassword = computed(() => {
    return (
      !isLoading.value &&
      password.value.trim().length > 0 &&
      newPassword.value.trim().length > 0 &&
      newPassword.value.trim() === passwordConfirmation.value.trim()
    );
  });

  const canExportReport = computed(() => {
    return (
      !isLoading.value &&
      (exportIncludesNorms.value || exportIncludesResults.value || exportIncludesStandards.value)
    );
  });

  const isTestTeacherAccount = computed(() => {
    const userStore = useUserStore();
    const testEmailPattern = /^user[0-2]@example\.com$/;
    return (
      testEmailPattern.test(currentEmail.value) &&
      userStore.isTeacher &&
      import.meta.env.VITE_DEBUG !== 'TRUE'
    );
  });

  async function loadProfile() {
    try {
      isLoading.value = true;
      await fetchAndSetProfile();
    } catch (error) {
      toast.error(
        getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function patchName() {
    if (!canUpdateName.value) {
      return;
    }

    try {
      isLoading.value = true;
      await changeProfileDetails({
        first_name: firstName.value,
        last_name: lastName.value,
        patronymic: patronymic.value ?? '',
      });
      await fetchAndSetProfile();
      toast.success('Имя успешно изменено');
    } catch (error) {
      toast.error(
        getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function patchEmail() {
    if (!canUpdateEmail.value) {
      return;
    }

    if (isTestTeacherAccount.value) {
      toast.error(
        'Это тестовый аккаунт, для проверки работоспособности приложения, на нем нельзя менять почту',
      );
      return;
    }

    try {
      isLoading.value = true;
      await changeProfileEmail({ email: email.value });
      await fetchAndSetProfile();
      toast.success('Почта успешно изменена');
    } catch (error) {
      toast.error(
        getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function putPassword() {
    if (!canUpdatePassword.value) {
      return;
    }

    if (isTestTeacherAccount.value) {
      toast.error(
        'Это тестовый аккаунт, для проверки работоспособности приложения, на нем нельзя менять пароль',
      );
      return;
    }

    try {
      isLoading.value = true;
      await changeProfilePassword({
        new_password: newPassword.value,
        confirm_new_password: passwordConfirmation.value,
        current_password: password.value,
      });
      password.value = '';
      newPassword.value = '';
      passwordConfirmation.value = '';
      toast.success('Пароль успешно изменен');
      useUserStore().clearLocalStorage();
      await router.push({ name: 'login' });
    } catch (error) {
      toast.error(
        getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function exportData(type: ProfileExportType) {
    if (type === 'xlsx' && !canExportReport.value) {
      return;
    }

    try {
      isLoading.value = true;

      if (type === 'json') {
        const data = await exportProfileData();
        downloadBlob(
          new Blob([JSON.stringify(data)], { type: 'application/json' }),
          'coachdiary-data.json',
        );
        return;
      }

      const blob = await exportProfileReport({
        include_norms: exportIncludesNorms.value,
        include_results: exportIncludesResults.value,
        include_standards: exportIncludesStandards.value,
      });
      downloadBlob(blob, getReportFilename());
    } catch (error) {
      toast.error(
        getErrorText(error, 'Произошла ошибка во время экспорта данных, попробуйте еще раз'),
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function importDataJSON() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) {
        return;
      }

      try {
        isImporting.value = true;
        const data = await importProfileData(file);
        toast.success(data.message);
      } catch (error) {
        toast.error(
          getErrorText(error, 'Произошла ошибка во время импорта данных, попробуйте еще раз'),
        );
      } finally {
        isImporting.value = false;
      }
    };
    fileInput.click();
  }

  async function resendVerificationEmail() {
    try {
      await resendProfileVerificationEmail();
      toast.success('Письмо для подтверждения отправлено на вашу почту');
    } catch (error) {
      toast.error(getErrorText(error, 'Не удалось отправить письмо, попробуйте позже'));
    }
  }

  async function fetchAndSetProfile() {
    setProfile(await getProfile());
  }

  function setProfile(data: ProfileResponse) {
    profile.value = data;
    userId.value = data.id;
    currentFirstName.value = data.first_name;
    currentLastName.value = data.last_name;
    currentPatronymic.value = data.patronymic;
    currentEmail.value = data.email;
    firstName.value = currentFirstName.value;
    lastName.value = currentLastName.value;
    patronymic.value = currentPatronymic.value;
    email.value = currentEmail.value;
    isEmailVerified.value = data.is_email_verified;
  }

  function getReportFilename() {
    let filename = 'coachdiary-data';
    if (exportIncludesNorms.value) filename += '-все-нормативы';
    if (exportIncludesResults.value) filename += '-результаты';
    if (exportIncludesStandards.value) filename += '-листы-нормативов';
    return `${filename}.xlsx`;
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getErrorText(error: unknown, fallback: string) {
    return error instanceof Error && error.message ? error.message : fallback;
  }

  return {
    isLoading,
    isImporting,
    profile,
    userId,
    currentFirstName,
    currentLastName,
    currentPatronymic,
    currentEmail,
    isEmailVerified,
    firstName,
    lastName,
    patronymic,
    email,
    password,
    newPassword,
    passwordConfirmation,
    exportIncludesNorms,
    exportIncludesResults,
    exportIncludesStandards,
    canUpdateName,
    canUpdateEmail,
    canUpdatePassword,
    canExportReport,

    loadProfile,
    patchName,
    patchEmail,
    putPassword,
    exportData,
    importDataJSON,
    resendVerificationEmail,
  };
});
