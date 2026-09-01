<script setup lang="ts">
import PublicSectionHeading from '@/components/shared/content/PublicSectionHeading.vue';

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    title: string;
    type?: 'default' | 'highlighted';
    icon?: string;
    sectionLabel?: string;
  }>(),
  { type: 'default', icon: undefined, sectionLabel: undefined },
);
</script>

<template>
  <section v-bind="$attrs" class="guide-section" :class="`guide-section--${type}`">
    <PublicSectionHeading :eyebrow="sectionLabel" :icon :title size="compact" />
    <slot />
  </section>
</template>

<style scoped>
.guide-section {
  scroll-margin-top: 90px;
  padding: 12px 0 54px;
  border-bottom: 1px solid var(--v-public-primary-border);
}

.guide-section + .guide-section {
  padding-top: 54px;
}

.guide-section--highlighted {
  padding-right: 28px;
  padding-left: 28px;
  border: 1px solid var(--v-public-primary-border-strong);
  border-radius: 18px;
  background: var(--v-public-primary-tint);
}

@media (max-width: 600px) {
  .guide-section,
  .guide-section + .guide-section {
    padding-top: 34px;
    padding-bottom: 38px;
  }

  .guide-section--highlighted {
    padding-right: 16px;
    padding-left: 16px;
  }
}
</style>
