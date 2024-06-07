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

