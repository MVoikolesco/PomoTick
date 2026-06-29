<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useTimerStore } from '@/stores/timeStore';

const timerStore = useTimerStore();

const formattedTime = computed(() => {
  const minutes = Math.floor(timerStore.timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timerStore.timeLeft % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
});

const circleStyle = computed(() => ({
  strokeDasharray: '283',
  strokeDashoffset: 283 - (283 * timerStore.progressPercent) / 100,
}));

onMounted(() => {
  timerStore.hydrate();
});
</script>

<template>
  <div class="countdown-timer">
    <svg class="circle" viewBox="0 0 100 100" aria-hidden="true">
      <circle class="circle-bg" cx="50" cy="50" r="45" />
      <circle class="circle-progress" cx="50" cy="50" r="45" :style="circleStyle" />
    </svg>
    <div class="time">{{ formattedTime }}</div>
  </div>
</template>

<style scoped>
.countdown-timer {
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg,
.circle-progress {
  fill: none;
}

.circle-bg {
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 2;
}

.circle-progress {
  stroke: #7d9464;
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 500ms linear;
}

.time {
  position: relative;
  color: currentColor;
  font-size: 42px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>
