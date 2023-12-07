<template>
  <Toast position="bottom-left" />
  <ConfirmPopup id="confirm" aria-label="popup">
    <template #message="slotProps">
      <div class="flex flex-column align-items-center w-full gap-3 p-3">
        <i class="text-6xl" :class="slotProps.message.icon"></i>
        <span>{{ slotProps.message.message }}</span>
      </div>
    </template>
  </ConfirmPopup>
  <ScrollPanel class="h-screen">
    <div class="max-w-screen overflow-x-hidden overflow-y-hidden">
      <div class="grid header text-center">
        <h1 class="col-12 mb-0 text-4xl sm:text-5xl md:text-6xl">
          <span v-if="!Fairmode">Unfair</span><span v-else>Fair</span>&nbsp;<span
            class="white-space-nowrap"
            >Spin Wheel</span
          >
        </h1>
        <p class="col-12 my-0 py-0 text-base sm:text-lg md:text-2xl" v-if="!Fairmode">
          <span class="white-space-nowrap">The world is unfair,</span>&nbsp;<span
            class="white-space-nowrap"
            >and so is our spin wheel.</span
          >
        </p>
        <p class="col-12 my-0 py-0 text-base sm:text-lg md:text-2xl" v-else>
          <span class="white-space-nowrap">Though the world is unfair,</span>&nbsp;<span
            class="white-space-nowrap"
            >fortune smiles on our spin wheel.</span
          >
        </p>
      </div>
      <div class="flex flex-wrap justify-content-center mb-4">
        <SpinWheel></SpinWheel>
      </div>
    </div>
    <Footer></Footer>
  </ScrollPanel>

  <SidebarPanel></SidebarPanel>
  <Button
    severity="info"
    text
    rounded
    icon="pi pi-angle-double-left"
    aria-label="Open sidebar"
    class="overflow-visible sidebar-button"
    @click="sidebarService?.openSidebar"
    :pt="{
      icon: { style: { fontSize: 'xx-large' } }
    }"
  />
  <DynamicDialog />
  <Dialog v-model:visible="showInputGroupDialog" modal dismissableMask header="Header">
    <template #container>
      <form class="surface-card border-round shadow-2 p-4 max-w-screen" @submit.prevent>
        <div class="text-900 font-medium mb-2 text-xl">Import Group</div>
        <p class="text-color-secondary w-24rem">
          Hey, your new spinner has the same name as
          <span class="white-space-nowrap">one of your existing groups.</span>
        </p>
        <p class="text-color-secondary w-24rem">
          Please assign another group name, or else
          <span class="text-red-300 white-space-nowrap">it will be replaced.</span>
        </p>
        <div class="flex mb-4 flex-column lg:flex-row">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-file-import" />
            <InputText
              autofocus
              v-model="inputGroupName"
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
          :label="GroupLabels.indexOf(inputGroupName) > -1 ? 'Replace' : 'Import'"
          :severity="GroupLabels.indexOf(inputGroupName) > -1 ? 'danger' : 'success'"
          @click="inputGroup"
        ></Button>
      </form>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { SidebarService } from '@/services/SidebarService';
import { ItemService, GroupLabels } from '@/services/ItemService';
import { StringHelper } from '@/helpers/StringHelper';
import { Fairmode } from '@/services/SettingService';

