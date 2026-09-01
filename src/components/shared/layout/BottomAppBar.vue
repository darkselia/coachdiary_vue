<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const userStore = useUserStore();
const studentId = computed(() => userStore.studentId);
const showPlusButton = computed(() => route.name === 'my-classes' || route.name === 'my-standards');
const plusButtonLink = computed(() => {
  if (route.name === 'my-classes') return { name: 'create-student' };
  if (route.name === 'my-standards') return { name: 'create-standard' };
  return {};
});
</script>

<template>
  <v-fab
    v-if="showPlusButton"
    :to="plusButtonLink"
    class="fab"
    location="right bottom"
    color="primary"
    icon="mdi-plus"
    size="large"
    app
  />

  <v-bottom-navigation class="bottom-app-bar" grow>
    <v-btn v-if="userStore.isTeacher" :to="{ name: 'my-diary' }" class="button">
      <v-icon class="icon">mdi-notebook</v-icon>
      <span class="name">Дневник</span>
    </v-btn>
    <v-btn v-if="userStore.isTeacher" :to="{ name: 'my-classes' }" class="button">
      <v-icon class="icon">mdi-account-group</v-icon>
      <span class="name">Классы</span>
    </v-btn>
    <v-btn v-if="userStore.isTeacher" :to="{ name: 'my-standards' }" class="button">
      <v-icon class="icon">mdi-run</v-icon>
      <span class="name">Нормативы</span>
    </v-btn>
    <v-btn
      v-if="userStore.isStudent"
      :to="{ name: 'student', params: { id: studentId } }"
      class="button"
    >
      <v-icon class="icon">mdi-run</v-icon>
      <span class="name">Мои результаты</span>
    </v-btn>
    <v-btn :to="{ name: 'profile' }" class="button">
      <v-icon class="icon">mdi-account</v-icon>
      <span class="name">Профиль</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
.fab {
  transform: translateY(-60px) !important;
}

.bottom-app-bar {
  border-top: 2px solid rgb(var(--v-theme-primary));
  border-radius: 15px 15px 0 0;
}

.name {
  font-size: 10px;
}

.icon {
  font-size: 35px;
  color: rgb(var(--v-theme-primary));
}
</style>
