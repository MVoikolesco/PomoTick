<script setup lang="ts">
import { hourglassOutline, settingsOutline } from 'ionicons/icons';

</script>

<template>
  <div class="base-template">
    <slot name="content">Default Header</slot>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="search" href="/settings">
            <ion-icon :icon="settingsOutline" />
            <ion-label>Settings</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="index" href="/">
            <ion-icon :icon="hourglassOutline" />
            <ion-label>Dashboard</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </div>
</template>

<style scoped>
.base-template {
  width: 100%;
  height: 100%;
  background: linear-gradient(to left bottom, #2b314a, #1e283e)
}
</style>