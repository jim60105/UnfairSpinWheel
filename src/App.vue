<template>
  <div class="header grid">
    <h1 class="flex col-12 justify-content-center align-items-center mb-0">Unfair Spin Wheel</h1>
    <p class="flex col-12 justify-content-center align-items-center mt-0">
      The world is unfair, and so is our spin wheel.
    </p>
  </div>
  <div class="container mx-auto grid justify-content-center align-items-start mt-3">
    <div class="spin-container flex md:col-6 sm:col-12">
      <SpinWheel></SpinWheel>
    </div>
    <div class="grid md:col-6 sm:col-12">
      <div class="p-inputgroup col-12">
        <Dropdown
          v-model="groupLabel"
          editable
          :options="groupLabels"
          placeholder="Select a Group"
          class="w-full md:w-14rem"
          @update:model-value="changeGroupLabel"
        />
      </div>
      <ItemInputGroup
        :class="['col-12']"
        v-for="item in items"
        :key="item._id"
        :modelValue="item"
      ></ItemInputGroup>
      <div class="p-inputgroup col-12">
        <Button
          ref="addButton"
          class="w-full"
          icon="pi pi-plus"
          aria-label="Add item"
          @click="addItem"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemInputGroup from '@/components/ItemInputGroup.vue';
import type { IItem } from '@/models/Item';
import { ref, inject, onMounted } from 'vue';
import type { DbService } from './services/DbService';

const dbService = inject<DbService>('DbService')!;

const groupLabel = ref();
const groupLabels = ref();
const items = ref<PouchDB.Core.ExistingDocument<IItem>[]>();
const addButton = ref();

async function addItem() {
  await dbService.addItem({
    group: groupLabel.value,
    label: 'New Item',
    weight: 1,
    order: (await dbService.getItemCount()) ?? 0
  });
  setTimeout(() => {
    addButton.value.$el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

async function changeGroupLabel(newGroupLabel: string) {
  if (newGroupLabel !== dbService.groupLabel) {
    dbService.groupLabel = newGroupLabel;
    dbService.syncEvent.dispatchEvent(new Event('change'));
  }
}

async function syncDbData() {
  groupLabels.value = await dbService.getGroupLabels();
  items.value = await dbService.getItems();
}

onMounted(async () => {
  const firstItem = await dbService.getFirstItem();
  groupLabel.value = firstItem.group;

  dbService.syncEvent.addEventListener('change', syncDbData);
  await syncDbData();
});
</script>

<style>
.container {
  max-width: 80vw;
}
.spin-container {
  min-height: 75vh;
}
</style>
