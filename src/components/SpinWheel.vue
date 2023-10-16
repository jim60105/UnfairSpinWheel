<template>
  <div ref="container" class="spin-container">
    <div
      class="spin-button rotating"
      @click="spin"
      v-tooltip.bottom="{ value: 'Spin!', class: 'text-xl' }"
    ></div>
    <div
      class="stop-button"
      @click="stop"
      v-tooltip.bottom="{ value: 'Stop!', class: 'text-xl' }"
    ></div>
    <div
      class="customize-button"
      @click="emit('update:visibleSidebar', true)"
      v-tooltip.bottom="{
        value: `<i class='pi pi-palette'></i> Customize`,
        escape: true,
        class: 'text-xl'
      }"
    ></div>
    <a
      href="https://www.bing.com/images/create/spin-wheel-game2c-web-design-material2c-dark-mode-de/652bec3676ed40afac326e7bd32cf3c6?id=sGSw5bLqrygiMyekuUrIMw%3d%3d&view=detailv2&idpp=genimg&FORM=GCRIDP&mode=overlay"
      target="_blank"
      class="source-link"
      v-tooltip.bottom="{
        value: `Image powered by DALL·E 3`
      }"
    ></a>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { Wheel } from 'spin-wheel/dist/spin-wheel-esm';

const emit = defineEmits(['update:visibleSidebar']);

const dbService = inject('DbService');

const fontName = ['Mochiy Pop P One'];

// 1. Configure the wheel's properties:
const properties = {
  debug: import.meta.env.DEV,
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
  rotationSpeedMax: 500,
  lineWidth: 1,
  lineColor: '#fff',
  // image: './img/image.png',
  // overlayImage: './img/image.png',
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

const syncDbData = async () => (wheel.items = await dbService.getItems());

const spin = () => {
  console.log('Spin!');
  wheel.rotationResistance = -80;
  wheel.spin(500);
};

const stop = () => wheel.stop();

onMounted(async () => {
  await loadFonts(fontName);
  wheel = new Wheel(container.value, properties);

  dbService.syncEvent.addEventListener('change', syncDbData);
  await syncDbData();

  wheel.spin(10);
});
</script>

<style lang="scss" scoped>
@import 'primeflex/core/_variables.scss';

.spin-container {
  aspect-ratio: 1/1;
  width: 2000vw;
  height: 70vh;

  background-image: url('/img/image.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;

  @media (min-width: map-get($breakpoints, 'lg')) {
    height: 110vh;
  }
}

.spin-button {
  $spin-button-size: 6vh;
  cursor: pointer;

  width: $spin-button-size;
  height: $spin-button-size;
  border-radius: 50%;
  background-image: url('/img/spin-button.png');
  background-size: contain;
  // background-color: rgba(1, 1, 1, 0.5);

  position: absolute;
  top: calc(calc(50% + 29.1vh) - calc($spin-button-size / 2));
  left: calc(calc(50% + 26vh) - calc($spin-button-size / 2));
}

.stop-button {
  $stop-button-size: 4.5vh;
  cursor: pointer;

  width: $stop-button-size;
  height: $stop-button-size;
  border-radius: 50%;
  background-color: transparent;

  position: absolute;
  top: calc(calc(50% + 30.8vh) - calc($stop-button-size / 2));
  left: calc(calc(50% + 35.4vh) - calc($stop-button-size / 2));
}

.customize-button {
  $customize-button-width: 6vh;
  $customize-button-height: 3.5vh;
  cursor: pointer;

  width: $customize-button-width;
  height: $customize-button-height;
  background-color: transparent;

  position: absolute;
  top: calc(calc(50% + 36vh) - calc($customize-button-height / 2));
  left: calc(calc(50% + 25.9vh) - calc($customize-button-width / 2));
}

.source-link {
  $source-link-size: 3vh;

  width: $source-link-size;
  height: $source-link-size;
  border-radius: 50%;
  background-color: transparent;

  position: absolute;
  top: calc(calc(50% + 36.3vh) - calc($source-link-size / 2));
  left: calc(calc(50% + 41.6vh) - calc($source-link-size / 2));
}

.rotating {
  -webkit-animation: rotating 5s linear infinite;
  animation: rotating 5s linear infinite;
}
@-webkit-keyframes rotating {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
