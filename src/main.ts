/* eslint-disable vue/multi-word-component-names */
/* eslint-disable vue/no-reserved-component-names */
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

//theme
import './assets/app.scss'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(PrimeVue)
app.use(ToastService)

app.component('Button', Button)
app.component('InputText', InputText)
app.component('Toast', Toast)
app.mount('#app')
