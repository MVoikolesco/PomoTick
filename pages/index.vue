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
  background-color: #292f49;

  display: flex;
  justify-content: center;

  -webkit-box-shadow: -11px 17px 13px 8px rgba(11,21,41,1);
  -moz-box-shadow: -11px 17px 13px 8px rgba(11,21,41,1);
  box-shadow: -11px 17px 13px 8px rgba(11,21,41,1);
}
.home > .action-buttons {
  width: 80%;
  padding: 26px 20px;
  border-radius: 16px;
  background-color: #3c4267;

  display: flex;

  -webkit-box-shadow: -13px 10px 17px 8px rgba(35,43,68,1);
  -moz-box-shadow: -13px 10px 17px 8px rgba(35,43,68,1);
  box-shadow: -13px 10px 17px 8px rgba(35,43,68,1);
}
</style>