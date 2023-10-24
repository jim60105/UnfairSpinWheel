<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="fixed bottom-0 left-0 m-2 text-xs z-2 overflow-hidden w-full">
    <a href="https://github.com/jim60105/UnfairSpinWheel" target="_blank"
      >v.{{ version }}<i class="pi pi-github vertical-align-middle m-2"></i>AGPL-3.0 Licensed</a
    >
    / Copyright © 2023 jim60105
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const version = ref('DEVELOP');
</script>

<style scoped>
footer {
  font-family: 'Rock Salt';

  background-image: linear-gradient(to right, black 0%, transparent 100%);
}
</style>
