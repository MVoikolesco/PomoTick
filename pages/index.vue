<script setup lang="ts">
import BaseLayout from "~/layout/BaseLayout.vue";
import { useCountdownStore } from '~/stores/appStore';

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
</script>

<template>
  <ion-page>
    <BaseLayout>
      <template #content>
        <div class="home">
          <div class="counter-card">
            <CountdownTimer />
          </div>
        </div>
      </template>
    </BaseLayout>
  </ion-page>
</template>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>