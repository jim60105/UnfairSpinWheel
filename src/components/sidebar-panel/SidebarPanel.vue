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
      <h2><i class="pi pi-palette"></i> 自訂</h2>
    </template>
    <TabView
      :scrollable="true"
      :pt="{
        panelContainer: {
          class: 'p-0'
        }
      }"
    >
      <TabPanel header="📋 轉盤主題">
        <div class="col-12">
          <label for="dd-group" class="block mb-2">選擇一個轉盤主題</label>
          <div class="p-inputgroup">
            <Button
              icon="pi pi-trash"
              severity="danger"
              outlined
              aria-label="Remove group"
              @click="removeGroup"
              tabindex="-1"
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
        <div class="p-inputgroup col-12">
          <ToggleButton
            :modelValue="bulkEditMode"
            @change="toggleBulkEditMode"
            class="w-full border-round"
            onLabel="存檔"
            offLabel="批次編輯"
            onIcon="pi pi-check"
            offIcon="pi pi-pencil"
            :pt="{
              icon: {
                class: ['flex', 'flex-auto', 'flex-row-reverse']
              },
              label: {
                class: ['flex']
              }
            }"
          />
        </div>
        <template v-if="!bulkEditMode">
          <div
            v-focustrap="{
              disabled: Items?.length === 0
            }"
          >
            <ItemInputGroup
              :class="['col-12']"
              v-for="item in Items"
              :key="item._id"
              :modelValue="item"
            ></ItemInputGroup>
          </div>
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
        </template>
        <div v-else class="m-2">
          <Textarea v-model="textArea" />
          <small class="text-color-secondary"
            >此功能使用兩欄的 
            <a
              href="https://en.wikipedia.org/wiki/Comma-separated_values#Basic_rules"
              target="_blank"
              rel="noopener"
              >CSV 語法</a
            >
            。</small
          >
        </div>
      </TabPanel>
      <TabPanel header="⚙️ 設定">
        <div v-focustrap>
          <div class="col-12">
            <label for="dd-sound" class="block mb-2">指針音效</label>
            <div class="grid">
              <div class="col-8">
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
              <div class="col-4">
                <FileUpload
                  mode="basic"
                  accept="audio/*,.webm"
                  customUpload
                  auto
                  @uploader="customBase64Uploader($event, 'TickSound')"
                  :pt="{
                    chooseButton: {
                      class: 'w-full'
                    }
                  }"
                />
              </div>
            </div>
          </div>
          <div class="col-12">
            <label for="dd-sound" class="block mb-2">預設選中音效（會被個別選項設定取代）</label>
            <div class="grid">
              <div class="col-8">
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
              <div class="col-4">
                <FileUpload
                  mode="basic"
                  accept="audio/*,.webm"
                  customUpload
                  auto
                  @uploader="customBase64Uploader($event, 'CongratulationSound')"
                  :pt="{
                    chooseButton: {
                      class: 'w-full'
                    }
                  }"
                />
              </div>
            </div>
          </div>
          <div class="col-12">
            <label for="sl-labelLength" class="block mb-2">轉盤文字大小</label>
            <Slider
              v-model="LabelLength"
              inputId="sl-labelLength"
              :min="0.3"
              :max="0.75"
              :step="0.01"
            />
          </div>
          <div class="col-12">
            <label for="sl-donateThreshold" class="block mb-2">抖內門檻（超過才會觸發）</label>
            <div class="grid">
              <div class="col-12">
                <Slider
                  v-model="DonateThreshold"
                  inputId="sl-donateThreshold"
                  :min="30"
                  :max="3000"
                  :step="10"
                />
              </div>
              <div class="col-12">
                <InputNumber
                  v-model="DonateThreshold"
                  inputId="in-donateThreshold"
                  :min="30"
                  :max="3000"
                  :useGrouping="false"
                  class="w-full"
                />
              </div>
            </div>
          </div>
          <Divider />
          <div class="col-12">
            <label for="dd-toastLocation" class="block mb-2">通知位置</label>
            <Dropdown
              v-model="ToastLocation"
              :options="toastLocations"
              optionLabel="label"
              optionValue="value"
              inputId="dd-toastLocation"
              class="w-full"
            />
          </div>
          <div class="col-12">
            <label for="cb-focusMode" class="block mb-2">專注模式（移除所有轉盤外的元素）</label>
            <ToggleButton
              v-model="FocusMode"
              inputId="cb-focusMode"
              :pt="{
                root: {
                  class: 'w-full'
                }
              }"
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel header="🎨 Demo">
        <div class="col-12">
          <label for="dd-group" class="block mb-2">選擇一個 Demo 功能</label>
        </div>
        <Divider />
        <div class="col-12">
          <Button
            label="測試通知"
            icon="pi pi-bell"
            severity="help"
            @click="testToast"
            class="w-full"
          />
        </div>
        <div class="col-12 mb-3">
          <Button
            label="測試贊助通知"
            icon="pi pi-gift"
            severity="help"
            @click="testDonation"
            class="w-full"
          />
        </div>
      </TabPanel>
    </TabView>

    <Dialog v-model:visible="showRenameGroupDialog" modal dismissableMask header="Header">
      <template #container>
        <form class="surface-card border-round shadow-2 p-4 max-w-screen" @submit.prevent>
          <div class="text-900 font-medium mb-2 text-xl">Rename Group</div>
          <p class="min-w-min text-color-secondary">Change the name, change your luck.</p>
          <div class="flex mb-4 flex-column lg:flex-row">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-pencil" />
              <InputText
                autofocus
                v-model="renameGroupName"
                placeholder="New Group Name"
                :pt="{
                  root: { class: 'w-full' }
                }"
              />
            </span>
          </div>
          <Button
            type="submit"
            class="confirm-button"
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
        <form class="surface-card border-round shadow-2 p-4 max-w-screen" @submit.prevent>
          <div class="text-900 font-medium mb-2 text-xl">Add Group</div>
          <p class="min-w-min text-color-secondary">What should we name this new spinner?</p>
          <div class="flex mb-4 flex-column lg:flex-row">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-plus" />
              <InputText
                autofocus
                v-model="addGroupName"
                placeholder="New Group Name"
                :pt="{
                  root: { class: 'w-full' }
                }"
              />
            </span>
          </div>
          <Button
            type="submit"
            class="confirm-button"
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
import type { FileUploadUploaderEvent } from 'primevue/fileupload';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ItemService, GroupLabel, GroupLabels, Items } from '@/services/ItemService';
import { VisibleSidebar } from '@/services/SidebarService';
import {
  TickSound,
  TickSounds,
  LabelLength,
  DonateThreshold,
  CongratulationSound,
  CongratulationSounds,
  ToastLocation,
  FocusMode,
} from '@/services/SettingService';
import ItemInputGroup from '@/components/sidebar-panel/ItemInputGroup.vue';
import type { IItem } from '@/interface/IItem';
import { StringHelper } from '@/helpers/StringHelper';

