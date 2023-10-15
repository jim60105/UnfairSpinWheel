<template>
  <ConfirmPopup></ConfirmPopup>
  <div class="header grid">
    <h1 class="flex col-12 justify-content-center align-items-center mb-0">Unfair Spin Wheel</h1>
    <p class="flex col-12 justify-content-center align-items-center mt-0">
      The world is unfair, and so is our spin wheel.
    </p>
  </div>
  <div class="container mx-auto grid justify-content-center align-items-start mt-3">
    <div class="spin-container flex lg:col-7 md:col-12">
      <SpinWheel></SpinWheel>
    </div>
    <div class="grid lg:col-5 md:col-12">
      <div class="p-inputgroup col-12">
        <Button
          icon="pi pi-trash"
          severity="danger"
          outlined
          aria-label="Remove"
          @click="removeGroup"
        />
        <div class="p-float-label">
          <Dropdown
            v-model="groupLabel"
            inputId="group"
            editable
            :options="groupLabels"
            class="w-full md:w-14rem"
            @update:model-value="changeGroupLabel"
          />
          <label for="group">Select a Group</label>
        </div>
      </div>
      <Divider />
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
import { ref, inject, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import ItemInputGroup from '@/components/ItemInputGroup.vue';
import type { IItem } from '@/models/Item';
import type { DbService } from '@/services/DbService';

const dbService = inject<DbService>('DbService')!;

const groupLabel = ref();
const groupLabels = ref();
const items = ref<PouchDB.Core.ExistingDocument<IItem>[]>();
const addButton = ref();

const confirm = useConfirm();

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

const removeGroup = ($event: Event) => {
  if ($event.target instanceof HTMLElement)
    confirm.require({
      target: $event.target || undefined,
      message: 'Are you sure you want to delete this group?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await dbService.removeGroup(groupLabel.value);
        const firstItem = await dbService.getFirstItem();
        dbService.groupLabel = firstItem.group;
        groupLabel.value = firstItem.group;
      }
    });
};

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
.header {
  font-family: 'Rock Salt';
}
.container {
  max-width: 80vw;
}
</style>
