<script setup lang="ts">
import BaseLayout from "@/layout/BaseLayout.vue";
import CountdownTimer from "@/components/CountdownTimer.vue";
import { useTimerStore } from "@/stores/timeStore";

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
          <div class="action-buttons">
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
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-top: 20px;
}
.home > .counter-card {
  width: 80%;
  padding: 26px 20px;
  border-radius: 16px;
  background-color: #1C243F;

  display: flex;
  justify-content: center;

}
.home > .action-buttons {
  width: 80%;
  padding: 26px 20px;
  border-radius: 16px;
  background-color: #1C243F;

  display: flex;
}
</style>
