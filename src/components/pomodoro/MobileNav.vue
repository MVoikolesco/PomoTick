<script setup lang="ts">
import { useTimerStore } from '@/stores/timeStore';

const store = useTimerStore();
</script>

<template>
  <nav class="mobile-nav" aria-label="Navegacao mobile">
    <button type="button" :class="{ active: store.activeView === 'timer' }" @click="store.setActiveView('timer')">Timer</button>
    <button type="button" :class="{ active: store.activeView === 'history' }" @click="store.setActiveView('history')">Historico</button>
  </nav>
</template>

<style scoped lang="scss">
.mobile-nav {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 4px;
  padding: 8px 20px;
  border-bottom: 1px solid var(--hairline);
  background: color-mix(in srgb, var(--surface) 30%, transparent);
  backdrop-filter: blur(12px);

  button {
    flex: 1;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    opacity: 0.55;

    &.active {
      background: var(--surface-soft);
      opacity: 1;
    }
  }
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}
</style>
