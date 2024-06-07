<script setup lang="ts">
import { useTimerStore } from "~/stores/timeStore";
import BaseLayout from "~/layout/BaseLayout.vue"

const store = useTimerStore();

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
            <button @click="() => store.startTimer()">Start Timer</button>
            <button @click="() => store.pauseTimer()">Pause Timer</button>
            <button @click="() => store.resumeTimer()">Resume Timer</button>
            <button @click="() => store.stopTimer()">Stop Timer</button>
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