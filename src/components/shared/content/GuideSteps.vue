<template>
  <ol class="guide-steps">
    <slot />
  </ol>
</template>

<style scoped>
.guide-steps {
  padding-left: 0;
  list-style: none;
  counter-reset: guide-step;
}

.guide-steps :deep(li) {
  position: relative;
  min-height: 38px;
  margin: 14px 0;
  padding-left: 52px;
  counter-increment: guide-step;
}

.guide-steps :deep(li::before) {
  content: counter(guide-step);
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  color: white;
  font-weight: 700;
  line-height: 1;
}

@media (max-width: 600px) {
  .guide-steps :deep(li) {
    padding-left: 46px;
  }
}
</style>
