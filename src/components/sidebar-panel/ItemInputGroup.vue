<template>
  <InputGroup>
    <Button
      icon="pi pi-trash"
      severity="danger"
      outlined
      aria-label="Remove"
      @click="removeItem"
      tabindex="-1"
    />
    <InputText
      ref="focusMe"
      :model-value="label"
      @blur="updateLabel($event)"
      @submit="updateLabel($event)"
    ></InputText>
    <InputNumber
      v-if="!Fairmode"
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
      <template #incrementicon><i class="pi pi-plus"></i></template>
      <template #decrementicon><i class="pi pi-minus"></i></template>
    </InputNumber>
  </InputGroup>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { ItemService } from '@/services/ItemService';
import { Fairmode } from '@/services/SettingService';

const props = defineProps(['modelValue', 'autoFocus']);

const itemService = inject<ItemService>('ItemService');

const label = ref(props.modelValue.label);
const weight = ref(props.modelValue.weight);
const focusMe = ref();

function updateLabel(value: Event) {
  const input = value.target as HTMLInputElement;
  const item = props.modelValue;
  if (input.value === item.label) return;

  label.value = input.value;
  item.label = input.value;
  itemService?.updateItem(item);
}

function updateWeight(value: number) {
  const item = props.modelValue;
  if (value === item.weight) return;

  weight.value = value;
  item.weight = value;
  itemService?.updateItem(item);
}

function removeItem() {
  itemService?.removeItem(props.modelValue);
}

// Only an item the user just added takes focus. Focusing on every mount would
// let the last item of the list win whenever the panel renders, and the browser
// would scroll it into view — landing the panel at its bottom.
//
// The flag always arrives after this component is mounted: the parent only
// learns the new item's id once the database has assigned one, by which time
// the list has already rendered. So watch it rather than reading it on mount.
watch(
  () => props.autoFocus,
  (autoFocus) => {
    if (autoFocus) focusMe.value.$el.focus();
  },
  { flush: 'post' }
);
</script>

<style scoped></style>
