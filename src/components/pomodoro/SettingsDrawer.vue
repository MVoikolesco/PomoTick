<script setup lang="ts">
import { reactive, watch } from 'vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import { usePomodoroTheme } from '@/composables/usePomodoroTheme';
import { useTimerStore } from '@/stores/timeStore';

const store = useTimerStore();
const { currentColor } = usePomodoroTheme();

const settingsDraft = reactive({ ...store.settings });

const syncSettingsDraft = () => {
  Object.assign(settingsDraft, store.settings);
};

const saveSettings = () => {
  store.setSettings({ ...settingsDraft });
  store.showSettings = false;
};

const requestNotifications = async (enabled: boolean) => {
  if (!enabled) {
    settingsDraft.notificationsEnabled = false;
    return;
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    settingsDraft.notificationsEnabled = false;
    return;
  }

  if (Notification.permission === 'granted') {
    settingsDraft.notificationsEnabled = true;
    return;
  }

  const permission = await Notification.requestPermission();
  settingsDraft.notificationsEnabled = permission === 'granted';
};

watch(
  () => store.showSettings,
  (isOpen) => {
    if (isOpen) {
      syncSettingsDraft();
    }
  },
);
</script>

<template>
  <transition name="modal">
    <div v-if="store.showSettings" class="modal-backdrop" @click.self="store.showSettings = false">
      <section class="settings-panel" aria-label="Configuracoes do Pomodoro">
        <div class="settings-head">
          <div>
            <span class="eyebrow">Configuracoes</span>
            <h2>Ritmo do timer</h2>
          </div>
          <button type="button" class="icon-button" aria-label="Fechar configuracoes" @click="store.showSettings = false">
            <CloseIcon />
          </button>
        </div>

        <div class="settings-grid">
          <label>
            <span>Foco</span>
            <input v-model.number="settingsDraft.focusMinutes" type="number" min="1" max="180" />
          </label>
          <label>
            <span>Pausa curta</span>
            <input v-model.number="settingsDraft.shortMinutes" type="number" min="1" max="60" />
          </label>
          <label>
            <span>Pausa longa</span>
            <input v-model.number="settingsDraft.longMinutes" type="number" min="1" max="120" />
          </label>
          <label>
            <span>Ciclos</span>
            <input v-model.number="settingsDraft.cyclesBeforeLong" type="number" min="2" max="12" />
          </label>
        </div>

        <div class="toggle-list">
          <label class="toggle-row">
            <span>
              <strong>Auto iniciar pausas</strong>
              <em>Comeca a pausa ao terminar um foco.</em>
            </span>
            <input v-model="settingsDraft.autoStartBreaks" type="checkbox" />
          </label>
          <label class="toggle-row">
            <span>
              <strong>Auto iniciar foco</strong>
              <em>Volta ao foco ao terminar uma pausa.</em>
            </span>
            <input v-model="settingsDraft.autoStartFocus" type="checkbox" />
          </label>
          <label class="toggle-row">
            <span>
              <strong>Som</strong>
              <em>Toca um aviso curto ao concluir.</em>
            </span>
            <input v-model="settingsDraft.soundEnabled" type="checkbox" />
          </label>
          <label class="toggle-row">
            <span>
              <strong>Notificacoes</strong>
              <em>Usa permissao do navegador.</em>
            </span>
            <input
              :checked="settingsDraft.notificationsEnabled"
              type="checkbox"
              @change="requestNotifications(($event.target as HTMLInputElement).checked)"
            />
          </label>
        </div>

        <div class="settings-actions">
          <button type="button" class="ghost-control" @click="syncSettingsDraft">Restaurar</button>
          <button type="button" class="primary-control" :style="{ backgroundColor: currentColor }" @click="saveSettings">Salvar</button>
        </div>
      </section>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(8px);
}

.settings-panel {
  width: min(440px, 100%);
  height: 100%;
  overflow-y: auto;
  border-left: 1px solid var(--hairline);
  background: var(--surface);
  padding: 28px;
  box-shadow: -24px 0 48px rgba(0, 0, 0, 0.2);
}

.settings-head,
.settings-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.settings-head {
  margin-bottom: 28px;

  h2 {
    font-size: 28px;
    line-height: 1.1;
    letter-spacing: 0;
  }
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

.eyebrow {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.45;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  label {
    display: grid;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
  }

  input {
    width: 100%;
    border: 1px solid var(--hairline);
    border-radius: 10px;
    background: var(--field);
    padding: 12px;
    outline: none;
  }
}

.toggle-list {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 0;
  border-bottom: 1px solid var(--hairline);

  span {
    display: grid;
    gap: 4px;
  }

  strong {
    font-size: 14px;
  }

  em {
    font-size: 13px;
    font-style: normal;
    opacity: 0.45;
  }

  input {
    width: 42px;
    height: 24px;
    flex: 0 0 auto;
    accent-color: #7d9464;
  }
}

.settings-actions {
  margin-top: 28px;
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .settings-panel,
.modal-leave-to .settings-panel {
  transform: translateX(24px);
}

@media (max-width: 640px) {
  .settings-panel {
    padding: 24px 20px;
  }
}
</style>
