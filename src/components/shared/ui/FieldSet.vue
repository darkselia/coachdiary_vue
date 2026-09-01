<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend>{{ title }}</legend>
    <slot></slot>
  </fieldset>
</template>

<style scoped>
.fieldset {
  border-radius: var(--v-border-radius);
  padding: 5px 10px 7px;
}

legend {
  text-align: left;
  margin-left: 8px;
  padding: 0 5px;
}
</style>
