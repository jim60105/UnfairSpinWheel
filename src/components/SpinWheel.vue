<template>
  <Dropdown
    id="group-dropdown"
    :model-value="GroupLabel"
    :options="GroupLabels"
    class="mt-4 z-1"
    @update:model-value="itemService?.changeGroupLabel"
    :pt="{
      input: {
        class: 'text-xl sm:text-4xl md:text-6xl'
      },
      item: {
        class: 'text-xl sm:text-xl md:text-3xl'
      }
    }"
  />
  <ShareLink class="w-full flex justify-content-center z-1 mt-3" />
  <div ref="container" class="flex spin-container">
    <picture>
      <!--
      <source srcset="/img/image.avif" type="image/avif" />
      <source srcset="/img/image.webp" type="image/webp" />
      <img src="/img/image.png" class="image" alt="background image" />
      -->
      <img src="/img/daifuku_pointer.png" class="image" alt="background image" />
    </picture>
    <div
      class="icon"
      @click="spin"
      @keyup.enter="spin"
      @keyup.space="spin"
      v-tooltip.bottom="{
        value: `↻ Spin!`,
        class: 'text-xl',
        escape: true
      }"
      tabindex="0"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import random from 'random';
import { Wheel, type WheelProps } from 'spin-wheel';
import { useDialog } from 'primevue/usedialog';
import { TickSound, LabelLength } from '@/services/SettingService';
import { GroupLabel, GroupLabels, ItemService, Items } from '@/services/ItemService';
import CongratulationDialog from '@/components/CongratulationDialog.vue';

const itemService = inject<ItemService>('ItemService');

const properties: WheelProps = {
  // debug: import.meta.env.DEV,
  isInteractive: false,
  radius: 0.48,
  rotationResistance: 0,
  itemLabelRadius: 0.92,
  itemLabelRadiusMax: 0.3,
  itemLabelRotation: 180,
  itemLabelAlign: 'left',
  itemLabelColors: ['#fff'],
  itemLabelBaselineOffset: -0.07,
  // Should also change app.scss
  itemLabelFont:
    '"Suez One", "Mochiy Pop P One", "Jua", "Unbounded", "Mitr", "Noto Sans TC", "Noto Sans SC", "Noto Sans Lao", "Noto Color Emoji"',
  itemLabelFontSizeMax: 55,
  itemBackgroundColors: [
    '#fdc963',
    '#00cca8',
    '#2b87e9',
    '#fd775b',
    '#ff4b78',
    '#c88857',
    '#a64a97',
    '#5b7c7d',
    '#715344',
    '#904e55',
    '#8b7856'
  ],
  rotationSpeedMax: 2000,
  lineWidth: 1,
  lineColor: '#fff',
  items: []
};

const container = ref();

let spinCount = 0;
let wheel: Wheel | undefined = undefined;
let ws: WebSocket | undefined = undefined;

console.log('🚀 Script setup 已執行');

// ===== WebSocket 相關功能 =====

const OPAY_TOKEN = 'C9573BA6EAE2711888B45CE60E3AF6BC';
const WS_URL = `wss://neoripyon.leafwind.tw/donations/ws/${OPAY_TOKEN}`;

const connectWebSocket = () => {
  console.log('🔌 正在連接 WebSocket...');

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('✅ WebSocket 已連接');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('📨 收到 WebSocket 訊息:', data);
      
      // 處理不同類型的事件
      if (data.type === 'connected') {
        console.log(`✅ 已連接到頻道: ${data.channel}`);
      } else if (data.type === 'donation') {
        // 收到贊助通知 -> 觸發轉盤
        handleDonation(data.data);
      }
    } catch (error) {
      console.error('❌ 解析 WebSocket 訊息失敗:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('❌ WebSocket 錯誤:', error);
  };

  ws.onclose = (event) => {
    console.log('🔌 WebSocket 已斷開:', event.code, event.reason);
    
    // 5 秒後自動重連
    setTimeout(() => {
      console.log('🔄 嘗試重新連接...');
      connectWebSocket();
    }, 5000);
  };
};

const handleDonation = (donationData: {
  donate_id: string;
  name: string;
  amount: number;
  message: string;
  timestamp: number;
}) => {
  console.log('🎉 收到贊助:', donationData);

  // 顯示贊助訊息（可選）
  showDonationNotification(donationData);

  // 觸發轉盤
  spin();
};

const showDonationNotification = (donationData: any) => {
  console.log(`💰 ${donationData.name} 從${donationData.platform}贊助了 $${donationData.amount}！`);
  console.log(`💬 留言: ${donationData.message}`);

  toast.add({
    severity: 'success',
    summary: '收到贊助！',
    detail: `${donationData.name} 從${donationData.platform}贊助了 $${donationData.amount} 💬 ${donationData.message}`,
    life: 300000  // 5 分鐘後自動消失
  });
};

