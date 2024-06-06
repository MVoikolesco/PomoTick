<script setup lang="ts">
import { useCountdownStore } from '~/stores/appStore';
import BaseLayout from "~/layout/BaseLayout.vue"

const store = useCountdownStore();

const startNextCycle = (time: number, status: string, value: boolean) => {
  store.setCycleCompletedIs(status, value)
  store.setCountdown(time);
};

store.$subscribe(() => {
  store.cycleCompleted == true
    ? store.cycleCompletedIs == 'work'
      ? startNextCycle(store.interval, 'interval', false)
      : startNextCycle(store.workTime, 'work', false)
    : null
}, { detached: true })

const logDebug = () => {
  console.log('debug')
}
</script>

<template>
  <div>
    <BaseLayout>
      <template #content>
        <div class="home">
          <div class="counter-card">
            <CountdownTimer />
          </div>
          <div>
            <button @click="logDebug">Test</button>
          </div>
        </div>
      </template>
    </BaseLayout>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  display: flex;
}
</style>