const itemService = inject<ItemService>('ItemService')!;
const spinWheelRef = inject<any>('spinWheelRef');
const toast = useToast();

const toastLocations = [
  { label: '右上', value: 'top-right' },
  { label: '左上', value: 'top-left' },
  { label: '右下', value: 'bottom-right' },
  { label: '左下', value: 'bottom-left' }
];

watch(ToastLocation, (newLocation) => {
  // Show sample toast in the new location
  toast.add({
    severity: 'info',
    summary: '位置預覽',
    detail: `通知將會顯示在${toastLocations.find(l => l.value === newLocation)?.label}`,
    life: 10000
  });
});

// 測試通知
const testToast = () => {
  toast.add({
    severity: 'success',
    summary: '測試通知',
    detail: '這是一個測試通知訊息！',
    life: 3000
  });
};

// 測試贊助
const testDonation = () => {
  if (!spinWheelRef?.value) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '轉盤尚未初始化',
      life: 3000
    });
    return;
  }

  spinWheelRef.value.handleDonation({
    donate_id: 'test-' + Date.now(),
    name: '測試贊助者',
    amount: 100,
    message: '這是測試贊助！',
    timestamp: Date.now(),
    platforma: '蛋蛋子PAY'
  });
};

const addButton = ref();
const confirm = useConfirm();
const bulkEditMode = ref(false);
const textArea = ref('');

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
      icon: 'pi pi-exclamation-triangle text-yellow-400',
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

const customBase64Uploader = async (
  event: FileUploadUploaderEvent,
  mode: 'TickSound' | 'CongratulationSound'
) => {
  const file = Array.isArray(event.files) ? event.files[0] : event.files;
  const reader = new FileReader();
  let blob = await fetch(window.URL.createObjectURL(file)).then((r) => r.blob()); //blob:url

  reader.readAsDataURL(blob);

  reader.onloadend = function () {
    const base64data = reader.result;
    console.debug('Sound uploaded', base64data);
    if (mode === 'TickSound') {
      TickSound.value = {
        label: file.name,
        value: base64data as string
      };
    } else if (mode === 'CongratulationSound') {
      CongratulationSound.value = {
        label: file.name,
        value: base64data as string
      };
    }
  };
};

const toggleBulkEditMode = async ($event: Event) => {
  bulkEditMode.value = !bulkEditMode.value;
  await changeBulkEditMode();
};

const changeBulkEditMode = async () => {
  if (bulkEditMode.value) {
    textArea.value = badCSV ?? StringHelper.csvStringify();
    badCSV = undefined;
    console.debug('Bulk edit mode on');
  } else {
    console.debug('Bulk edit mode off');

    let items: IItem[] = [];
    try {
      items = (StringHelper.csvParse(textArea.value, true) as Array<{
        label: string;
        weight: number;
        congratulationSound?: string;
      }>).map(({ label, weight, congratulationSound }) => {
        const item: IItem = {
          label: label,
          weight: +weight < 1 ? 1 : +weight,
          group: GroupLabel.value!,
          order: -1
        };
        
        // 處理第三欄音效
        if (congratulationSound?.trim()) {
          const found = CongratulationSounds.value
            .flatMap(g => g.items)
            .find(s => s.value === congratulationSound.trim());
          
          item.congratulationSound = found || {
            label: congratulationSound.trim(),
            value: congratulationSound.trim()
          };
        } else {
          // 若第三欄為空的，使用預設音效
          if (CongratulationSound.value) {
            item.congratulationSound = CongratulationSound.value;
          }
        }
        
        return item;
      });

      toast.removeAllGroups();
    } catch (error) {
      const e = error as Error;
      console.error('Error parsing items from textarea', e);
      toast.add({
        severity: 'error',
        summary: 'CSV parsed failed!',
        detail: e.message
      });

      badCSV = textArea.value;
      bulkEditMode.value = true;
      return;
    }
    console.debug('Items parsed from textarea', items);

    await itemService.cleanUpGroup(GroupLabel.value!);
    await itemService.addItems(items);
  }
};

let badCSV: string | undefined = undefined;
onMounted(() => {
  watch(GroupLabel, () => {
    renameGroupName.value = GroupLabel.value;
  });
});
</script>

<style scoped>
.confirm-button {
  float: right;
}

textarea {
  width: -webkit-fill-available;
  resize: vertical;
  min-height: 50vh;
  font-size: larger;
}

h2 {
  font-weight: 400;
}
</style>
