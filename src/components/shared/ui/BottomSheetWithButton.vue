<script setup lang="ts">
import BottomSheet from '@/components/shared/ui/BottomSheet.vue';
import { ref } from 'vue';

defineProps<{
  buttonText: string;
  sheetTitle: string;
  wrapButton?: boolean;
  icon?: string;
  buttonColor?: string;
  eager?: boolean;
  width?: string;
}>();

const isSheetActive = ref(false);

function toggle() {
  isSheetActive.value = !isSheetActive.value;
}
</script>

<template>
  <v-btn
    v-if="icon"
    class="button"
    variant="outlined"
    :icon="icon"
    :color="buttonColor"
    @click="toggle"
  />
  <v-btn
    v-else
    :text="buttonText"
    :color="buttonColor"
    :class="{ wrapButton }"
    :width
    class="button"
    variant="outlined"
    @click="toggle"
  />

  <BottomSheet v-model="isSheetActive" :sheet-title="sheetTitle" :eager>
    <slot :toggle="toggle" />
  </BottomSheet>
</template>

<style scoped>
.button {
  border-radius: var(--v-border-button-radius);
  height: 36px !important;
}

.button:deep(.v-btn__content) {
  white-space: normal !important;
}

.wrapButton {
  min-height: 36px;
  height: auto !important;
  min-width: 0;
}
</style>
