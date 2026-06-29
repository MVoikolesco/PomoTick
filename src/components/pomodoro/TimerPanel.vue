<script setup lang="ts">
import { computed } from 'vue';
import type { SessionType } from '@/stores/timeStore';
import { useTimerStore } from '@/stores/timeStore';
import { usePomodoroTheme } from '@/composables/usePomodoroTheme';
import { formatTimerTime } from '@/utils/timeFormat';

const store = useTimerStore();
const { accentColors, currentColor } = usePomodoroTheme();

const sessionOptions: Array<{ type: SessionType; shortLabel: string }> = [
  { type: 'focus', shortLabel: 'Foco' },
  { type: 'short', shortLabel: 'Curta' },
  { type: 'long', shortLabel: 'Longa' },
];

const circleOffset = computed(() => 283 - (283 * store.progressPercent) / 100);

const primaryButtonLabel = computed(() => {
  if (store.isRunning) {
    return 'Pausar';
  }

  return store.timeLeft === store.sessionDurationSeconds ? 'Iniciar' : 'Continuar';
});
</script>

<template>
  <section class="timer-view">
    <transition name="session">
      <div :key="store.sessionType" class="session-label">
        <span class="session-dot" :style="{ backgroundColor: currentColor }" />
        <span>{{ store.currentSessionLabel }}</span>
      </div>
    </transition>

    <div class="session-switcher" aria-label="Tipo de sessao">
      <button
        v-for="option in sessionOptions"
        :key="option.type"
        type="button"
        :class="{ active: store.sessionType === option.type }"
        @click="store.setSession(option.type)"
      >
        {{ option.shortLabel }}
      </button>
    </div>

    <section class="timer-ring" aria-label="Timer Pomodoro">
      <svg class="ring-svg" viewBox="0 0 100 100" aria-hidden="true">
        <circle class="ring-track" cx="50" cy="50" r="45" fill="none" stroke-width="2" />
        <circle
          class="ring-progress"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke-width="4"
          stroke-linecap="round"
          :stroke="currentColor"
          stroke-dasharray="283"
          :stroke-dashoffset="circleOffset"
        />
      </svg>

      <transition name="time" mode="out-in">
        <div :key="store.timeLeft" class="time-display">{{ formatTimerTime(store.timeLeft) }}</div>
      </transition>
    </section>

    <div class="controls">
      <button type="button" class="ghost-control" @click="store.resetTimer">Reiniciar</button>
      <button type="button" class="primary-control" :style="{ backgroundColor: currentColor }" @click="store.toggleTimer">
        {{ primaryButtonLabel }}
      </button>
      <button type="button" class="ghost-control" @click="store.skipSession">Pular</button>
    </div>

    <div class="status-bar">
      <span class="status-dot" :style="{ color: accentColors.focus }">&bull;</span>
      <span>Pomodoro {{ store.currentPomodoroNumber }} de {{ store.settings.cyclesBeforeLong }}</span>
      <span class="separator">|</span>
      <span class="muted">Proxima: {{ store.nextSessionLabel }}</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.timer-view {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.session-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  span:last-child {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    opacity: 0.6;
  }
}

.session-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex: 0 0 auto;
}

.session-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 24px;
  padding: 4px;
  border: 1px solid var(--hairline);
  border-radius: 14px;
  background: var(--surface-soft);

  button {
    min-width: 74px;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    opacity: 0.55;
    transition: background-color 180ms ease, opacity 180ms ease;

    &.active {
      background: var(--surface);
      opacity: 1;
    }
  }
}

.timer-ring {
  position: relative;
  width: 256px;
  height: 256px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-track {
  stroke: var(--track);
}

.ring-progress {
  transition: stroke-dashoffset 500ms linear, stroke 500ms ease;
}

.time-display {
  position: relative;
  z-index: 1;
  font-size: 60px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
}

.controls {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 40px;
}

.ghost-control {
  min-width: 64px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.4;
  transition: opacity 180ms ease;

  &:hover {
    opacity: 0.8;
  }
}

.primary-control {
  min-width: 144px;
  padding: 12px 40px;
  color: #ffffff;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
  transition: box-shadow 180ms ease, transform 180ms ease, background-color 500ms ease;

  &:hover {
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18);
  }

  &:active {
    transform: scale(0.95);
  }
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 48px;
  padding: 8px 16px;
  border: 1px solid var(--hairline);
  border-radius: 12px;
  background: var(--surface);
  font-size: 14px;
  transition: background-color 500ms ease, border-color 500ms ease;
}

.status-dot {
  line-height: 1;
}

.separator {
  opacity: 0.2;
}

.muted {
  opacity: 0.4;
}

.session-enter-active,
.session-leave-active,
.time-enter-active,
.time-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.session-enter-from,
.session-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.time-enter-from {
  opacity: 0.5;
  transform: translateY(10px);
}

.time-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (min-width: 768px) {
  .timer-ring {
    width: 320px;
    height: 320px;
  }

  .time-display {
    font-size: 72px;
  }
}

@media (max-width: 640px) {
  .session-switcher {
    width: 100%;
    max-width: 320px;

    button {
      flex: 1;
      min-width: 0;
    }
  }

  .controls {
    width: 100%;
    gap: 12px;
    justify-content: center;
  }

  .primary-control {
    min-width: 132px;
    padding-inline: 28px;
  }

  .status-bar {
    max-width: 100%;
    gap: 10px;
    font-size: 13px;
  }
}
</style>
