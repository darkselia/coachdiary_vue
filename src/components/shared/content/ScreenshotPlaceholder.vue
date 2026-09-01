<script setup lang="ts">
defineProps<{
  number: number;
  title: string;
  description: string;
}>();
</script>

<template>
  <figure
    class="screenshot-placeholder"
    role="img"
    :aria-label="`Место для скриншота ${number}: ${title}. ${description}`"
  >
    <div class="number" aria-hidden="true">{{ number }}</div>
    <v-icon class="icon" icon="mdi-image-outline" size="44" aria-hidden="true" />
    <figcaption>
      <strong>Место для скриншота: {{ title }}</strong>
      <span>{{ description }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.screenshot-placeholder {
  position: relative;
  min-height: 220px;
  margin: 28px 0;
  padding: 36px 24px;
  border: 2px dashed rgb(var(--v-theme-primary));
  border-radius: 16px;
  background: var(--v-public-primary-tint);
  color: rgb(var(--v-theme-primary-darken-1));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
}

.number {
  position: absolute;
  top: 14px;
  left: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
}

figcaption {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 680px;
}

figcaption strong {
  font-size: 18px;
}

figcaption span {
  color: rgb(var(--v-theme-on-background));
  line-height: 1.5;
}

@media (max-width: 600px) {
  .screenshot-placeholder {
    min-height: 180px;
    padding: 48px 16px 24px;
  }
}
</style>
