<template>
  <div class="p-inputgroup">
    <InputText v-model="label" :style="{ width: '40%' }"></InputText>
    <InputNumber
      v-model="weight"
      showButtons
      buttonLayout="horizontal"
      :step="1"
      decrementButtonClass="p-button-secondary border-noround"
      incrementButtonClass="p-button-secondary"
      mode="decimal"
      :pt="{
        input: {
          style: { width: '3em', borderRadius: '0', textAlign: 'center' }
        }
      }"
      :min="1"
    >
      <template #incrementbuttonicon><i class="pi pi-plus"></i></template>
      <template #decrementbuttonicon><i class="pi pi-minus"></i></template>
    </InputNumber>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:label', 'update:weight']);

let _label = ref(props.modelValue.label);
let _weight = ref(props.modelValue.weight);
const label = computed({
  get() {
    return _label.value;
  },
  set(value) {
    if (_label.value !== value) {
      _label.value = value;
      emit('update:label', _label.value);
    }
  }
});

const weight = computed({
  get() {
    return _weight.value;
  },
  set(value) {
    if (_weight.value !== value) {
      _weight.value = value;
      emit('update:weight', _weight.value);
    }
  }
});
</script>

<style scoped></style>
