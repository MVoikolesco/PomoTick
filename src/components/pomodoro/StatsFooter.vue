<script setup lang="ts">
import { computed } from 'vue';
import { useTimerStore } from '@/stores/timeStore';
import { formatWeekHours } from '@/utils/timeFormat';

const store = useTimerStore();
const weekHoursLabel = computed(() => formatWeekHours(store.weekFocusHours));
</script>

<template>
  <footer class="stats-footer">
    <div class="stats-grid">
      <div><span class="stat-value">{{ store.todayFocusCount }}</span> <span class="muted">Hoje</span></div>
      <div><span class="stat-value">{{ weekHoursLabel }}h</span> <span class="muted">Semana</span></div>
      <div><span class="stat-value">{{ store.streakDays }}d</span> <span class="muted">Sequencia</span></div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.stats-footer {
  position: relative;
  z-index: 10;
  padding: 24px;
  border-top: 1px solid var(--hairline);
  background: color-mix(in srgb, var(--surface) 30%, transparent);
  backdrop-filter: blur(12px);
}

.stats-grid {
  max-width: 896px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.stat-value {
  font-weight: 700;
}

.muted {
  opacity: 0.4;
}

@media (max-width: 640px) {
  .stats-footer {
    padding-inline: 20px;
  }
}
</style>
