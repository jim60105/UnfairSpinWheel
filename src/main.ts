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
import PrimeVue from 'primevue/config';
import PouchDBFind from 'pouchdb-find';
import PouchDB from 'pouchdb-browser';

import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import Divider from 'primevue/divider';
import Tooltip from 'primevue/tooltip';
import Sidebar from 'primevue/sidebar';
import ScrollPanel from 'primevue/scrollpanel';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
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
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
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
app.use(PrimeVue, {
  ripple: true,
  pt: {
    tabPanel: {
      headerTitle: {
        style: {
          fontWeight: '400'
        }
      }
    }
  }
});
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
app.component('InputNumber', InputNumber);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Dropdown', Dropdown);
app.component('Divider', Divider);
app.component('Sidebar', Sidebar);
app.component('ScrollPanel', ScrollPanel);
app.directive('tooltip', Tooltip);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
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
