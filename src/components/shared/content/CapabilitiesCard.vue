<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
}>();
</script>

<template>
  <article class="capability-card">
    <div class="capability-card__icon" aria-hidden="true">
      <v-icon :icon size="34" />
    </div>
    <h3>{{ title }}</h3>
    <div class="capability-card__description"><slot /></div>
  </article>
</template>

<style scoped>
.capability-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  gap: 18px 20px;
  height: 100%;
  padding: clamp(22px, 3vw, 32px);
  border: 1px solid var(--v-public-primary-border);
  border-radius: 20px;
  background: radial-gradient(
      circle at 100% 0%,
      var(--v-public-primary-tint-strong),
      transparent 46%
    ),
    rgb(var(--v-theme-surface));
  box-shadow: 0 8px 24px var(--v-public-card-shadow);
}

.capability-card__icon {
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  border-radius: 16px;
  background: rgb(var(--v-theme-primary));
  color: white;
}

h3 {
  align-self: center;
  margin: 0;
  color: rgb(var(--v-theme-primary));
  font-size: clamp(19px, 2vw, 24px);
  line-height: 1.25;
}

.capability-card__description {
  grid-column: 1 / -1;
}

.capability-card__description :deep(p) {
  margin: 0;
  color: rgb(var(--v-theme-on-background));
  font-size: 16px;
  line-height: 1.65;
}

@media (max-width: 480px) {
  .capability-card {
    grid-template-columns: 1fr;
  }

  .capability-card__description {
    grid-column: 1;
  }
}
</style>
