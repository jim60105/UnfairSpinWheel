<template>
  <div ref="container" class="spin-container">
    <div
      class="icon"
      @click="spin"
      v-tooltip.bottom="{
        value: `↻ Spin!`,
        class: 'text-xl',
        escape: true
      }"
    ></div>
  </div>
  <div class="grid button-container">
    <div class="col">
      <Button
        label="Spin!"
        icon="pi pi-refresh"
        severity="success"
        outlined
        class="w-full"
        size="large"
        @click="spin"
        :pt="{
          icon: {
            class: 'flex-auto flex justify-content-end'
          },
          label: {
            class: 'text-left'
          }
        }"
      />
    </div>
    <div class="col">
      <Button
        label="Stop!"
        icon="pi pi-stop"
        severity="danger"
        outlined
        class="w-full"
        size="large"
        @click="stopAndClearSound"
        :pt="{
          icon: {
            class: 'flex-auto flex justify-content-end'
          },
          label: {
            class: 'text-left'
          }
        }"
      />
    </div>
    <div class="col-12">
      <Button
        icon="pi pi-palette"
        label="Customize"
        severity="info"
        outlined
        class="w-full"
        size="large"
        @click="sidebarService.openSidebar"
        :pt="{
          icon: {
            class: 'flex-auto flex justify-content-end'
          },
          label: {
            class: 'text-left'
          }
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, onUnmounted } from 'vue';
import random from 'random';
import { Wheel } from 'spin-wheel/dist/spin-wheel-esm';
import { TickSound } from '@/services/SettingService';

const itemService = inject('ItemService');
const sidebarService = inject('SidebarService');

const fontName = ['Mochiy Pop P One'];

// 1. Configure the wheel's properties:
const properties = {
  // debug: import.meta.env.DEV,
  isInteractive: false,
  radius: 0.47,
  rotationResistance: 0,
  itemLabelRadius: 0.93,
  itemLabelRadiusMax: 0.45,
  itemLabelRotation: 180,
  itemLabelAlign: 'left',
  itemLabelColors: ['#fff'],
  itemLabelBaselineOffset: -0.07,
  itemLabelFont: fontName.join(', '),
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
  // image: './img/icon.png',
  overlayImage: './img/image.png',
  items: []
};

// 2. Decide where you want it to go:
const container = ref();

let wheel = undefined;

async function loadFonts(fontNames = []) {
  // Fail silently if browser doesn't support font loading.
  if (!('fonts' in document)) return;

  const fontLoading = [];
  for (const i of fontNames) {
    if (typeof i === 'string') fontLoading.push(document.fonts.load('1em ' + i));
  }

  await Promise.all(fontLoading);
}

const syncDbData = async () => (wheel.items = await itemService.getItems());

const spin = () => {
  wheel.onCurrentIndexChange = playSound;

  wheel.rotationResistance = -500;
  wheel.spin(wheel.rotationSpeed + random.int(400, 1200));
};

const stopAndClearSound = () => {
  wheel.onCurrentIndexChange = undefined;
  wheel.stop();
};

const playSound = () => {
  if (!TickSound.value) return;

  const audio = new Audio(`/sound/${TickSound.value.value}`);
  audio.volume = 0.3;
  audio.play();
};

onMounted(async () => {
  await loadFonts(fontName);
  wheel = new Wheel(container.value, properties);

  itemService.syncEvent.addEventListener('change', syncDbData);
  await syncDbData();

  wheel.spin(10);

  wheel.onRest = stopAndClearSound;
});

onUnmounted(() => {
  itemService.syncEvent.removeEventListener('change', syncDbData);
});
</script>

<style lang="scss" scoped>
@import 'primeflex/core/_variables.scss';

.spin-container {
  aspect-ratio: 1/1;
  width: 2000vw;
  height: 70vh;

  position: relative;

  @media (min-width: map-get($breakpoints, 'lg')) {
    height: 110vh;
  }
}

.button-container {
  margin-top: -5.5rem;
}

.icon {
  $icon-size: 13vh;
  cursor: pointer;

  width: $icon-size;
  height: $icon-size;
  border-radius: 50%;
  background-image: url('/img/icon.png');
  background-size: contain;
  // background-color: rgba(1, 1, 1, 0.5);

  position: absolute;
  top: calc(calc(50%) - calc($icon-size / 2));
  left: calc(calc(50%) - calc($icon-size / 2));
}
</style>
