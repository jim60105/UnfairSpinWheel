<template>
  <div class="p-inputgroup">
    <InputText
      :modelValue="label"
      @blur="updateLabel($event)"
      @submit="updateLabel($event)"
      :style="{ width: '40%' }"
    ></InputText>
    <InputNumber
      :modelValue="weight"
      @update:modelValue="updateWeight($event)"
      @change="updateWeight($event)"
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
import { inject, ref } from 'vue';
import { DbService } from '@/services/DbService';

const props = defineProps(['modelValue']);

const dbService = inject<DbService>('DbService')!;

const label = ref(props.modelValue.label);
const weight = ref(props.modelValue.weight);

function updateLabel(value: Event) {
  const input = value.target as HTMLInputElement;
  label.value = input.value;
  const item = props.modelValue;
  item.label = input.value;
  dbService.updateItem(item);
}

function updateWeight(value: Number) {
  weight.value = value;
  const item = props.modelValue;
  item.weight = value;
  dbService.updateItem(item);
}
</script>

<style scoped></style>
