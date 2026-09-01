<script lang="ts" setup>
import StandardsTable from '@/components/standards/StandardsTable.vue';
import DataTableSideNav from '@/components/shared/ui/DataTableSideNav.vue';
import TopPanel from '@/components/shared/layout/TopPanel.vue';
import BottomSheetWithButton from '@/components/shared/ui/BottomSheetWithButton.vue';

import { computed, nextTick, onMounted, ref } from 'vue';
import router from '@/router';
import { toast } from 'vue-sonner';
import { useDisplay } from 'vuetify';
import SideNavButtons from '@/components/shared/ui/SideNavButtons.vue';
import { getErrorText } from '@/api/http';
import { useStandardsStore } from '@/stores/standards';
import { useUIStore } from '@/stores/ui';
import type { StandardType } from '@/types/standard';

const { smAndUp, width } = useDisplay();
const standardsStore = useStandardsStore();
const uiStore = useUIStore();

const selectedLevelNumber = ref(-1);
const pageType = ref<StandardType>('physical');

const selectedStandardId = ref(-1);
const standards = computed(() => standardsStore.standards);

const levelButtonText = computed(() =>
  selectedLevelNumber.value != -1 ? selectedLevelNumber.value + ' год обучения' : 'Года обучения',
);
const standardButtonText = computed(
  () =>
    simplifiedStandards.value.find((v) => v.id === selectedStandardId.value)?.label ?? 'Норматив',
);

async function setFirst({
  standard = true,
  level = true,
  levelNumber,
}: {
  standard?: boolean;
  level?: boolean;
  levelNumber?: number;
} = {}): Promise<void> {
  if (level) selectedLevelNumber.value = levelNumber ?? levels.value[0] ?? -1;
  await nextTick();
  if (standard) selectedStandardId.value = simplifiedStandards.value[0]?.id ?? -1;
}

const levels = computed(() =>
  Array.from(
    standards.value
      .filter((standard) => standard.has_numeric_value === (pageType.value === 'physical'))
      .reduce((acc, v) => {
        for (const level of v.levels) {
          acc.add(level.level_number);
        }
        return acc;
      }, new Set<number>()),
  ),
);

const simplifiedStandards = computed(() =>
  standards.value
    .filter((standard) => standard.has_numeric_value === (pageType.value === 'physical'))
    .filter((standard) =>
      standard.levels.some((level) => level.level_number === selectedLevelNumber.value),
    )
    .toSorted((a, b) => a.name.localeCompare(b.name))

    .map((standard) => ({
      id: standard.id,
      label: standard.name,
    })),
);

const currentStandardLevels = computed(() =>
  standards.value
    .find((standard) => standard.id === selectedStandardId.value)
    ?.levels.toSorted((a, b) => a.gender.localeCompare(b.gender))
    .filter((level) => level.level_number === selectedLevelNumber.value),
);

function editStandard(): void {
  router.push({ name: 'update-standard', params: { id: selectedStandardId.value } });
}

async function deleteStandard(inAllLevels: boolean): Promise<void> {
  const dialogText = inAllLevels
    ? 'Вы уверены, что хотите удалить этот норматив для всех уровней?'
    : `Вы уверены, что хотите удалить этот норматив для текущего уровня: ${selectedLevelNumber.value}?`;

  await uiStore.showConfirmDialog({
    title: 'Удаление норматива',
    text: dialogText,
  });

  try {
    if (inAllLevels) {
      await standardsStore.deleteStandard(selectedStandardId.value);
    } else {
      await standardsStore.removeStandardLevel(selectedStandardId.value, selectedLevelNumber.value);
    }
    await setFirst();
    toast.success('Норматив был успешно удален');
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время отправки данных, попробуйте еще раз'),
    );
  }
}

onMounted(async () => {
  try {
    await standardsStore.fetchStandards();
  } catch (error) {
    toast.error(
      getErrorText(error, 'Произошла ошибка во время получения данных, попробуйте еще раз'),
    );
  }
  await setFirst();
});
</script>