const stopAndClearSound = () => {
  if (!wheel) return;

  wheel.onCurrentIndexChange = () => {};
  wheel.stop();
};

const playSound = () => {
  if (!TickSound.value) return;

  var src = TickSound.value.value.startsWith('data:')
    ? TickSound.value.value
    : `/sound/${TickSound.value.value}`;
  const audio = new Audio(src);
  audio.volume = 0.3;
  audio.play();
};

const spin = () => {
  if (!wheel) return;

  wheel.onCurrentIndexChange = () => {
    if (!wheel) return;

    playSound();

    // Change rotation resistance based on current speed.
    // Provide a more entertaining performance.
    switch (true) {
      case wheel.rotationSpeed < 400:
        wheel.rotationResistance = -100;
        break;
      case wheel.rotationSpeed < 100:
        wheel.rotationResistance = -30;
        break;
      case wheel.rotationSpeed < 30:
        wheel.rotationResistance = -10;
        break;
    }
  };

  wheel.rotationResistance = -400;
  wheel.spin(wheel.rotationSpeed + random.int(1000, 1600));
};

const toast = useToast();
const dialog = useDialog();
const openCongratulationDialog = ($event: {
  type: 'rest';
  currentIndex: number;
  rotation: number;
}) => {
  dialog.open(CongratulationDialog, {
    props: {
      modal: true,
      showHeader: false,
      style: 'border: 0',
      contentStyle: 'border: 0; backgroundColor: transparent',
      dismissableMask: true
    },
    data: {
      item: Items.value![$event.currentIndex]
    }
  });
};

onMounted(() => {
  console.log('✅ onMounted 已執行');

  // 監聽 Items 變化
  watch(Items, (newValue) => (wheel!.items = newValue || []));
  watch(LabelLength, (newValue) => {
    wheel!.itemLabelRadiusMax = 1 - newValue;
  });

  // 初始化轉盤
  wheel = new Wheel(container.value, {
    ...properties,
    items: Items.value,
    itemLabelRadiusMax: 1 - LabelLength.value
  });

  wheel.spin(10);

  wheel.onRest = ($event) => {
    stopAndClearSound;
    openCongratulationDialog($event);
  };

  wheel.onSpin = () => {
    gtag('event', 'spin');
    gtag('event', 'spin_count', {
      count: ++spinCount
    });
  };

  // Workaround for itemLabelRadiusMax not working on first load.
  setTimeout(() => {
    wheel!.itemLabelRadiusMax = 1 - LabelLength.value;
  }, 50);

  // 連接 WebSocket
  connectWebSocket();
});

onUnmounted(() => {
  // 清理 WebSocket 連接
  if (ws) {
    ws.close();
    ws = undefined;
  }
});
</script>

<style lang="scss" scoped>
@import 'primeflex/core/_variables.scss';

.spin-container {
  aspect-ratio: 1/1;
  width: 200vw;
  height: 90vh;

  margin-top: -3.5rem;
  margin-bottom: -10vh;
  position: relative;

  @media (min-width: map-get($breakpoints, 'sm')) {
    height: 100vh;
  }

  @media (min-width: map-get($breakpoints, 'md')) {
    height: 110vh;
  }
}

.image {
  object-position: center;
  object-fit: contain;

  aspect-ratio: 1/1;
  width: 200vw;
  height: 90vh;

  position: absolute;
  top: calc(calc(50%) - calc(90vh / 2));
  left: calc(calc(50%) - calc(200vw / 2));

  @media (min-width: map-get($breakpoints, 'sm')) {
    height: 100vh;
    top: calc(calc(50%) - calc(100vh / 2));
  }

  @media (min-width: map-get($breakpoints, 'md')) {
    height: 110vh;
    top: calc(calc(50%) - calc(110vh / 2));
  }
}

.button-container {
  margin-top: -5.5rem;

  button {
    z-index: 2;
    position: relative;

    $background-color: #0c0f1d;
    background: $background-color;

    &:hover {
      filter: brightness(1.3);
    }
  }
}

.icon {
  $icon-size: 13vh;
  cursor: pointer;

  width: $icon-size;
  height: $icon-size;
  border-radius: 50%;

  background-image: url(/img/icon.png);
  background-image: -webkit-image-set(
    url(/img/icon.avif) type('image/avif'),
    url(/img/icon.webp) type('image/webp'),
    url(/img/icon.png) type('image/png')
  );
  background-image: image-set(
    url(/img/icon.avif) type('image/avif'),
    url(/img/icon.webp) type('image/webp'),
    url(/img/icon.png) type('image/png')
  );

  background-size: contain;

  position: absolute;
  top: calc(calc(50%) - calc($icon-size / 2));
  left: calc(calc(50%) - calc($icon-size / 2));

  &:hover {
    filter: brightness(1.1);
  }
}
</style>
