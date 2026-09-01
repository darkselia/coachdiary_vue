<script lang="ts" setup>
import type { Gender } from '@/types/common';

const { gender, high, middle, low } = defineProps<{
  gender: Gender;
  high: number | null;
  middle: number | null;
  low: number | null;
}>();
</script>

<template>
  <div>
    <div class="gender-text">{{ gender === 'm' ? 'Мальчики' : 'Девочки' }}</div>
    <table class="table">
      <thead>
        <tr>
          <td>Ступень</td>
          <td>Норма</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Высокая</td>
          <td>{{ high }}</td>
        </tr>
        <tr>
          <td>Средняя</td>
          <td>{{ middle }}</td>
        </tr>
        <tr>
          <td>Низкая</td>
          <td>{{ low }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.gender-text {
  text-transform: uppercase;
  font-weight: bold;
  margin-left: 12px;
  font-size: 20px;
}

.table {
  width: 100%;
  border-spacing: 0;
  border-radius: var(--v-border-radius);
  overflow: hidden;
  font-weight: bold;

  thead tr {
    text-transform: uppercase;
    font-weight: bold;
    background: rgb(var(--v-theme-surface));

    td {
      padding: 12px 40px;
    }
  }

  tbody {
    color: rgb(var(--v-theme-primary));

    td {
      padding: 4px 40px;
    }

    tr:nth-child(even) {
      background: rgb(var(--v-theme-surface));
    }
  }
}

@media (width <= 600px) {
  .gender-text {
    text-align: center;
    margin-bottom: 5px;
  }
}
</style>