<template>
  <TopPanel v-if="smAndUp" class="top-panel">
    <div class="buttons-panel">
      <v-btn
        v-for="n in 11"
        :key="n"
        :disabled="!levels.includes(n)"
        :text="n + ' год'"
        :variant="selectedLevelNumber === n ? 'flat' : 'outlined'"
        class="level-button button"
        color="rgb(var(--v-theme-secondary))"
        @click="setFirst({ levelNumber: n })"
      />
    </div>
    <template #right>
      <v-btn
        :to="{ name: 'create-standard' }"
        color="rgb(var(--v-theme-secondary))"
        icon="mdi-plus"
        variant="outlined"
      />
    </template>
  </TopPanel>

  <div v-if="!smAndUp" class="top-panel-mobile">
    <BottomSheetWithButton :button-text="levelButtonText" sheet-title="Года обучения">
      <template #default="{ toggle }">
        <div class="level-button-mobile">
          <v-btn
            v-for="n in 11"
            :key="n"
            :disabled="!levels.includes(n)"
            :text="n + ' год'"
            :variant="selectedLevelNumber === n ? 'flat' : 'outlined'"
            class="level-button button"
            color="rgb(var(--v-theme-secondary))"
            @click="
              setFirst({ levelNumber: n });
              toggle();
            "
          />
        </div>
      </template>
    </BottomSheetWithButton>

    <BottomSheetWithButton
      :button-text="standardButtonText"
      sheet-title="Нормативы"
      wrap-button
      :width="width - 200 + 'px'"
    >
      <template #default="{ toggle }">
        <SideNavButtons
          v-model="pageType"
          :types="{ first: 'physical', second: 'technical' }"
          :labels="{ first: 'Физические', second: 'Технические' }"
          @typeChanged="setFirst({ level: false })"
        />
        <DataTableSideNav
          v-model:selected-id="selectedStandardId"
          :data="simplifiedStandards"
          :is-standard-type-technical="pageType === 'technical'"
          :has-action-buttons="false"
          @update:selected-id="toggle"
        />
      </template>
    </BottomSheetWithButton>
  </div>

  <div v-auto-animate :class="{ 'technical-grid': pageType === 'technical' }" class="grid">
    <div v-if="pageType === 'physical'" class="standards-tables">
      <template v-if="currentStandardLevels">
        <div class="standards-tables-title">
          {{
            currentStandardLevels[0].is_lower_better
              ? 'Низкие значения лучше'
              : 'Высокие значения лучше'
          }}
        </div>
        <StandardsTable
          v-for="level in currentStandardLevels"
          :key="level.id"
          :gender="level.gender"
          :high="level.high_value"
          :low="level.low_value"
          :middle="level.middle_value"
        />
      </template>
    </div>

    <div v-if="!smAndUp" class="action-buttons-mobile">
      <v-btn
        class="button"
        color="primary-darken-1"
        text="Изменить"
        variant="outlined"
        @click="editStandard"
      />
      <v-btn class="button" color="error" variant="outlined">
        Удалить
        <v-menu activator="parent">
          <v-list density="compact">
            <v-list-item @click="deleteStandard(false)">
              <v-list-item-title>данные {{ selectedLevelNumber }} года</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteStandard(true)">
              <v-list-item-title>данные всех годов</v-list-item-title>
            </v-list-item>
            <v-list-item @click="() => {}">
              <v-list-item-title>Отмена</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>

    <div v-if="smAndUp">
      <SideNavButtons
        v-model="pageType"
        :types="{ first: 'physical', second: 'technical' }"
        :labels="{ first: 'Физические', second: 'Технические' }"
        @typeChanged="setFirst({ level: false })"
      />
      <DataTableSideNav
        v-model:selected-id="selectedStandardId"
        :data="simplifiedStandards"
        :is-standard-type-technical="pageType === 'technical'"
        :title="pageType === 'physical' ? 'Физические' : 'Технические'"
        class="data-table-side-nav"
        has-delete-menu
        @delete="deleteStandard"
        @edit="editStandard"
      />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 230px;
  gap: 10px;
  max-width: 1200px;
  margin: 40px auto 0;

  @media (max-width: 1230px) {
    padding: 0 10px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    margin: 25px 0;
  }
}

.technical-grid {
  grid-template-columns: 1fr;
}

.standards-tables-title {
  font-size: 20px;
  font-weight: 500;
  margin-left: 12px;
  margin-bottom: -10px;
  align-self: center;
}

.standards-tables {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.buttons-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.button {
  border-radius: var(--v-border-button-radius);
}

/*стиль для небольшой границы у кнопок, теперь кнопки не скачут*/
.level-button.v-btn--variant-flat {
  border: 1px solid rgb(var(--v-theme-secondary)) !important;
}

.data-table-side-nav {
  height: calc(100vh - 220px);

  @media (width <= 1030px) {
    height: calc(100vh - 250px);
  }
}

.top-panel-mobile {
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
}

.action-buttons-mobile {
  display: flex;
  gap: 20px;
  padding: 0 10px;
  margin-top: 30px;
}

.level-button-mobile {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
</style>
