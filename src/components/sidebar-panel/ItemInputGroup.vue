<template>
  <div class="p-inputgroup">
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
          style: { minWidth: '5em', maxWidth: '5em', borderRadius: '0', textAlign: 'center' }
        }
      }"
      :min="1"
    >
      <template #incrementbuttonicon><i class="pi pi-plus"></i></template>
      <template #decrementbuttonicon><i class="pi pi-minus"></i></template>
    </InputNumber>
    <Dropdown
      v-model="congratulationSound"
      :options="CongratulationSounds"
      optionGroupLabel="label"
      optionGroupChildren="items"
      optionLabel="label"
      placeholder="音效"
      :style="{ maxWidth: '30%', minWidth: '6rem' }"
      class="w-full md:w-14rem"
      @update:modelValue="updateCongratulationSound"
    />
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import { ItemService } from '@/services/ItemService';
import { CongratulationSounds, type AudioSetting } from '@/services/SettingService';

const props = defineProps(['modelValue']);

const itemService = inject<ItemService>('ItemService');

const label = ref(props.modelValue.label);
const weight = ref(props.modelValue.weight);
const congratulationSound = ref(props.modelValue.congratulationSound);
const focusMe = ref();

function updateLabel(value: Event) {
  const input = value.target as HTMLInputElement;
  const item = props.modelValue;
  if (input.value === item.label) return;

  label.value = input.value;
  item.label = input.value;
  itemService?.updateItem(item);
}

function updateWeight(value: Number) {
  const item = props.modelValue;
  if (value === item.weight) return;

  weight.value = value;
  item.weight = value;
  itemService?.updateItem(item);
}

function prefetchAudio(audioSetting: AudioSetting | undefined) {
  if (!audioSetting) return;
  if (audioSetting.value.startsWith('data:')) return;

  const src = `/sound/${audioSetting.value}`;
  const audio = new Audio(src);
  audio.preload = 'auto';
}

function updateCongratulationSound(value: AudioSetting) {
  const item = props.modelValue;

  // 比對音效的實際值，而不是物件參考
  if (value?.value === item.congratulationSound?.value) return;

  congratulationSound.value = value;
  item.congratulationSound = value;
  itemService?.updateItem(item);
  prefetchAudio(value); // prefetch when sound changes
}

function removeItem() {
  itemService?.removeItem(props.modelValue);
}

onMounted(() => {
  focusMe.value.$el.focus();
  prefetchAudio(props.modelValue.congratulationSound);
});
</script>

<style scoped></style>
