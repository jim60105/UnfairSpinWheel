<template>
  <div ref="container" class="w-full spin-container"></div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { Wheel } from 'spin-wheel/dist/spin-wheel-esm';

const dbService = inject('DbService');

const fontName = ['Mochiy Pop P One'];

// 1. Configure the wheel's properties:
const properties = {
  debug: import.meta.env.DEV,
  radius: 0.84,
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
    '#ffc93c',
    '#66bfbf',
    '#a2d5f2',
    '#515070',
    '#43658b',
    '#ed6663',
    '#d54062'
  ],
  rotationSpeedMax: 500,
  lineWidth: 1,
  lineColor: '#fff',
  image: './img/example-0-image.svg',
  overlayImage: './img/example-0-overlay.svg',
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

const syncDbData = async () =>
  wheel.init({
    ...properties,
    items: await dbService.getItems(),
    rotation: wheel.rotation
  });

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
  height: auto;

  background: -moz-radial-gradient(circle at center, #d2acffe1 0%, rgba(0, 0, 0, 0) 48%);
  background: -webkit-radial-gradient(circle at center, #d2acffe1 0%, rgba(0, 0, 0, 0) 48%);
  background: radial-gradient(circle at center, #d2acffe1 0%, rgba(0, 0, 0, 0) 48%);

  @media (min-width: map-get($breakpoints, 'md')) {
    height: calc(90vh);
  }
}
</style>
