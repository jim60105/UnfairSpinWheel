<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const text = ref()
const toast = useToast()
const greet = () => {
  toast.add({
    severity: 'info',
    summary: 'Hello',
    detail: text.value
  })
}
</script>

<template>
  <Toast></Toast>
  <div class="container">
    <span class="p-float-label">
      <InputText id="txt" type="text" v-model="text" />
      <label for="txt">Text</label>
    </span>
    <Button label="Greet" @click="greet" icon="pi pi-user"></Button>
  </div>
</template>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
