<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue';

interface Props {
  duration: number;
}

const props = defineProps<Props>();

const timeLeft = ref<number>(props.duration * 1000); // Convert to milliseconds
const timer = ref<number | null>(null);

const formattedTime = computed(() => {
  const minutes = Math.floor((timeLeft.value / 1000) / 60);
  const seconds = Math.floor((timeLeft.value / 1000) % 60);
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
});

const circleStyle = computed(() => {
  const progress = ((props.duration * 1000 - timeLeft.value) / (props.duration * 1000)) * 100;
  return {
    strokeDasharray: `${progress}, 100`,
    stroke: `url(#gradient)`
  };
});

const startTimer = () => {
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      if (timer.value !== null) {
        clearInterval(timer.value);
      }
    }
  }, 1) as unknown as number; // Type assertion to match the timer type
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timer.value !== null) {
    clearInterval(timer.value);
  }
});
</script>

<template>
  <div class="countdown-timer">
    <svg class="circle" viewBox="0 0 36 36">
      <defs>
        <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#64abec" />
          <stop offset="100%" stop-color="#64abec" />
        </linearGradient>
      </defs>
      <path
          class="circle-bg"
          d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
          class="circle-progress"
          :style="circleStyle"
          d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>
    <div class="time">{{ formattedTime }}</div>
  </div>
</template>

<style scoped>
.countdown-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 200px;
  height: 200px;
}

.circle {
  position: absolute;
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #ddd;
  stroke-width: 3.8;
}

.circle-progress {
  fill: none;
  stroke-width: 3.8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.1s, stroke 0.1s;
}

.time {
  font-size: 2rem;
  font-family: 'Arial', sans-serif;
}
</style>
