<script setup lang="ts">
import { hourglassOutline, settingsOutline } from 'ionicons/icons';

</script>

<template>
  <div class="base-template">
    <slot name="content">Default Header</slot>
  </div>
</template>

<style scoped>
.base-template {
  width: 100%;
  height: 100%;
  background: linear-gradient(to left bottom, #2b314a, #1e283e)
}
</style>