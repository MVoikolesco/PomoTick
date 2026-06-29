<script setup lang="ts">
import MoonIcon from '@/components/icons/MoonIcon.vue';
import SettingsIcon from '@/components/icons/SettingsIcon.vue';
import SunIcon from '@/components/icons/SunIcon.vue';
import { useTimerStore } from '@/stores/timeStore';

const store = useTimerStore();
</script>

<template>
  <header class="top-bar">
    <button type="button" class="brand" @click="store.setActiveView('timer')">Foco.</button>

    <nav class="top-nav" aria-label="Navegacao principal">
      <button type="button" :class="{ active: store.activeView === 'timer' }" @click="store.setActiveView('timer')">Timer</button>
      <button type="button" :class="{ active: store.activeView === 'history' }" @click="store.setActiveView('history')">Historico</button>
    </nav>

    <div class="header-actions">
      <button
        type="button"
        class="icon-button"
        :aria-label="store.darkMode ? 'Ativar tema claro' : 'Ativar tema escuro'"
        @click="store.setDarkMode(!store.darkMode)"
      >
        <SunIcon v-if="store.darkMode" />
        <MoonIcon v-else />
      </button>

      <button type="button" class="icon-button" aria-label="Configuracoes" @click="store.showSettings = true">
        <SettingsIcon />
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.top-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--hairline);
  background: color-mix(in srgb, var(--surface) 30%, transparent);
  backdrop-filter: blur(12px);
}

.brand {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0;
  opacity: 0.9;
}

.top-nav {
  display: none;
  gap: 24px;

  button {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.6;
    transition: opacity 180ms ease;

    &:hover,
    &.active {
      opacity: 1;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-button {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 180ms ease, transform 180ms ease;

  &:hover {
    opacity: 1;
  }

  &:active {
    transform: scale(0.95);
  }
}

@media (min-width: 768px) {
  .top-nav {
    display: flex;
  }
}

@media (max-width: 640px) {
  .top-bar {
    padding-inline: 20px;
  }
}
</style>
