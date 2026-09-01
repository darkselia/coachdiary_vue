import { defineStore } from 'pinia';
import { ref } from 'vue';
import { deleteClassById, getClasses, promoteClasses as promoteClassesApi } from '@/api/classes';
import type { ClassResponse } from '@/types/class';

export const useClassesStore = defineStore('classes', () => {
  const classes = ref<ClassResponse[]>([]);
  const isLoaded = ref(false);

  async function fetchClasses(force = false): Promise<void> {
    if (isLoaded.value && !force) {
      return;
    }

    classes.value = await getClasses();
    isLoaded.value = true;
  }

  function invalidateClasses(): void {
    isLoaded.value = false;
  }

  function getClassIdByNumberAndName(number: number, className: string): number | undefined {
    return classes.value.find((item) => item.number === number && item.class_name === className)
      ?.id;
  }

  async function deleteClass(classId: number): Promise<void> {
    await deleteClassById(classId);
    classes.value = classes.value.filter((item) => item.id !== classId);
  }

  async function promoteClasses(): Promise<void> {
    await promoteClassesApi();
    invalidateClasses();
  }

  return {
    classes,
    isLoaded,
    fetchClasses,
    invalidateClasses,
    getClassIdByNumberAndName,
    deleteClass,
    promoteClasses,
  };
});
