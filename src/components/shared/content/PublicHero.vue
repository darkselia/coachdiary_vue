<script setup lang="ts">
defineProps<{
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}>();
</script>

<template>
  <header class="public-hero" :style="{ '--hero-image': `url('${image}')` }">
    <div class="public-hero__content">
      <p class="public-hero__eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p class="public-hero__lead">{{ description }}</p>
    </div>
  </header>
</template>

<style scoped>
.public-hero {
  display: flex;
  min-height: 310px;
  align-items: center;
  padding: 64px 24px;
  background:
    linear-gradient(
      135deg,
      rgb(var(--v-theme-primary), 0.8),
      rgb(var(--v-theme-primary-lighten-2))
    ),
    var(--hero-image) center / cover;
  color: white;
}

.public-hero__content {
  width: min(100%, 1500px);
  margin: 0 auto;
}

.public-hero__eyebrow {
  margin: 0 0 8px;
  color: rgb(var(--v-theme-secondary));
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  max-width: 900px;
  margin: 0;
  font-size: clamp(36px, 5vw, 58px);
  line-height: 1.1;
}

.public-hero__lead {
  max-width: 820px;
  margin: 18px 0 0;
  font-size: clamp(18px, 2.5vw, 22px);
  line-height: 1.6;
}

@media (max-width: 600px) {
  .public-hero {
    min-height: 240px;
    padding: 44px 20px;
  }
}
</style>
