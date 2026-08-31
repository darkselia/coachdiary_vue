<script lang="ts" setup>
const { multipleSelect = false, hasActionButtons = true } = defineProps<{
  title?: string;
  data: {
    label: string;
    id: number;
  }[];
  isStandardTypeTechnical?: boolean;
  multipleSelect?: boolean;
  isContentStaticText?: boolean;
  hasActionButtons?: boolean;
  hasDeleteMenu?: boolean;
}>();

defineEmits<{
  edit: [];
  delete: [inAllLevels: boolean];
}>();

const selectedId = defineModel<number>('selectedId', {
  default: -1,
  required: false,
});
const selectedIds = defineModel<number[]>('selectedIds', {
  default: [],
  required: false,
});

function isActive(itemId: number): boolean {
  if (multipleSelect) {
    return Array.isArray(selectedIds.value) && selectedIds.value.includes(itemId);
  } else {
    return selectedId.value === itemId;
  }
}

function handleItemClick(itemId: number): void {
  if (multipleSelect && Array.isArray(selectedIds.value)) {
    if (selectedIds.value.includes(itemId)) {
      selectedIds.value = selectedIds.value.filter((id) => id !== itemId);
    } else {
      selectedIds.value = [...selectedIds.value, itemId];
    }
  } else {
    selectedId.value = itemId;
  }
}
</script>

<template>
  <div class="container">
    <div v-if="title" class="title">{{ title }}</div>
    <div :class="{ grid: isStandardTypeTechnical }" class="data">
      <template v-if="!isContentStaticText">
        <v-btn
          v-for="item in data"
          :key="item.id"
          :active="isActive(item.id)"
          :ripple="false"
          :text="item.label"
          block
          class="button"
          size="small"
          variant="outlined"
          @click="handleItemClick(item.id)"
        />
      </template>
      <template v-else>
        <div v-for="item in data" :key="item.id" class="static-text">{{ item.label }}</div>
      </template>
    </div>
    <div v-if="hasActionButtons && !multipleSelect" class="action-buttons">
      <v-btn
        class="button action-button"
        color="primary-darken-1"
        size="small"
        text="Изменить"
        variant="outlined"
        @click="$emit('edit')"
      />
      <v-btn
        v-if="hasDeleteMenu"
        class="button action-button"
        color="error"
        size="small"
        variant="outlined"
      >
        Удалить
        <v-menu activator="parent">
          <v-list density="compact">
            <v-list-item @click="$emit('delete', false)">
              <v-list-item-title>у уровня</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('delete', true)">
              <v-list-item-title>у всех уровней</v-list-item-title>
            </v-list-item>
            <v-list-item @click="() => {}">
              <v-list-item-title>Отмена</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-btn
        v-else
        class="button action-button"
        color="error"
        size="small"
        variant="outlined"
        text="Удалить"
        @click="$emit('delete', false)"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  text-align: center;
  border: 1px solid rgb(var(--v-theme-primary));
  border-radius: var(--v-border-radius);
  padding: 12px;
  overflow: hidden;
}

.title {
  text-transform: uppercase;
  font-weight: bold;
  margin: 5px 18px 15px;
  padding: 0 0 3px;
  border-bottom: 1px solid rgb(var(--v-theme-surface-bright));
}

.data {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-right: 5px;
  margin-right: -5px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, calc(33.33% - 20px)));
  grid-auto-rows: min-content;
  align-items: start;
  justify-content: center;
  gap: 20px;
}

.button {
  border-radius: var(--v-border-radius);
  font-size: 16px;
  flex-grow: 0;
  height: auto !important;
  min-height: 24px;
}

.button:deep(.v-btn__content) {
  white-space: normal !important;
}

.button.v-btn--active {
  background-color: rgb(var(--v-theme-surface));
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding-top: 15px;
}

.action-button {
  text-transform: uppercase !important;
  border-width: 2px;
  font-size: 12px;
}

.static-text {
  font-size: 16px;
  border: 1px solid rgb(var(--v-theme-primary));
  border-radius: var(--v-border-radius);
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
  background-color: rgb(var(--v-theme-surface));
  padding: 1px 16px;
  letter-spacing: 1px;
  line-height: 1.2;
}

@media (max-width: 600px) {
  .action-buttons {
    flex-direction: row;
    justify-content: space-between;
  }

  .button {
    color: white !important;
  }

  .button.v-btn--active {
    color: rgb(var(--v-theme-primary)) !important;
    border: 1px solid white !important;
  }
}
</style>
