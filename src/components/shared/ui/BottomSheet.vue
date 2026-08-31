<script setup lang="ts">
const isActive = defineModel<boolean>({ required: true });

defineProps<{
  sheetTitle: string;
  eager?: boolean;
}>();
</script>

<template>
  <v-bottom-sheet v-model="isActive" inset :eager>
    <div class="container">
      <div class="top-panel">
        <v-btn color="white" icon="mdi-chevron-left" variant="text" @click="isActive = !isActive" />
        <div>{{ sheetTitle }}</div>
      </div>
      <v-divider color="white" thickness="2" opacity="0.7" />

      <div class="content">
        <slot />
      </div>
    </div>
  </v-bottom-sheet>
</template>

<style scoped>
.container {
  border-radius: 15px 15px 0 0;
  background-color: rgb(var(--v-theme-primary));
}

.top-panel {
  display: flex;
  color: white;
  align-items: center;
  text-transform: uppercase;
}

.content {
  padding: 20px;
  color: white;
}
</style>
