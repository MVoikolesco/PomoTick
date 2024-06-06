<script setup lang="ts">
import BaseLayout from "~/layout/BaseLayout.vue";

const appConfig = useAppConfig()

</script>

<template>
  <ion-page>
    <BaseLayout>
      <template #content>
        <div class="home">
          <div class="counter-card">
            <CountdownTimer :duration="60"/>
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