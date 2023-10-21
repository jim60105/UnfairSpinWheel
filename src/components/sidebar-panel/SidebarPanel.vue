<template>
  <Sidebar
    v-model:visible="sidebarService.visibleSidebar.value"
    position="right"
    :showCloseIcon="false"
    :pt="{
      root: {
        style: { width: '500px' }
      },
      header: {
        class: 'justify-content-start pb-0'
      }
    }"
  >
    <template #header>
      <h2><i class="pi pi-palette"></i> Customize</h2>
    </template>
    <ScrollPanel
      class="h-full"
      :pt="{
        content: {
          class: 'grid'
        }
      }"
    >
      <div class="p-inputgroup col-12 mt-4">
        <Button
          icon="pi pi-trash"
          severity="danger"
          outlined
          aria-label="Remove"
          @click="removeGroup"
        />
        <div class="p-float-label">
          <Dropdown
            :model-value="itemService.groupLabel.value"
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
    </ScrollPanel>
  </Sidebar>
</template>

<script setup lang="ts">
import ItemInputGroup from '@/components/sidebar-panel/ItemInputGroup.vue';
import { useConfirm } from 'primevue/useconfirm';
import { inject, onMounted, onUnmounted, ref } from 'vue';
import type { IItem } from '@/models/Item';
import type { ItemService } from '@/services/ItemService';
import type { SidebarService } from '@/services/SidebarService';

const itemService = inject<ItemService>('ItemService')!;
const sidebarService = inject<SidebarService>('SidebarService')!;

const addButton = ref();
const confirm = useConfirm();
const groupLabels = ref();
const items = ref<PouchDB.Core.ExistingDocument<IItem>[]>();

async function syncDbData() {
  groupLabels.value = await itemService.getGroupLabels();
  items.value = await itemService.getItems();
}

async function addItem() {
  await itemService.addItem({
    group: itemService.groupLabel.value ?? 'New Group',
    label: 'New Item',
    weight: 1,
    order: (await itemService.getItemCount()) ?? 0
  });
  setTimeout(() => {
    addButton.value.$el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

async function changeGroupLabel(newGroupLabel: string) {
  if (newGroupLabel !== itemService.groupLabel.value) {
    itemService.groupLabel.value = newGroupLabel;
    itemService.syncEvent.dispatchEvent(new Event('change'));
  }
}

const removeGroup = ($event: Event) => {
  if ($event.target instanceof HTMLElement)
    confirm.require({
      target: $event.target || undefined,
      message: 'Are you sure you want to delete this group?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await itemService.removeGroup(itemService.groupLabel.value!);
        await itemService.resetGroupLabel();
        itemService.syncEvent.dispatchEvent(new Event('change'));
      }
    });
};

onMounted(async () => {
  itemService.syncEvent.addEventListener('change', syncDbData);
  await syncDbData();
});

onUnmounted(() => {
  itemService.syncEvent.removeEventListener('change', syncDbData);
});
</script>

<style scoped></style>
