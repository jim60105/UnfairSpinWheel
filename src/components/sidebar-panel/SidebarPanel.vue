<template>
  <Sidebar
    v-model:visible="VisibleSidebar"
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
    <TabView
      :scrollable="true"
      :pt="{
        panelContainer: {
          class: 'p-0'
        }
      }"
    >
      <TabPanel header="Items">
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
              :model-value="GroupLabel"
              inputId="group"
              editable
              :options="GroupLabels"
              class="w-full"
              @update:model-value="itemService.changeGroupLabel"
            />
            <label for="group">Select a Group</label>
          </div>
        </div>
        <Divider />
        <ItemInputGroup
          :class="['col-12']"
          v-for="item in Items"
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
      </TabPanel>
      <TabPanel header="Settings">
        <div class="col-12 mt-4">
          <div class="p-float-label">
            <Dropdown
              v-model="TickSound"
              inputId="dd-sound"
              :options="TickSounds"
              optionLabel="label"
              optionGroupLabel="label"
              optionGroupChildren="items"
              class="w-full"
            />
            <label for="dd-sound">Select a Sound</label>
          </div>
        </div>
      </TabPanel>
    </TabView>
  </Sidebar>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { ItemService, GroupLabel, GroupLabels, Items } from '@/services/ItemService';
import { VisibleSidebar } from '@/services/SidebarService';
import { TickSound, TickSounds } from '@/services/SettingService';
import ItemInputGroup from '@/components/sidebar-panel/ItemInputGroup.vue';

const itemService = inject<ItemService>('ItemService')!;

const addButton = ref();
const confirm = useConfirm();

async function addItem() {
  await itemService.addItem();
  setTimeout(() => {
    addButton.value.$el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

const removeGroup = ($event: Event) => {
  if ($event.target instanceof HTMLElement)
    confirm.require({
      target: $event.target || undefined,
      message: 'Are you sure you want to delete this group?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await itemService.removeGroup(GroupLabel.value!);
      }
    });
};
</script>

<style scoped></style>
