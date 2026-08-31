<script lang="ts" setup>
import { useDisplay } from 'vuetify';
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';

const userStore = useUserStore();
const uiStore = useUIStore();

const { smAndUp, width } = useDisplay();
const isMenuOpen = ref(false);

const route = useRoute();
const isLoginPage = computed(() => route.name === 'login');
const isLoggedInView = computed(() => route.path.startsWith('/app'));

const logoLink = computed(() => {
  if (route.path.startsWith('/app')) return { name: 'my-diary' };
  return { name: 'home' };
});

const mobileTitle = computed(() => {
  if (uiStore.mobileTitle) return uiStore.mobileTitle;

  return route.meta.mobileTitle;
});

onMounted(() => {
  setTimeout(() => {
    const mainElement = document.querySelector('.v-main');
    if (mainElement) {
      (mainElement as HTMLElement).style.paddingTop = '60px';
    }
  }, 0);
});
</script>

<template>
  <v-navigation-drawer v-if="!smAndUp && !isLoggedInView" v-model="isMenuOpen">
    <v-list-item :key="logoLink.name" :to="logoLink" title="Дневник Тренера" />
    <v-divider class="mb-2" color="rgb(var(--v-theme-primary-darken-1))" />
    <v-list-item href="/#Capabilities" link title="Возможности" />
    <v-list-item :to="{ name: 'about-site' }" link title="О сайте" />
    <v-list-item :to="{ name: 'about-us' }" link title="О нас" />
  </v-navigation-drawer>

  <v-app-bar :class="{ 'app-bar': !smAndUp }">
    <v-app-bar-title>
      <router-link v-if="smAndUp" :to="logoLink" class="title">
        <img v-if="width < 820" alt="logo" class="icon" src="/mobile_man_run_blue.svg" />
        <img v-else alt="logo" class="icon" src="/mobile_logo_blue.svg" />
      </router-link>
      <div v-else class="text-center mr-4 mobile-title">{{ mobileTitle }}</div>
    </v-app-bar-title>

    <template #prepend v-if="!isLoggedInView">
      <v-btn v-if="!smAndUp" icon="mdi-menu" @click="isMenuOpen = true" />
    </template>

    <template #append>
      <div class="container">
        <template v-if="!isLoggedInView">
          <template v-if="smAndUp">
            <v-btn href="/#Capabilities" variant="text">Возможности</v-btn>
            <v-btn :to="{ name: 'about-site' }" variant="text">О сайте</v-btn>
            <v-btn :to="{ name: 'about-us' }" variant="text">О нас</v-btn>
          </template>

          <v-btn v-if="!isLoginPage" :to="{ name: 'login' }" rounded variant="flat">Войти</v-btn>
        </template>

        <template v-else-if="smAndUp">
          <v-btn
            v-if="userStore.isTeacher"
            :to="{ name: 'my-classes' }"
            variant="text"
            text="Мои классы"
          />
          <v-btn
            v-if="userStore.isTeacher"
            :to="{ name: 'my-diary' }"
            variant="text"
            text="Дневник"
          />
          <v-btn
            v-if="userStore.isTeacher"
            :to="{ name: 'my-standards' }"
            variant="text"
            text="Мои нормативы"
          />
          <v-divider
            v-if="userStore.isTeacher"
            class="divider mb-2 mt-2"
            color="rgb(var(--v-theme-primary-darken-1))"
            vertical
          />
          <v-btn
            v-if="userStore.isStudent"
            :to="{ name: 'student', params: { id: userStore.studentId } }"
            variant="text"
            text="Мои результаты"
          />
          <v-btn :to="{ name: 'profile' }" variant="text" text="Профиль" />
          <v-btn rounded variant="flat" @click="userStore.logout">Выйти</v-btn>
        </template>

        <!--        <v-btn
          v-else-if="!smAndUp"
          :to="{ name: 'profile' }"
          class="info-button"
          icon="mdi-information-slab-circle-outline"
        />-->
      </div>
    </template>
  </v-app-bar>
</template>

<style scoped>
.title {
  color: black;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

.mobile-title {
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
}

.app-bar {
  border-bottom: 2px solid rgb(var(--v-theme-primary));
  border-radius: 0 0 15px 15px;
}

.app-bar :deep(.v-toolbar__content) {
  height: 45px !important;
}

.container {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 100%;
  margin-right: 16px;
}

.icon {
  height: 50px;
}

.info-button :deep(.v-btn__content) {
  font-size: 20px;
}

.info-button {
  position: absolute;
  right: 4px;
  top: 4px;
}

.divider {
  height: calc(100% - 15px);
}
</style>
