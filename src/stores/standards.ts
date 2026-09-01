import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  createStandard as createStandardApi,
  deleteStandardById,
  getStandard as getStandardApi,
  getStandards,
  removeStandardLevel as removeStandardLevelApi,
  updateStandard as updateStandardApi,
} from '@/api/standards';
import type { StandardRequest, StandardResponse } from '@/types/standard';

export const useStandardsStore = defineStore('standards', () => {
  const standards = ref<StandardResponse[]>([]);
  const isLoaded = ref(false);

  async function fetchStandards(force = false) {
    if (isLoaded.value && !force) {
      return;
    }
    standards.value = await getStandards();
    isLoaded.value = true;
  }

  async function fetchStandard(standardId: number): Promise<StandardResponse> {
    const cachedStandard = isLoaded.value
      ? standards.value.find((standard) => standard.id === standardId)
      : undefined;
    return cachedStandard ?? getStandardApi(standardId);
  }

  function invalidateStandards(): void {
    isLoaded.value = false;
  }

  async function createStandard(data: StandardRequest): Promise<void> {
    await createStandardApi(data);
    invalidateStandards();
  }

  async function updateStandard(standardId: number, data: StandardRequest): Promise<void> {
    await updateStandardApi(standardId, data);
    invalidateStandards();
  }

  async function deleteStandard(standardId: number): Promise<void> {
    await deleteStandardById(standardId);
    standards.value = standards.value.filter((standard) => standard.id !== standardId);
  }

  async function removeStandardLevel(standardId: number, levelNumber: number): Promise<void> {
    await removeStandardLevelApi(standardId, levelNumber);
    standards.value = standards.value.map((standard) => {
      if (standard.id !== standardId) {
        return standard;
      }

      return {
        ...standard,
        levels: standard.levels.filter((level) => level.level_number !== levelNumber),
      };
    });
  }

  return {
    standards,
    isLoaded,
    fetchStandards,
    fetchStandard,
    invalidateStandards,
    createStandard,
    updateStandard,
    deleteStandard,
    removeStandardLevel,
  };
});
