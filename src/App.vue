<script lang="ts" setup>
import { RouterView, useRoute } from 'vue-router';
import AppBar from '@/components/shared/layout/AppBar.vue';
import { useUserStore } from '@/stores/user';
import BottomAppBar from '@/components/shared/layout/BottomAppBar.vue';
import { useDisplay } from 'vuetify';
import { computed } from 'vue';
import { Toaster } from 'vue-sonner';
import ConfirmDialog from '@/components/shared/ui/ConfirmDialog.vue';

useUserStore().fetchProfile();

const { smAndUp } = useDisplay();
const route = useRoute();
const isLoggedInView = computed(() => route.path.startsWith('/app'));
</script>

<template>
  <Toaster
    rich-colors
    expand
    close-button
    visible-toasts="3"
    :position="smAndUp ? 'bottom-right' : 'top-center'"
    :offset="'30px'"
  />
  <v-app>
    <AppBar />
    <v-main>
      <RouterView />
    </v-main>
    <BottomAppBar v-if="!smAndUp && isLoggedInView" />
    <ConfirmDialog />
  </v-app>
</template>

<style scoped></style>
