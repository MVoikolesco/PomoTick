import { computed } from 'vue';
import type { SessionType } from '@/stores/timeStore';
import { useTimerStore } from '@/stores/timeStore';

export const usePomodoroTheme = () => {
  const store = useTimerStore();

  const accentColors = computed<Record<SessionType, string>>(() => ({
    focus: store.darkMode ? '#7D9464' : '#4A5D3A',
    short: store.darkMode ? '#D4845A' : '#B85C38',
    long: store.darkMode ? '#8C8070' : '#D4C5A9',
  }));

  const currentColor = computed(() => accentColors.value[store.sessionType]);
  const canvasClass = computed(() => (store.darkMode ? 'is-dark' : 'is-light'));

  return {
    accentColors,
    currentColor,
    canvasClass,
  };
};
