<script setup lang="ts">
import { computed } from 'vue';
import type { ClassResponse } from '@/types/class';

const {
  classesData,
  directionColumn,
  menu,
  selectedLetter = '',
} = defineProps<{
  classesData: ClassResponse[];
  directionColumn?: boolean;
  menu?: boolean;
  selectedLetter?: string;
}>();

const emit = defineEmits<{
  select: [classNumber: number, letter: string];
}>();

const activeLevelNumber = defineModel<number>({
  default: -1,
  required: false,
});

const classes = computed(() =>
  classesData.reduce(
    (acc, v) => {
      if (!(v.number in acc)) {
        acc[v.number] = [] as string[];
      }

      acc[v.number].push(v.class_name);
      return acc;
    },
    {} as Record<number, string[]>,
  ),
);

function selectClass(classNumber: number, letter: string) {
  activeLevelNumber.value = classNumber;
  emit('select', classNumber, letter);
}
</script>

<template>
  <div :class="{ directionColumn }" class="buttons-panel">
    <v-btn
      v-for="n in 11"
      :key="n"
      :disabled="!(n in classes)"
      :variant="activeLevelNumber === n ? 'flat' : 'outlined'"
      class="level-button top-button"
      color="rgb(var(--v-theme-secondary))"
      @click="!menu ? selectClass(n, '') : ''"
    >
      {{ n }}{{ activeLevelNumber === n ? selectedLetter : '' }}
      <v-menu
        v-if="menu"
        activator="parent"
        :location="directionColumn ? 'right center' : 'bottom center'"
        :transition="directionColumn ? 'slide-x-transition' : 'slide-y-transition'"
        offset="5"
      >
        <div :class="directionColumn ? 'horizontal-menu' : ''" class="menu">
          <v-btn
            v-for="letter in classes[n]"
            :key="n + letter"
            variant="text"
            color="secondary"
            @click="selectClass(n, letter)"
          >
            {{ letter.toUpperCase() }}
          </v-btn>
          <v-btn variant="text" color="rgb(var(--v-theme-secondary))" @click="selectClass(n, '')">
            Параллель
          </v-btn>
        </div>
      </v-menu>
    </v-btn>
    <v-divider
      v-if="!directionColumn"
      class="divider"
      vertical
      color="rgb(var(--v-theme-secondary))"
      thickness="3"
      opacity="0.5"
    />
    <v-divider
      v-else
      class="divider"
      color="rgb(var(--v-theme-secondary))"
      thickness="3"
      opacity="0.5"
    />
    <v-btn
      :variant="activeLevelNumber === 12 ? 'flat' : 'outlined'"
      class="level-button top-button"
      color="rgb(var(--v-theme-secondary))"
      @click="selectClass(12, '')"
    >
      все
    </v-btn>
  </div>
</template>

<style scoped>
.buttons-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.menu {
  display: flex;
  flex-direction: column;
  padding-bottom: 2px;
  background-color: rgb(var(--v-theme-primary));
}

.horizontal-menu {
  flex-direction: row;
  flex-wrap: wrap;
  max-width: calc(100dvw - 110px);
  justify-content: center;
}

.directionColumn {
  flex-direction: column;
  height: 100%;
  width: fit-content;
}

.top-button {
  border-radius: var(--v-border-button-radius);
}

.level-button.v-btn--variant-flat {
  border: 1px solid rgb(var(--v-theme-secondary)) !important;
}

.divider {
  margin: 0 10px;
}

@media (max-height: 700px) {
  .buttons-panel {
    gap: 5px;
  }

  .divider {
    margin: 10px 5px;
  }
}

@media (max-width: 870px) {
  button.v-btn {
    height: 2em;
  }
}
</style>
