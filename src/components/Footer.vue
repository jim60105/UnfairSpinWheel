<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="fixed bottom-0 left-0 m-2 mb-1 text-xs overflow-hidden w-full">
    <a :href="url" target="_blank"
      >{{ version }}<i class="pi pi-github vertical-align-middle m-2"></i>AGPL-3.0 Licensed</a
    >
    / Copyright © 2023 Jim60105
  </footer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const hash: string | undefined = import.meta.env.VITE_GIT_HASH;
const baseUrl = 'https://github.com/jim60105/UnfairSpinWheel';
const version = ref('v.DEVELOP');
const url = ref(baseUrl);

onMounted(() => {
  if (hash) {
    version.value = 'v.' + hash.substring(0, 7).toUpperCase();
    url.value = `${baseUrl}/tree/${hash}`;
  }
});
</script>

<style scoped>
footer {
  font-family: 'Rock Salt';

  background-image: linear-gradient(to right, black 0%, transparent 50%);
}
</style>
