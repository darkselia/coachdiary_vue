<script setup lang="ts">
import { computed } from 'vue';

type PublicNoticeType = 'info' | 'warning' | 'danger';

const props = withDefaults(
  defineProps<{
    type?: PublicNoticeType;
    title: string;
    description: string;
  }>(),
  { type: 'info' },
);

const icon = computed(() => {
  const icons: Record<PublicNoticeType, string> = {
    info: 'mdi-information-outline',
    warning: 'mdi-alert-outline',
    danger: 'mdi-alert-circle-outline',
  };
  return icons[props.type];
});
</script>

<template>
  <aside class="public-notice" :class="`public-notice--${type}`" role="alert">
    <v-icon :icon size="24" aria-hidden="true" />
    <div>
      <strong>{{ title }}</strong>
      <p>{{ description }}</p>
    </div>
  </aside>
</template>

<style scoped>
.public-notice {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin: 24px 0;
  padding: 18px 20px;
  border-left: 4px solid;
  border-radius: 12px;
  line-height: 1.6;
}

.public-notice strong {
  display: block;
  margin-bottom: 2px;
}

.public-notice p {
  margin: 0;
}

.public-notice--info {
  color: rgb(var(--v-theme-primary-darken-1));
  border-color: rgb(var(--v-theme-info));
  background: var(--v-public-info-tint);
}

.public-notice--warning {
  color: rgb(var(--v-theme-primary-darken-1));
  border-color: rgb(var(--v-theme-secondary-darken-1));
  background: var(--v-public-warning-tint);
}

.public-notice--danger {
  color: rgb(var(--v-theme-error));
  border-color: rgb(var(--v-theme-error));
  background: var(--v-public-danger-tint);
}

@media (max-width: 600px) {
  .public-notice {
    padding: 15px;
  }
}
</style>
