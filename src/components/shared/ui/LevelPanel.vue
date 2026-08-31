<script lang="ts" setup>
defineProps<{
  classNumber: number;
  mobile?: boolean;
  color?: string;
}>();

defineEmits<{
  levelChanged: [];
}>();

const activeLevel = defineModel<number>({ default: -1, required: false });
</script>

<template>
  <div class="inner-container">
    <div class="buttons-panel">
      <div v-if="!mobile" class="header">года обучения:</div>
      <v-btn
        v-for="n in classNumber"
        :key="n"
        :text="n + ' год'"
        :variant="activeLevel === n ? 'flat' : 'outlined'"
        :color="color"
        class="button"
        @click="
          activeLevel = n;
          $emit('levelChanged');
        "
      />
    </div>
  </div>
</template>

<style scoped>
.inner-container {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 500;
}

.header {
  font-weight: 700;
  font-size: 14px;
}

.buttons-panel {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
}

.button {
  border-radius: var(--v-border-button-radius);
  font-size: 12px;
  padding: 0 5px;
  height: 20px !important;
}
</style>
