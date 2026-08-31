<script lang="ts" setup>
import TopPanel from '@/components/TopPanel.vue';
import FieldSet from '@/components/FieldSet.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type {
  StandardEvaluationType,
  StandardFormLevel,
  StandardFormPageType,
  StandardType,
  StandardRequest,
} from '@/types/standard';
import { useDisplay } from 'vuetify';
import { toast } from 'vue-sonner';
import { getErrorText } from '@/api/http';
import { useStandardsStore } from '@/stores/standards';

const route = useRoute();
const { mobile } = useDisplay();
const standardsStore = useStandardsStore();
const pageType = ref<StandardFormPageType>(route.name as StandardFormPageType);
const isLoading = ref(false);

const standardName = ref('');
const standardType = ref<StandardType | null>(null);
const evaluationType = ref<StandardEvaluationType | null>(null);

const currentLevel = ref(-1);
const levelNumbers = ref<number[]>([]);
const levels = ref<Record<number, StandardFormLevel>>({});
setLevelsWithZeroes();

const isNextLevelButtonDisabled = computed(() => {
  return !levelNumbers.value.some((value) => value > currentLevel.value);
});

const isPreviousLevelButtonDisabled = computed(() => {
  return !levelNumbers.value.some((value) => value < currentLevel.value);
});

const isSaveButtonDisabled = computed(() => {
  return (
    isLoading.value ||
    !standardName.value ||
    !standardType.value ||
    levelNumbers.value.length === 0 ||
    (Object.entries(levels.value).some(
      ([key, value]) =>
        levelNumbers.value.includes(+key) &&
        (!value.girls.high ||
          !value.girls.middle ||
          !value.girls.low ||
          !value.boys.low ||
          !value.boys.middle ||
          !value.boys.high),
    ) &&
      standardType.value !== 'technical')
  );
});

function setLevelsWithZeroes() {
  for (let i = 1; i <= 11; i++) {
    levels.value[i] = {
      girls: {
        high: null,
        middle: null,
        low: null,
      },
      boys: {
        high: null,
        middle: null,
        low: null,
      },
    };
  }
}

function toNextLevel() {
  for (let i = currentLevel.value + 1; i <= 11; i++) {
    if (levelNumbers.value.includes(i)) {
      currentLevel.value = i;
      return;
    }
  }
}

function toPreviousLevel() {
  for (let i = currentLevel.value - 1; i >= 1; i--) {
    if (levelNumbers.value.includes(i)) {
      currentLevel.value = i;
      return;
    }
  }
}

async function createOrUpdateStandard() {
  try {
    isLoading.value = true;
    const requestData: StandardRequest = {
      name: standardName.value,
      has_numeric_value: standardType.value === 'physical',
      levels: Object.entries(levels.value)
        .filter(([key]) => levelNumbers.value.includes(+key))
        .map(([key, value]) => [
          {
            is_lower_better: evaluationType.value === 'lower-is-better',
            level_number: +key,
            low_value: value.girls.low,
            middle_value: value.girls.middle,
            high_value: value.girls.high,
            gender: 'f' as const,
          },
          {
            is_lower_better: evaluationType.value === 'lower-is-better',
            level_number: +key,
            low_value: value.boys.low,
            middle_value: value.boys.middle,
            high_value: value.boys.high,
            gender: 'm' as const,
          },
        ])
        .flat(),
    };

    if (pageType.value === 'create-standard') {
      await standardsStore.createStandard(requestData);
      toast.success('Норматив успешно создан');
      standardName.value = '';
      standardType.value = null;
      levelNumbers.value = [];
      evaluationType.value = null;
      setLevelsWithZeroes();
    } else {
      await standardsStore.updateStandard(+route.params.id, requestData);
      toast.success('Данные о нормативе успешно обновлены');
    }
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  } finally {
    isLoading.value = false;
  }
}

watch(levelNumbers, () => {
  if (levelNumbers.value.length === 0) currentLevel.value = -1;
  else if (currentLevel.value === -1) currentLevel.value = Math.min(...levelNumbers.value);
  else if (!levelNumbers.value.includes(currentLevel.value))
    currentLevel.value = Math.min(...levelNumbers.value);
});

onMounted(async () => {
  if (pageType.value === 'update-standard') {
    try {
      const data = await standardsStore.fetchStandard(+route.params.id);
      standardName.value = data.name;
      standardType.value = data.has_numeric_value ? 'physical' : 'technical';
      evaluationType.value = data.levels[0].is_lower_better
        ? 'lower-is-better'
        : 'higher-is-better';

      for (const level of data.levels) {
        const key = level.gender === 'f' ? 'girls' : 'boys';
        levels.value[level.level_number][key] = {
          high: level.high_value,
          middle: level.middle_value,
          low: level.low_value,
        };
        if (!levelNumbers.value.includes(level.level_number)) {
          levelNumbers.value.push(level.level_number);
        }
      }

      currentLevel.value = Math.min(...levelNumbers.value) ?? -1;
    } catch (error) {
      toast.error(
        getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
      );
    }
  }
});
</script>

