/* eslint-disable vue/multi-word-component-names */
/* eslint-disable vue/no-reserved-component-names */

/*
 * I have noticed that there are malicious individuals who steal our website content and add malicious code to collect user location and send back to the their own server.
 * To protect against such actions, we will implement a mechanism to verify the host when the webpage is being loaded, and if necessary, redirect users to the appropriate website when they access the proxy site.
 * Please be aware that you are solely permitted to distribute this project under the "AGPL-3.0" license.
 * If you have adhered to the terms of this license, you are welcome to make modifications to this section as needed.
 */
if (
  !window.location.hostname.endsWith('spin-wheel.click') &&
  window.location.hostname !== 'localhost'
) {
  window.location.href =
    'https://unfair.spin-wheel.click' + window.location.pathname + window.location.search;
}

import { createApp } from 'vue';
import App from '@/App.vue';
import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config';
import aura from '@primevue/themes/aura';
import { definePreset, updatePrimaryPalette, useTheme } from '@primevue/themes';
import PouchDBFind from 'pouchdb-find';
import PouchDB from 'pouchdb-browser';

import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Select from 'primevue/select';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import Divider from 'primevue/divider';
import Tooltip from 'primevue/tooltip';
import Sidebar from 'primevue/sidebar';
import ScrollPanel from 'primevue/scrollpanel';
import Tabs from 'primevue/tabs';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import TabList from 'primevue/tablist';
import Slider from 'primevue/slider';
import Dialog from 'primevue/dialog';
import DynamicDialog from 'primevue/dynamicdialog';
import DialogService from 'primevue/dialogservice';
import Ripple from 'primevue/ripple';
import FocusTrap from 'primevue/focustrap';
import ToggleButton from 'primevue/togglebutton';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import FileUpload from 'primevue/fileupload';

//theme
// Aura's dark form fields default to {surface.950}/{surface.600}, which is far darker
// than the bootstrap4-dark-blue theme this app was designed against. Restore the
// original form field palette so inputs keep sitting on #20262e.
const appPreset = definePreset(aura, {
  semantic: {
    colorScheme: {
      dark: {
        formField: {
          background: '#20262e',
          borderColor: '#3f4b5b',
          hoverBorderColor: '#3f4b5b',
          focusBorderColor: '#8dd0ff',
          invalidBorderColor: '#f19ea6',
          color: 'rgba(255, 255, 255, 0.87)'
        }
      }
    }
  }
});

useTheme({
  preset: appPreset,
  options: { darkModeSelector: '.dark' }
});
const themePreset = updatePrimaryPalette({
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a'
});
document.documentElement.classList.add('dark');
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.scss';
import 'shareon/css';
import '@/assets/app.scss';
import '@/assets/OBS.scss';
if (navigator.userAgent.indexOf('OBS') !== -1) {
  document.body.classList.add('obs');
}

import SpinWheel from '@/components/SpinWheel.vue';
import ItemInputGroup from '@/components/sidebar-panel/ItemInputGroup.vue';
import SidebarPanel from '@/components/sidebar-panel/SidebarPanel.vue';
import CongratulationDialog from '@/components/CongratulationDialog.vue';
import Footer from '@/components/Footer.vue';
import ShareLink from '@/components/ShareLink.vue';
import { ItemService } from '@/services/ItemService';
import { SidebarService } from '@/services/SidebarService';
import { SettingService } from '@/services/SettingService';

const app = createApp(App);
const primevueConfig: PrimeVueConfiguration & { license?: string } = {
  ripple: true,
  theme: {
    preset: themePreset,
    options: { darkModeSelector: '.dark' }
  },
  pt: {
    tabPanel: {
      headerTitle: {
        style: {
          fontWeight: '400'
        }
      }
    }
  },
  ptOptions: {
    mergeProps: true
  },
  ...(import.meta.env.VITE_PRIMEUI_LICENSE ? { license: import.meta.env.VITE_PRIMEUI_LICENSE } : {})
};
app.use(PrimeVue, primevueConfig);
app.use(ConfirmationService);

// PouchDB
// https://pouchdb.com/guides/databases.html
PouchDB.plugin(PouchDBFind);

const settingService = new SettingService();
await settingService.init();
app.provide('SettingService', settingService);

const itemService = new ItemService();
await itemService.init();
app.provide('ItemService', itemService);

const sidebarService = new SidebarService();
app.provide('SidebarService', sidebarService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('InputGroup', InputGroup);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('InputNumber', InputNumber);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Select', Select);
app.component('Divider', Divider);
app.component('Sidebar', Sidebar);
app.component('ScrollPanel', ScrollPanel);
app.directive('tooltip', Tooltip);
app.component('Tabs', Tabs);
app.component('Tab', Tab);
app.component('TabPanels', TabPanels);
app.component('TabPanel', TabPanel);
app.component('TabList', TabList);
app.component('Slider', Slider);
app.component('Dialog', Dialog);
app.component('DynamicDialog', DynamicDialog);
app.use(DialogService);
app.directive('ripple', Ripple);
app.directive('focustrap', FocusTrap);
app.component('ToggleButton', ToggleButton);
app.component('Textarea', Textarea);
app.component('Toast', Toast);
app.use(ToastService);
app.component('FileUpload', FileUpload);

app.component('SpinWheel', SpinWheel);
app.component('ItemInputGroup', ItemInputGroup);
app.component('SidebarPanel', SidebarPanel);
app.component('CongratulationDialog', CongratulationDialog);
app.component('Footer', Footer);
app.component('ShareLink', ShareLink);

app.mount('#app');
