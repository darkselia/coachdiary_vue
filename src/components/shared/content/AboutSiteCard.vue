<script setup lang="ts">
import PublicSectionHeading from '@/components/shared/content/PublicSectionHeading.vue';

withDefaults(
  defineProps<{
    src: string;
    alt: string;
    eyebrow: string;
    title: string;
    badge?: string;
    mirrored?: boolean;
    grayscale?: boolean;
    aspectRatio?: string | number;
  }>(),
  {
    badge: undefined,
    mirrored: false,
    grayscale: false,
    aspectRatio: 4 / 3,
  },
);
</script>

<template>
  <article class="about-site-card" :class="{ 'about-site-card--mirrored': mirrored }">
    <div class="about-site-card__media">
      <v-img
        :alt
        :aspect-ratio="aspectRatio"
        class="about-site-card__image"
        :class="{ 'about-site-card__image--grayscale': grayscale }"
        cover
        :src
      />
      <span v-if="badge" class="about-site-card__badge">{{ badge }}</span>
    </div>

    <div class="about-site-card__content">
      <PublicSectionHeading :eyebrow :title><slot /></PublicSectionHeading>
      <div v-if="$slots.footer" class="about-site-card__footer"><slot name="footer" /></div>
    </div>
  </article>
</template>

<style scoped>
.about-site-card {
  display: grid;
  grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--v-public-primary-border);
  border-radius: 24px;
  background: radial-gradient(
      circle at 0% 100%,
      var(--v-public-primary-tint-strong),
      transparent 40%
    ),
    rgb(var(--v-theme-surface));
  box-shadow: 0 8px 26px var(--v-public-card-shadow);
}

.about-site-card--mirrored {
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
}

.about-site-card--mirrored .about-site-card__media {
  order: 2;
}

.about-site-card__media {
  position: relative;
  width: calc(100% - 48px);
  max-width: 430px;
  margin: 24px auto;
  overflow: hidden;
  border: 1px solid var(--v-public-primary-border);
  border-radius: 20px;
  background: var(--v-public-primary-tint);
  box-shadow: 0 14px 34px rgba(var(--v-theme-primary), 0.14);
}

.about-site-card__image--grayscale :deep(img) {
  filter: grayscale(100%);
}

.about-site-card__badge {
  position: absolute;
  right: 14px;
  bottom: 14px;
  padding: 8px 13px;
  border-radius: 999px;
  background: rgba(var(--v-theme-primary-darken-1), 0.84);
  color: white;
  backdrop-filter: blur(6px);
  font-size: 13px;
  font-weight: 700;
}

.about-site-card__content {
  padding: clamp(30px, 5vw, 72px);
}

.about-site-card__footer {
  margin-top: 26px;
}

@media (max-width: 800px) {
  .about-site-card,
  .about-site-card--mirrored {
    grid-template-columns: 1fr;
  }

  .about-site-card--mirrored .about-site-card__media {
    order: 0;
  }

  .about-site-card__media {
    margin-bottom: 0;
  }

  .about-site-card__content {
    padding: 28px;
  }
}

@media (max-width: 480px) {
  .about-site-card__content {
    padding: 24px;
  }
}
</style>
