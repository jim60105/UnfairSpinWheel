<template>
  <Sidebar
    v-model:visible="VisibleSidebar"
    position="right"
    :pt="{
      root: {
        style: { width: '500px', maxWidth: '100vw' }
      },
      header: {
        class: 'justify-content-between pb-0'
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
        <div class="col-12">
          <label for="dd-group" class="block mb-2">Select a Group</label>
          <div class="p-inputgroup">
            <Button
              icon="pi pi-trash"
              severity="danger"
              outlined
              aria-label="Remove group"
              @click="removeGroup"
            />
            <Dropdown
              :model-value="GroupLabel"
              inputId="dd-group"
              :options="GroupLabels"
              @update:model-value="itemService.changeGroupLabel"
            />
            <Button
              icon="pi pi-pencil"
              severity="info"
              outlined
              aria-label="Rename group"
              @click="showRenameGroupDialog = true"
            />
            <Button
              icon="pi pi-plus"
              severity="success"
              outlined
              aria-label="Add group"
              @click="showAddGroupDialog = true"
            />
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
            severity="success"
            outlined
            aria-label="Add item"
            @click="addItem"
          />
        </div>
      </TabPanel>
      <TabPanel header="Settings">
        <div class="col-12">
          <label for="dd-sound" class="block mb-2">Select a Ticking Sound</label>
          <Dropdown
            v-model="TickSound"
            inputId="dd-sound"
            :options="TickSounds"
            optionLabel="label"
            optionGroupLabel="label"
            optionGroupChildren="items"
            class="w-full"
          />
        </div>
        <div class="col-12">
          <label for="dd-sound" class="block mb-2">Select a Congratulation Sound</label>
          <Dropdown
            v-model="CongratulationSound"
            inputId="dd-sound"
            :options="CongratulationSounds"
            optionLabel="label"
            optionGroupLabel="label"
            optionGroupChildren="items"
            class="w-full"
          />
        </div>
        <div class="col-12">
          <label for="sl-labelLength" class="block mb-2">Item Label Length</label>
          <Slider
            v-model="LabelLength"
            inputId="sl-labelLength"
            :min="0.3"
            :max="0.75"
            :step="0.01"
          />
        </div>
      </TabPanel>
    </TabView>

    <Dialog v-model:visible="showRenameGroupDialog" modal dismissableMask header="Header">
      <template #container>
        <form class="surface-card border-round shadow-2 p-4 max-w-screen" onsubmit="return false;">
          <div class="text-900 font-medium mb-2 text-xl">Rename Group</div>
          <div class="flex mb-4 flex-column lg:flex-row">
            <span class="p-input-icon-left">
              <i class="pi pi-pencil" />
              <InputText
                v-model="renameGroupName"
                placeholder="New Group Name"
                class="w-20rem max-w-full"
              />
            </span>
          </div>
          <Button
            type="submit"
            class="confirmButton"
            icon="pi pi-check"
            label="Ok"
            severity="success"
            @click="renameGroup"
          ></Button>
        </form>
      </template>
    </Dialog>
    <Dialog v-model:visible="showAddGroupDialog" modal dismissableMask header="Header">
      <template #container>
        <form class="surface-card border-round shadow-2 p-4 max-w-screen" onsubmit="return false;">
          <div class="text-900 font-medium mb-2 text-xl">Add Group</div>
          <div class="flex mb-4 flex-column lg:flex-row">
            <span class="p-input-icon-left">
              <i class="pi pi-pencil" />
              <InputText
                v-model="addGroupName"
                placeholder="New Group Name"
                class="w-20rem max-w-full"
              />
            </span>
          </div>
          <Button
            type="submit"
            class="confirmButton"
            icon="pi pi-check"
            label="Ok"
            severity="success"
            @click="addGroup"
          ></Button>
        </form>
      </template>
    </Dialog>
  </Sidebar>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { ItemService, GroupLabel, GroupLabels, Items } from '@/services/ItemService';
import { VisibleSidebar } from '@/services/SidebarService';
import {
  TickSound,
  TickSounds,
  LabelLength,
  CongratulationSound,
  CongratulationSounds
} from '@/services/SettingService';
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

const showRenameGroupDialog = ref(false);
const renameGroupName = ref(GroupLabel.value);
const renameGroup = async () => {
  await itemService.renameGroup(GroupLabel.value!, renameGroupName.value!);
  showRenameGroupDialog.value = false;
};

const showAddGroupDialog = ref(false);
const addGroupName = ref('');
const addGroup = async () => {
  await itemService.changeGroupLabel(addGroupName.value);
  await itemService.addItem();
  GroupLabels.value = await itemService.getGroupLabels();
  showAddGroupDialog.value = false;
  addGroupName.value = '';
};

onMounted(() => {
  watch(GroupLabel, () => {
    renameGroupName.value = GroupLabel.value;
  });
});
</script>

<style scoped>
.confirmButton {
  float: right;
}
</style>
