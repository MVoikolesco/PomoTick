<script setup lang="ts">
import { computed } from 'vue';
import { usePomodoroTheme } from '@/composables/usePomodoroTheme';
import { useTimerStore } from '@/stores/timeStore';
import { formatDuration, formatHistoryDateTime, formatWeekHours } from '@/utils/timeFormat';

const store = useTimerStore();
const { accentColors, currentColor } = usePomodoroTheme();

const historyItems = computed(() => store.sortedHistory.slice(0, 50));
const weekHoursLabel = computed(() => formatWeekHours(store.weekFocusHours));
</script>

<template>
  <section class="history-view" aria-label="Historico de sessoes">
    <div class="history-head">
      <div>
        <div class="session-label compact">
          <span class="session-dot" :style="{ backgroundColor: currentColor }" />
          <span>Historico</span>
        </div>
        <h1>Sessoes concluidas</h1>
      </div>

      <button type="button" class="ghost-control danger" :disabled="!store.history.length" @click="store.clearHistory">
        Limpar
      </button>
    </div>

    <div class="history-summary">
      <div>
        <span class="stat-value">{{ store.todayFocusCount }}</span>
        <span class="muted">focos hoje</span>
      </div>
      <div>
        <span class="stat-value">{{ weekHoursLabel }}h</span>
        <span class="muted">na semana</span>
      </div>
      <div>
        <span class="stat-value">{{ store.streakDays }}d</span>
        <span class="muted">sequencia</span>
      </div>
    </div>

    <div v-if="historyItems.length" class="history-list">
      <article v-for="entry in historyItems" :key="entry.id" class="history-item">
        <span class="history-dot" :style="{ backgroundColor: accentColors[entry.type] }" />
        <div>
          <strong>{{ entry.label }}</strong>
          <span>{{ formatHistoryDateTime(entry.completedAt) }}</span>
        </div>
        <span class="history-duration">{{ formatDuration(entry.durationSeconds) }}</span>
      </article>
    </div>

    <div v-else class="empty-state">
      <strong>Nenhuma sessao concluida ainda.</strong>
      <span class="muted">Quando voce finalizar um foco ou uma pausa, ela aparece aqui.</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.history-view {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 780px;
  align-items: stretch;
  padding-block: 44px;
}

.history-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;

  h1 {
    font-size: 32px;
    line-height: 1.1;
    letter-spacing: 0;
  }
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

  &.compact {
    justify-content: flex-start;
    margin-bottom: 10px;
  }
}

.session-dot,
.history-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex: 0 0 auto;
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

  &.danger:hover {
    color: #b85c38;
  }
}

.history-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: 14px;
  background: var(--hairline);

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 18px;
    background: var(--surface-soft);
  }
}

.history-list {
  display: grid;
  gap: 10px;
  margin-top: 20px;
}

.history-item,
.empty-state {
  border: 1px solid var(--hairline);
  border-radius: 12px;
  background: var(--surface-soft);
}

.history-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;

  strong {
    display: block;
    font-size: 15px;
    font-weight: 600;
  }

  span {
    font-size: 13px;
  }
}

.history-duration {
  font-weight: 600;
  opacity: 0.65;
}

.empty-state {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
  padding: 24px;
}

.stat-value {
  font-weight: 700;
}

.muted {
  opacity: 0.4;
}

@media (max-width: 640px) {
  .history-view {
    padding-block: 28px;
  }

  .history-head,
  .history-summary {
    grid-template-columns: 1fr;
  }

  .history-summary {
    display: grid;
  }
}
</style>
