/* eslint-disable vue/multi-word-component-names */
/* eslint-disable vue/no-reserved-component-names */
import { createApp } from 'vue';
import App from '@/App.vue';
import PrimeVue from 'primevue/config';

import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Dropdown from 'primevue/dropdown';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import Divider from 'primevue/divider';
import Tooltip from 'primevue/tooltip';

//theme
import '@/assets/app.scss';
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import SpinWheel from '@/components/SpinWheel.vue';
import ItemInputGroup from '@/components/ItemInputGroup.vue';
import { DbService } from '@/services/DbService';

const app = createApp(App);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Toast', Toast);
app.component('Dropdown', Dropdown);
app.component('Divider', Divider);
app.directive('tooltip', Tooltip);

app.component('SpinWheel', SpinWheel);
app.component('ItemInputGroup', ItemInputGroup);

const dbService = new DbService();
await dbService.init();
app.provide('DbService', dbService);

app.mount('#app');
