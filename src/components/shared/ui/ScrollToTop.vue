<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const isVisible = ref(false);

function updateVisibility(): void {
  isVisible.value = window.scrollY >= window.innerHeight;
}

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateVisibility);
  window.removeEventListener('resize', updateVisibility);
});
</script>

<template>
  <v-btn
    v-show="isVisible"
    class="scroll-to-top"
    color="primary"
    elevation="6"
    prepend-icon="mdi-arrow-up"
    rounded="pill"
    text="Вверх"
    aria-label="Вернуться к началу страницы"
    @click="scrollToTop"
  />
</template>

<style scoped>
.scroll-to-top {
  position: fixed;
  right: 28px;
  bottom: calc(var(--v-layout-bottom, 0px) + 28px);
  z-index: 1100;
}

@media (max-width: 600px) {
  .scroll-to-top {
    right: 16px;
    bottom: calc(var(--v-layout-bottom, 0px) + max(16px, env(safe-area-inset-bottom)));
  }
}
</style>
