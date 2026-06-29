import { onBeforeUnmount, onMounted, watch } from 'vue';
import type { HistoryEntry } from '@/stores/timeStore';
import { useTimerStore } from '@/stores/timeStore';
import { formatTimerTime } from '@/utils/timeFormat';

const playCompletionSound = () => {
  const store = useTimerStore();

  if (!store.settings.soundEnabled || typeof window === 'undefined') {
    return;
  }

  const AudioContextClass =
    window.AudioContext ||
    (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.18);
  gain.gain.setValueAtTime(0.001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.22, audioContext.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.28);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
};

const notifyCompletion = (entry: HistoryEntry) => {
  const store = useTimerStore();

  playCompletionSound();

  if (
    !store.settings.notificationsEnabled ||
    typeof window === 'undefined' ||
    !('Notification' in window) ||
    Notification.permission !== 'granted'
  ) {
    return;
  }

  new Notification('Sessao concluida', {
    body: `${entry.label} finalizada. Proxima: ${store.currentSessionLabel}.`,
  });
};

export const usePomodoroTicker = () => {
  const store = useTimerStore();
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const clearTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const completeSession = () => {
    const entry = store.completeCurrentSession();
    notifyCompletion(entry);

    if (!store.isRunning) {
      clearTimer();
    }
  };

  onMounted(() => {
    store.hydrate();
  });

  watch(
    () => store.isRunning,
    (running) => {
      clearTimer();

      if (!running) {
        return;
      }

      intervalId = setInterval(() => {
        if (store.timeLeft > 1) {
          store.tick();
          return;
        }

        completeSession();
      }, 1000);
    },
  );

  watch(
    () => store.timeLeft,
    () => {
      if (typeof document !== 'undefined') {
        document.title = `${formatTimerTime(store.timeLeft)} - ${store.currentSessionLabel} | PomoTick`;
      }
    },
  );

  onBeforeUnmount(() => {
    clearTimer();
  });
};
