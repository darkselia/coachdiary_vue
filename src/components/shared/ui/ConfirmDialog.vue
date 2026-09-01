<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();
const lastDialog = computed(() => uiStore.confirmDialogs.at(-1));
</script>

<template>
  <v-dialog :model-value="!!lastDialog" max-width="340" persistent>
    <v-card :title="lastDialog?.title" :text="lastDialog?.text">
      <template #actions>
        <v-spacer />

        <v-btn color="success" @click="lastDialog?.cancelAction">
          {{ lastDialog?.cancelText }}
        </v-btn>

        <v-btn color="error" @click="lastDialog?.confirmAction">
          {{ lastDialog?.confirmText }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
