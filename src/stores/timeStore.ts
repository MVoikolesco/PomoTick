import { defineStore } from 'pinia';

export type SessionType = 'focus' | 'short' | 'long';
export type AppView = 'timer' | 'history';

export interface TimerSettings {
  focusMinutes: number;
  shortMinutes: number;
  longMinutes: number;
  cyclesBeforeLong: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface HistoryEntry {
  id: string;
  type: SessionType;
  label: string;
  durationSeconds: number;
  completedAt: string;
}

interface PersistedState {
  darkMode?: boolean;
  settings?: Partial<TimerSettings>;
  history?: HistoryEntry[];
  completedFocusSessionsInCycle?: number;
}

const STORAGE_KEY = 'pomotrick-state-v1';

const defaultSettings: TimerSettings = {
  focusMinutes: 25,
  shortMinutes: 5,
  longMinutes: 15,
  cyclesBeforeLong: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  notificationsEnabled: false,
};

export const sessionLabels: Record<SessionType, string> = {
  focus: 'Sessao de Foco',
  short: 'Pausa Curta',
  long: 'Pausa Longa',
};

const clamp = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(Math.round(value), min), max);
};

const normalizeSettings = (settings: Partial<TimerSettings> = {}): TimerSettings => ({
  focusMinutes: clamp(settings.focusMinutes ?? defaultSettings.focusMinutes, 1, 180),
  shortMinutes: clamp(settings.shortMinutes ?? defaultSettings.shortMinutes, 1, 60),
  longMinutes: clamp(settings.longMinutes ?? defaultSettings.longMinutes, 1, 120),
  cyclesBeforeLong: clamp(settings.cyclesBeforeLong ?? defaultSettings.cyclesBeforeLong, 2, 12),
  autoStartBreaks: Boolean(settings.autoStartBreaks ?? defaultSettings.autoStartBreaks),
  autoStartFocus: Boolean(settings.autoStartFocus ?? defaultSettings.autoStartFocus),
  soundEnabled: Boolean(settings.soundEnabled ?? defaultSettings.soundEnabled),
  notificationsEnabled: Boolean(settings.notificationsEnabled ?? defaultSettings.notificationsEnabled),
});

const durationFor = (settings: TimerSettings, type: SessionType) => {
  if (type === 'focus') {
    return settings.focusMinutes * 60;
  }

  return type === 'short' ? settings.shortMinutes * 60 : settings.longMinutes * 60;
};

const localDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const useTimerStore = defineStore('timer', {
  state: () => ({
    activeView: 'timer' as AppView,
    darkMode: true,
    showSettings: false,
    sessionType: 'focus' as SessionType,
    isRunning: false,
    timeLeft: defaultSettings.focusMinutes * 60,
    completedFocusSessionsInCycle: 0,
    settings: { ...defaultSettings } as TimerSettings,
    history: [] as HistoryEntry[],
    hydrated: false,
  }),

  getters: {
    sessionDurationSeconds(state) {
      return durationFor(state.settings, state.sessionType);
    },
    progressPercent(state): number {
      const total = durationFor(state.settings, state.sessionType);

      if (total <= 0) {
        return 0;
      }

      return ((total - state.timeLeft) / total) * 100;
    },
    currentSessionLabel(state) {
      return sessionLabels[state.sessionType];
    },
    nextSessionType(state): SessionType {
      if (state.sessionType !== 'focus') {
        return 'focus';
      }

      return state.completedFocusSessionsInCycle + 1 >= state.settings.cyclesBeforeLong ? 'long' : 'short';
    },
    nextSessionLabel(): string {
      return sessionLabels[this.nextSessionType];
    },
    currentPomodoroNumber(state) {
      return Math.min(state.completedFocusSessionsInCycle + 1, state.settings.cyclesBeforeLong);
    },
    sortedHistory(state) {
      return [...state.history].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    },
    todayFocusCount(state) {
      const today = localDateKey(new Date());

      return state.history.filter((entry) => entry.type === 'focus' && localDateKey(new Date(entry.completedAt)) === today).length;
    },
    weekFocusHours(state) {
      const now = new Date();
      const start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));
      const seconds = state.history.reduce((total, entry) => {
        if (entry.type !== 'focus') {
          return total;
        }

        return new Date(entry.completedAt) >= start ? total + entry.durationSeconds : total;
      }, 0);

      return seconds / 3600;
    },
    streakDays(state) {
      const focusDays = new Set(
        state.history
          .filter((entry) => entry.type === 'focus')
          .map((entry) => localDateKey(new Date(entry.completedAt))),
      );

      let cursor = startOfDay(new Date());

      if (!focusDays.has(localDateKey(cursor))) {
        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
      }

      let streak = 0;

      while (focusDays.has(localDateKey(cursor))) {
        streak += 1;
        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
      }

      return streak;
    },
  },

  actions: {
    hydrate() {
      if (this.hydrated || typeof localStorage === 'undefined') {
        return;
      }

      const rawState = localStorage.getItem(STORAGE_KEY);

      if (rawState) {
        try {
          const persisted = JSON.parse(rawState) as PersistedState;

          this.darkMode = persisted.darkMode ?? true;
          this.settings = normalizeSettings(persisted.settings);
          this.history = Array.isArray(persisted.history) ? persisted.history : [];
          this.completedFocusSessionsInCycle = clamp(
            persisted.completedFocusSessionsInCycle ?? 0,
            0,
            this.settings.cyclesBeforeLong - 1,
          );
        } catch {
          this.settings = { ...defaultSettings };
          this.history = [];
        }
      }

      this.timeLeft = durationFor(this.settings, this.sessionType);
      this.hydrated = true;
    },

    persist() {
      if (typeof localStorage === 'undefined') {
        return;
      }

      const state: PersistedState = {
        darkMode: this.darkMode,
        settings: this.settings,
        history: this.history.slice(-200),
        completedFocusSessionsInCycle: this.completedFocusSessionsInCycle,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },

    setActiveView(view: AppView) {
      this.activeView = view;
    },

    setDarkMode(value: boolean) {
      this.darkMode = value;
      this.persist();
    },

    setSettings(settings: Partial<TimerSettings>) {
      this.settings = normalizeSettings({ ...this.settings, ...settings });
      this.completedFocusSessionsInCycle = clamp(this.completedFocusSessionsInCycle, 0, this.settings.cyclesBeforeLong - 1);
      this.resetTimer();
      this.persist();
    },

    setSession(type: SessionType) {
      this.isRunning = false;
      this.sessionType = type;
      this.resetTimer();
      this.activeView = 'timer';
      this.persist();
    },

    startTimer() {
      this.isRunning = true;
    },

    pauseTimer() {
      this.isRunning = false;
    },

    toggleTimer() {
      this.isRunning = !this.isRunning;
    },

    resetTimer() {
      this.isRunning = false;
      this.timeLeft = durationFor(this.settings, this.sessionType);
    },

    tick() {
      this.timeLeft = Math.max(this.timeLeft - 1, 0);
    },

    skipSession() {
      this.isRunning = false;
      this.sessionType = this.nextSessionType;

      if (this.sessionType === 'focus' && this.completedFocusSessionsInCycle >= this.settings.cyclesBeforeLong) {
        this.completedFocusSessionsInCycle = 0;
      }

      this.timeLeft = durationFor(this.settings, this.sessionType);
      this.persist();
    },

    completeCurrentSession() {
      const completedType = this.sessionType;
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: completedType,
        label: sessionLabels[completedType],
        durationSeconds: durationFor(this.settings, completedType),
        completedAt: new Date().toISOString(),
      };

      this.history.push(entry);

      const nextType: SessionType =
        completedType === 'focus'
          ? this.completedFocusSessionsInCycle + 1 >= this.settings.cyclesBeforeLong
            ? 'long'
            : 'short'
          : 'focus';

      if (completedType === 'focus') {
        const nextCount = this.completedFocusSessionsInCycle + 1;
        this.completedFocusSessionsInCycle = nextCount;
      }

      if (completedType === 'long') {
        this.completedFocusSessionsInCycle = 0;
      }

      this.sessionType = nextType;
      this.timeLeft = durationFor(this.settings, this.sessionType);
      this.isRunning = this.sessionType === 'focus' ? this.settings.autoStartFocus : this.settings.autoStartBreaks;
      this.persist();

      return entry;
    },

    clearHistory() {
      this.history = [];
      this.completedFocusSessionsInCycle = 0;
      this.persist();
    },
  },
});
