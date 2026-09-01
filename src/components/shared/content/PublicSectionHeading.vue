<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    icon?: string;
    align?: 'start' | 'center';
    size?: 'default' | 'compact';
  }>(),
  { eyebrow: undefined, icon: undefined, align: 'start', size: 'default' },
);
</script>

<template>
  <header
    class="section-heading"
    :class="[`section-heading--${align}`, `section-heading--${size}`]"
  >
    <div v-if="icon || eyebrow" class="section-heading__meta">
      <v-icon v-if="icon" :icon size="36" aria-hidden="true" />
      <p v-if="eyebrow" class="section-heading__eyebrow">{{ eyebrow }}</p>
    </div>
    <h2>{{ title }}</h2>
    <div v-if="$slots.default" class="section-heading__description"><slot /></div>
  </header>
</template>

<style scoped>
.section-heading--center {
  max-width: 920px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.section-heading--center .section-heading__meta {
  justify-content: center;
}

.section-heading__meta {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 10px;
  color: rgb(var(--v-theme-primary));
}

.section-heading__eyebrow {
  margin: 0;
  color: rgb(var(--v-theme-primary-lighten-2));
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h2 {
  margin: 0 0 16px;
  color: rgb(var(--v-theme-primary));
  font-size: clamp(28px, 3.5vw, 44px);
  line-height: 1.15;
}

.section-heading--compact .section-heading__eyebrow {
  font-weight: 700;
  letter-spacing: 0.08em;
}

.section-heading--compact h2 {
  margin-bottom: 20px;
  font-size: clamp(28px, 4vw, 38px);
  line-height: 1.2;
}

.section-heading__description :deep(p) {
  margin: 0;
  font-size: clamp(16px, 1.5vw, 20px);
  line-height: 1.7;
}
</style>