declare global {
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

const sidebarService = inject<SidebarService>('SidebarService');
const itemService = inject<ItemService>('ItemService');

let inputItems: { label: string; weight: number }[] = [];
const showInputGroupDialog = ref(false);
const inputGroupName = ref('');
const inputGroup = async () => {
  if (!itemService) return;

  await itemService.cleanUpGroup(inputGroupName.value);
  await itemService.addItems(
    inputItems.map((item) => ({
      label: item.label,
      weight: +item.weight,
      group: inputGroupName.value,
      order: -1
    }))
  );
  await itemService.changeGroupLabel(inputGroupName.value);
  showInputGroupDialog.value = false;
  inputGroupName.value = '';

  // Remove query string
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete('data');
  searchParams.delete('group');
  var url =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    (searchParams.size ? '?' + searchParams.toString() : '');
  window.history.pushState({ path: url }, '', url);
};

onMounted(async () => {
  if (import.meta.env.DEV) {
    // Add dummy gtag for dev
    window.gtag = (...args: any[]) => {
      console.debug('gtag', ...args);
    };
  } else if (navigator.globalPrivacyControl) {
    // Don't track if user has enabled Global Privacy Control
    window.gtag = () => {};
    console.log(
      '%cWe can see that you have enabled the Global Privacy Control, indicating that you do not wish to have your information sold or shared.',
      'font-weight:bold; color: lightgreen;',
      '\nYour privacy is important to us, and we completely honor your choice.',
      'As a result, we have deactivated Google Analytics and Microsoft Clarity. 😉'
    );
  } else if (navigator.userAgent.indexOf('OBS') > 0) {
    // Don't track in OBS mode to reduce performance impact
    window.gtag = () => {};
  } else if (import.meta.env.PROD) {
    // Setup GA
    (function (id) {
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;

      document.head.appendChild(gtagScript);

      const dataLayerScript = document.createElement('script');
      dataLayerScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');`;
      document.head.appendChild(dataLayerScript);
    })(import.meta.env.VITE_GA_TRACKING_ID);

    // Setup Clarity
    (function (c: any, l: Document, a: string, r: string, i: string, t: any, y: any) {
      c[a] =
        c[a] ||
        function (...args: any[]) {
          (c[a].q = c[a].q || []).push(args);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(
      window,
      document,
      'clarity',
      'script',
      import.meta.env.VITE_CLARITY_TRACKING_ID,
      undefined,
      undefined
    );
  }

  const params = new URLSearchParams(window.location.search);
  const data = params.get('data');
  const group = params.get('group') ?? 'New Group Name';
  if (data) {
    try {
      inputGroupName.value = decodeURIComponent(group);
      console.debug('inputGroupName', inputGroupName.value);

      const decompressed = StringHelper.decompress(data);
      inputItems = StringHelper.csvParse(decompressed);
      console.debug('inputItems', inputItems);

      if ((await itemService?.getItemByGroupLabel(inputGroupName.value))?.length) {
        inputGroupName.value += ' (1)';
        showInputGroupDialog.value = true;
      } else {
        await inputGroup();
      }
    } catch (e) {
      console.error('Failed to parsed data from url segment!', e);
    }
  }
});
</script>

<style lang="scss" scoped>
.header {
  font-family: 'Rock Salt';
  -webkit-text-shadow: 9px 7px 20px #000000;
  text-shadow: 9px 7px 20px #000000;

  h1 {
    font-size: xxx-large;
  }
  p {
    font-size: large;
  }
}

.confirm-button {
  float: right;
}

@mixin afterBg {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 50%;
}

.sidebar-button {
  position: fixed;
  top: calc(50% - 25px);
  right: 1rem;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  z-index: 999;

  animation: shockwaveJump 2s ease-out infinite;

  &:after {
    @include afterBg;
    animation: shockwave 2s 0.65s ease-out infinite;
  }

  &:before {
    @include afterBg;
    animation: shockwave 2s 0.5s ease-out infinite;
  }
}

@keyframes shockwaveJump {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.08);
  }
  50% {
    transform: scale(0.98);
  }
  55% {
    transform: scale(1.02);
  }
  60% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shockwave {
  0% {
    transform: scale(1);
    box-shadow:
      0 0 2px rgba(255, 255, 255, 0.15),
      inset 0 0 1px rgba(255, 255, 255, 0.15);
  }
  95% {
    box-shadow:
      0 0 50px rgba(255, 255, 255, 0),
      inset 0 0 30px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(2.25);
  }
}
</style>
