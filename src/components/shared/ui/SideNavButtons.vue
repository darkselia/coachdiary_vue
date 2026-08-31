<script setup lang="ts">
const pageType = defineModel<string>({ required: true });

defineProps<{
  types: { first: string; second: string };
  labels: { first: string; second: string };
}>();

defineEmits<{
  typeChanged: [];
}>();
</script>

<template>
  <div class="side-nav-buttons">
    <v-btn
      :active="pageType === types.first"
      class="side-nav-button"
      size="small"
      :text="labels.first"
      variant="outlined"
      @click="
        pageType = types.first;
        $emit('typeChanged');
      "
    />
    <v-btn
      :active="pageType === types.second"
      class="side-nav-button"
      size="small"
      :text="labels.second"
      variant="outlined"
      @click="
        pageType = types.second;
        $emit('typeChanged');
      "
    />
  </div>
</template>

<style scoped>
.side-nav-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 10px;
}

.side-nav-button {
  border-radius: var(--v-border-button-radius);
}

.side-nav-button.v-btn--variant-outlined {
  border-width: 2px !important;
}

.side-nav-button.v-btn--active {
  background-color: rgb(var(--v-theme-surface));
}

@media (width <= 600px) {
  .side-nav-button {
    color: white !important;
  }

  .side-nav-button.v-btn--active {
    background-color: rgb(var(--v-theme-primary));
  }
}
</style>
