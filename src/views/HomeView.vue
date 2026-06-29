<script setup lang="ts">
import HistoryPanel from '@/components/pomodoro/HistoryPanel.vue';
import MobileNav from '@/components/pomodoro/MobileNav.vue';
import PomodoroHeader from '@/components/pomodoro/PomodoroHeader.vue';
import SettingsDrawer from '@/components/pomodoro/SettingsDrawer.vue';
import StatsFooter from '@/components/pomodoro/StatsFooter.vue';
import TimerPanel from '@/components/pomodoro/TimerPanel.vue';
import { usePomodoroTheme } from '@/composables/usePomodoroTheme';
import { usePomodoroTicker } from '@/composables/usePomodoroTicker';
import { useTimerStore } from '@/stores/timeStore';

const store = useTimerStore();
const { canvasClass, currentColor } = usePomodoroTheme();

usePomodoroTicker();
</script>

<template>
  <div class="pomodoro-screen" :class="canvasClass">
    <PomodoroHeader />
    <MobileNav />

    <main class="timer-stage" :class="{ 'history-stage': store.activeView === 'history' }">
      <div class="ambient-glow" :style="{ backgroundColor: currentColor }" />

      <TimerPanel v-if="store.activeView === 'timer'" />
      <HistoryPanel v-else />
    </main>

    <StatsFooter />
    <SettingsDrawer />
  </div>
</template>

<style scoped lang="scss">
.pomodoro-screen {
  --canvas: #f7f5f2;
  --text: #2c2c2c;
  --surface: #ffffff;
  --surface-soft: rgba(255, 255, 255, 0.68);
  --hairline: rgba(0, 0, 0, 0.05);
  --track: rgba(0, 0, 0, 0.05);
  --field: rgba(0, 0, 0, 0.035);

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--text);
  background: var(--canvas);
  transition: background-color 500ms ease, color 500ms ease;

  &.is-dark {
    --canvas: #1a1a1a;
    --text: #e8e6e3;
    --surface: #242424;
    --surface-soft: rgba(36, 36, 36, 0.68);
    --hairline: rgba(255, 255, 255, 0.1);
    --track: rgba(255, 255, 255, 0.1);
    --field: rgba(255, 255, 255, 0.06);
  }
}

:deep(button),
:deep(input) {
  color: inherit;
  font: inherit;
}

:deep(button) {
  border: 0;
  background: transparent;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.25;
  }
}

.timer-stage {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
}

.history-stage {
  justify-content: flex-start;
  overflow-y: auto;
}

.ambient-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(260px, 75vw, 600px);
  height: clamp(260px, 75vw, 600px);
  border-radius: 999px;
  opacity: 0.03;
  filter: blur(64px);
  pointer-events: none;
  transform: translate(-50%, -50%) scale(1.2);
  transition: background-color 800ms ease, transform 800ms ease;
}

@media (max-width: 640px) {
  .timer-stage {
    padding-inline: 20px;
  }
}
</style>