<template>
  <TopPanel :is-loading class="top-panel">
    {{ pageType === 'create-standard' ? 'Создание норматива' : 'Обновление норматива' }}
  </TopPanel>
  <div v-auto-animate class="grid">
    <FieldSet title="Тип">
      <v-radio-group
        v-model="standardType"
        :disabled="pageType === 'update-standard' || isLoading"
        row
        @update:model-value="setLevelsWithZeroes"
      >
        <v-radio label="Физический" value="physical" />
        <v-radio label="Технический" value="technical" />
      </v-radio-group>
    </FieldSet>

    <v-text-field
      v-model="standardName"
      :class="
        standardType === 'technical' || standardType === null ? 'standard-name-technical' : ''
      "
      :disabled="isLoading"
      class="standard-name"
      label="Название"
    />

    <FieldSet
      v-if="standardType === 'physical'"
      title="Параметр оценивания"
      class="evaluation-type"
    >
      <v-radio-group
        v-model="evaluationType"
        :disabled="pageType === 'update-standard' || isLoading"
        row
      >
        <v-radio label="Больше-лучше" value="higher-is-better" />
        <v-radio label="Меньше-лучше" value="lower-is-better" />
      </v-radio-group>
    </FieldSet>

    <FieldSet title="Года обучения">
      <p class="levels-text">
        Выберите один
        <br />
        или несколько
      </p>

      <div class="checkbox-group">
        <v-checkbox
          v-for="n in 11"
          v-model="levelNumbers"
          :label="n.toString()"
          :value="n"
          :key="n"
          :disabled="isLoading"
          density="compact"
        />
      </div>
    </FieldSet>

    <div class="field-set-standards-table">
      <FieldSet v-if="standardType === 'physical'" title="Нормы">
        <template v-if="levelNumbers.length && currentLevel !== -1">
          <div class="standards-table">
            <div class="standards">
              <div class="standards-table-title">Девочки</div>
              <v-text-field
                v-model.number="levels[currentLevel].girls.high"
                :disabled="isLoading"
                density="comfortable"
                label="Высокая ступень"
                min="0"
                type="number"
              />
              <v-text-field
                v-model.number="levels[currentLevel].girls.middle"
                :disabled="isLoading"
                class="standard-input"
                density="comfortable"
                label="Средняя ступень"
                min="0"
                type="number"
              />
              <v-text-field
                v-model.number="levels[currentLevel].girls.low"
                :disabled="isLoading"
                class="standard-input"
                density="comfortable"
                label="Низкая ступень"
                min="0"
                type="number"
              />
            </div>
            <div class="standards">
              <div class="standards-table-title">Мальчики</div>
              <v-text-field
                v-model.number="levels[currentLevel].boys.high"
                :disabled="isLoading"
                density="comfortable"
                label="Высокая ступень"
                min="0"
                type="number"
              />
              <v-text-field
                v-model.number="levels[currentLevel].boys.middle"
                :disabled="isLoading"
                class="standard-input"
                density="comfortable"
                label="Средняя ступень"
                min="0"
                type="number"
              />
              <v-text-field
                v-model.number="levels[currentLevel].boys.low"
                :disabled="isLoading"
                class="standard-input"
                density="comfortable"
                label="Низкая ступень"
                min="0"
                type="number"
              />
            </div>
          </div>

          <div class="pagination">
            <v-btn
              :disabled="isPreviousLevelButtonDisabled || isLoading"
              :text="mobile ? '' : 'Предыдущий уровень'"
              prepend-icon="mdi-arrow-left"
              variant="text"
              @click="toPreviousLevel"
            />
            <div>{{ currentLevel }} ур</div>
            <v-btn
              :disabled="isNextLevelButtonDisabled || isLoading"
              :text="mobile ? '' : 'Следующий уровень'"
              append-icon="mdi-arrow-right"
              variant="text"
              @click="toNextLevel"
            />
          </div>
        </template>
      </FieldSet>
    </div>

    <v-btn
      :disabled="isSaveButtonDisabled"
      class="button"
      color="primary"
      rounded
      text="Сохранить"
      @click="createOrUpdateStandard"
    />
  </div>
</template>

<style scoped>
.grid {
  max-width: 1000px;
  margin: 16px auto;
  padding: 18px 30px;
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 20px 50px;
  align-items: stretch;
  background: rgb(var(--v-theme-surface));
}

.levels-text {
  text-align: center;
  line-height: 120%;
  font-weight: bold;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 250px;
  align-content: center;
  gap: 0 32px;
  margin-top: 10px;
}

.grid :deep(.v-label) {
  opacity: 1;
  color: black;
}

.grid :deep(.v-text-field .v-label) {
  opacity: var(--v-medium-emphasis-opacity);
}

.standard-name {
  align-self: center;
}

.standard-name-technical,
.field-set-standards-table {
  grid-column: span 2;
}

.standards-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.standards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 15px 5px;
}

.standards-table-title {
  margin-left: 10px;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  grid-column: span 3;
  justify-self: end;
}

@media (max-width: 1000px) {
  .grid {
    background: transparent;
  }
}

@media (max-width: 800px) {
  .top-panel {
    display: none;
  }

  .grid {
    grid-template-columns: 1fr;
    overflow: scroll;
    padding: 15px;
    gap: 20px;
  }

  .button,
  .field-set-standards-table,
  .standard-name-technical {
    grid-column: 1;
  }

  .standards-table {
    gap: 0;
  }

  .checkbox-group {
    flex-direction: row;
    height: auto;
  }

  .levels-text br {
    display: none;
  }

  .standard-name {
    order: -1;
  }
}
</style>
