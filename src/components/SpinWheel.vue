<template>
  <div ref="container" class="spin-container">
    <div class="icon" @click="spin" v-tooltip.bottom="{ value: 'Spin!', class: 'text-xl' }"></div>
  </div>
  <div class="grid button-container">
    <div class="col">
      <Button label="Spin!" severity="success" outlined size="large" @click="spin" />
    </div>
    <div class="col">
      <Button label="Stop!" severity="danger" outlined size="large" @click="stopAndClearSound" />
    </div>
    <div class="col">
      <Button
        icon="pi pi-palette"
        label="Customize"
        severity="info"
        outlined
        size="large"
        @click="emit('update:visibleSidebar', true)"
      />
    </div>
    <div class="p-float-label col flex">
      <Dropdown
        v-model="selectedSound"
        inputId="dd-sound"
        :options="groupedSounds"
        optionLabel="label"
        optionGroupLabel="label"
        optionGroupChildren="items"
        showClear
        :pt="{
          input: { class: 'flex align-items-center', style: { minWidth: '150px' } }
        }"
      />
      <label for="dd-sound">Select a Sound</label>
    </div>
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
  // debug: import.meta.env.DEV,
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
  // image: './img/icon.png',
  overlayImage: './img/image.png',
  items: []
};

const selectedSound = ref();
const groupedSounds = ref([
  {
    label: 'Sound Effect',
    items: [
      { label: 'Car horn', value: 'car_horn-108152.mp3' },
      { label: 'Cork', value: 'cork-85200.mp3' },
      { label: 'Ding', value: 'ding-108042.mp3' },
      { label: 'Interface', value: 'interface-1-126517.mp3' },
      { label: 'Start', value: 'start-13691.mp3' }
    ]
  },
  {
    label: 'Funny Voice',
    items: [
      { label: 'Screaming', value: '尖叫2.mp3' },
      { label: 'Laughing', value: '哈哈ᏊꈊᏊ_638014168033514976.mp3' },
      { label: 'Laughing', value: '哈哈ᏊꈊᏊ_638014227957579626.mp3' },
      { label: '臥槽 (Chinese Swear words)', value: '臥槽.mp3' },
      { label: '靠北喔 (Taiwanese mild expletive)', value: '靠北喔.mp3' }
    ]
  }
]);

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
  wheel.onCurrentIndexChange = playSound;

  wheel.rotationResistance = -100;
  wheel.spin(1000);
};

const stopAndClearSound = () => {
  wheel.onCurrentIndexChange = undefined;
  wheel.stop();
};

const playSound = () => {
  if (!selectedSound.value) return;

  const audio = new Audio(`/sound/${selectedSound.value.value}`);
  audio.volume = 0.3;
  audio.play();
};

onMounted(async () => {
  await loadFonts(fontName);
  wheel = new Wheel(container.value, properties);

  dbService.syncEvent.addEventListener('change', syncDbData);
  await syncDbData();

  wheel.spin(10);

  wheel.onRest = stopAndClearSound;
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

.p-float-label .p-inputwrapper-filled ~ label {
  top: 0;
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

label {
  left: 0.55rem;
  padding-left: 0.75rem;
  padding-right: 1.75rem;
}
</style>
