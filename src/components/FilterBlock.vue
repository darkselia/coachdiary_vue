<script lang="ts" setup>
import type { StudentFilters } from '@/types/student';
import type { NullableGender } from '@/types/common';

const filterData = defineModel<StudentFilters>({ required: true });

const { mobile } = defineProps<{
  mobile?: boolean;
}>();

const emit = defineEmits<{
  accept: [];
}>();

function selectGender(gender: NullableGender): void {
  if (filterData.value.gender === gender) {
    filterData.value.gender = null;
  } else {
    filterData.value.gender = gender;
  }
}

const currentYear = new Date().getFullYear();

function clearFilters(): void {
  filterData.value.gender = null;
  filterData.value.grades = [];
  filterData.value.birthYearFrom = null;
  filterData.value.birthYearUntil = null;
  emit('accept');
}
</script>

<template>
  <div class="filters-grid" :class="mobile ? 'filters-grid-mobile' : ''">
    <div class="filters">
      <div>
        <div class="title">Пол</div>
        <div class="filter-gender" :class="mobile ? 'flex-align-left' : ''">
          <v-btn
            :active="filterData.gender === 'f'"
            :ripple="false"
            class="button"
            size="small"
            :text="mobile ? 'девочки' : 'Ж'"
            variant="outlined"
            @click="selectGender('f')"
          />
          <v-btn
            :active="filterData.gender === 'm'"
            :ripple="false"
            class="button"
            size="small"
            :text="mobile ? 'мальчики' : 'М'"
            variant="outlined"
            @click="selectGender('m')"
          />
        </div>
      </div>

      <v-divider v-if="mobile" color="white" thickness="2" opacity="0.7" />

      <div>
        <div class="title">Оценка</div>
        <div :class="mobile ? 'checkbox-group-mobile' : 'checkbox-group'">
          <v-checkbox
            v-for="n in 4"
            :key="n"
            v-model="filterData.grades"
            :label="(n + 1).toString()"
            :value="n + 1"
            density="compact"
          />
          <v-checkbox v-model="filterData.grades" :value="null" density="compact" label="Нет" />
        </div>
      </div>

      <v-divider v-if="mobile" color="white" thickness="2" opacity="0.7" />

      <div>
        <div class="title" :class="mobile ? '' : 'title-year'">Год рождения</div>
        <div class="filter-year" :class="mobile ? 'filter-year-mobile' : ''">
          <v-text-field
            v-model.number="filterData.birthYearFrom"
            :max="currentYear - 2"
            density="compact"
            label="От"
            min="1900"
            type="number"
          />
          <v-text-field
            v-model.number="filterData.birthYearUntil"
            :max="currentYear - 2"
            density="compact"
            label="До"
            min="1900"
            type="number"
          />
        </div>
      </div>

      <v-divider v-if="mobile" color="white" thickness="2" opacity="0.7" />
    </div>

    <div class="action-buttons" :class="mobile ? 'action-buttons-mobile' : ''">
      <v-btn
        class="button action-button"
        color="error"
        size="small"
        text="Сбросить"
        variant="outlined"
        @click="clearFilters"
      />
      <v-btn
        class="button action-button"
        color="primary-darken-1"
        size="small"
        text="Принять"
        variant="outlined"
        @click="emit('accept')"
      />
    </div>
  </div>
</template>

<style scoped>
.filters-grid {
  height: calc(100dvh - 180px);
  display: grid;
  grid-template-rows: 1fr auto;
  text-align: center;
  border: 1px solid rgb(var(--v-theme-primary));
  border-radius: var(--v-border-radius);
  padding: 12px;
  overflow: hidden;
}

.filters-grid-mobile {
  height: auto;
  padding: 0 0 10px;
  text-align: left;
}

.filters-grid-mobile {
  color: white !important;
}

.filters-grid-mobile :deep(.v-btn) {
  color: white !important;
}

.filters-grid-mobile :deep(.v-btn.v-btn--active) {
  color: rgb(var(--v-theme-primary)) !important;
  border: 1px solid white !important;
}

.filters {
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  margin-right: -5px;
  overflow-y: auto;
  scrollbar-width: thin;
  gap: 20px;
}

.title {
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 16px;
}

.title-year {
  font-size: 14px;
  margin-bottom: 20px;
}

.filter-gender {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100px;
  align-content: space-around;
}

.v-checkbox:deep(.v-selection-control) {
  min-height: 32px !important;
}

.checkbox-group :deep(.v-label) {
  opacity: 1;
  color: black;
}

.checkbox-group-mobile {
  display: flex;
  flex-direction: row;
  height: auto;
  justify-content: flex-start;
  gap: 20px;
}

.button {
  border-radius: var(--v-border-radius);
  font-size: 16px;
  flex-grow: 0;
  height: auto !important;
  min-height: 24px;
  text-transform: uppercase;
}

.filter-year {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filter-year-mobile {
  flex-direction: row;
}

.button:deep(.v-btn__content) {
  white-space: normal !important;
}

.button.v-btn--active {
  background-color: rgb(var(--v-theme-surface));
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 15px;
}

.action-buttons-mobile {
  flex-direction: row;
  justify-content: space-between;
}

.flex-align-left {
  justify-content: flex-start;
  gap: 10px;
}
</style>
