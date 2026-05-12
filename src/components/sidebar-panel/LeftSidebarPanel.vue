<template>
  <Sidebar
    v-model:visible="VisibleLeftSidebar"
    position="left"
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
      <h2><i class="pi pi-history"></i> 紀錄</h2>
    </template>

    <TabView
      :scrollable="true"
      :pt="{
        panelContainer: {
          class: 'p-0'
        }
      }"
    >
      <TabPanel header="🎡 轉盤紀錄">
        <div class="flex gap-2 col-12 pb-0">
          <Button
            label="匯出 TSV"
            icon="pi pi-download"
            severity="info"
            outlined
            class="flex-1"
            @click="exportTSV"
          />
          <Button
            label="清除紀錄"
            icon="pi pi-trash"
            severity="danger"
            outlined
            class="flex-1"
            @click="confirmClear"
          />
        </div>
        <Divider />
        <div v-if="SpinRecords.length === 0" class="col-12 text-color-secondary text-center py-4">
          尚無紀錄
        </div>
        <div v-else class="col-12 p-0">
          <div
            v-for="record in SpinRecords"
            :key="record.id"
            class="record-row p-3 border-bottom-1 border-600"
          >
            <div class="flex justify-content-between align-items-start">
              <span class="text-lg font-medium">{{ record.label }}</span>
              <span class="text-sm text-color-secondary white-space-nowrap ml-2">
                {{ formatTime(record.timestamp) }}
              </span>
            </div>
            <div v-if="record.donorName" class="text-sm text-color-secondary mt-1">
              <i class="pi pi-gift mr-1"></i>
              {{ record.donorName }}
              <span v-if="record.amount"> · ${{ record.amount }}</span>
              <span v-if="record.platform"> · {{ record.platform }}</span>
            </div>
            <div v-if="record.message" class="text-sm text-color-secondary mt-1 white-space-normal">
              <i class="pi pi-comment mr-1"></i>{{ record.message }}
            </div>
          </div>
        </div>
      </TabPanel>
    </TabView>
  </Sidebar>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { VisibleLeftSidebar } from '@/services/LeftSidebarService';
import { SpinRecords } from '@/services/SpinRecordService';
import type { SpinRecordService } from '@/services/SpinRecordService';

const spinRecordService = inject<SpinRecordService>('SpinRecordService')!;
const confirm = useConfirm();

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function exportTSV() {
  const tsv = spinRecordService.exportTSV();
  const blob = new Blob(['﻿' + tsv], { type: 'text/tab-separated-values;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `spin-records-${new Date().toISOString().slice(0, 10)}.tsv`;
  a.click();
  URL.revokeObjectURL(url);
}

function confirmClear($event: Event) {
  confirm.require({
    target: $event.target as HTMLElement,
    message: '確定要清除所有轉盤紀錄嗎？',
    icon: 'pi pi-exclamation-triangle text-yellow-400',
    accept: () => spinRecordService.clearRecords()
  });
}
</script>

<style scoped>
h2 {
  font-weight: 400;
}

.record-row:last-child {
  border-bottom: none !important;
}
</style>
