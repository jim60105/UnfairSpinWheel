<template>
  <div class="p-inputgroup">
    <Button icon="pi pi-trash" severity="danger" outlined aria-label="Remove" @click="removeItem" />
    <InputText
      :modelValue="label"
      @blur="updateLabel($event)"
      @submit="updateLabel($event)"
    ></InputText>
    <InputNumber
      :modelValue="weight"
      @update:modelValue="updateWeight($event)"
      @change="updateWeight($event)"
      showButtons
      :step="1"
      decrementButtonClass="p-button-secondary"
      incrementButtonClass="p-button-secondary"
      mode="decimal"
      :style="{
        maxWidth: 'fit-content'
      }"
      :pt="{
        input: {
          style: { minWidth: '4em', maxWidth: '4em', borderRadius: '0', textAlign: 'center' }
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
import { ItemService } from '@/services/ItemService';

const props = defineProps(['modelValue']);

const itemService = inject<ItemService>('ItemService');

const label = ref(props.modelValue.label);
const weight = ref(props.modelValue.weight);

function updateLabel(value: Event) {
  const input = value.target as HTMLInputElement;
  label.value = input.value;
  const item = props.modelValue;
  item.label = input.value;
  itemService?.updateItem(item);
}

function updateWeight(value: Number) {
  weight.value = value;
  const item = props.modelValue;
  item.weight = value;
  itemService?.updateItem(item);
}

function removeItem() {
  itemService?.removeItem(props.modelValue);
}
</script>

<style scoped></style>
