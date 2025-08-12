import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { Icon } from "@iconify/vue";

const app = createApp(App)

app.component('Icon', Icon)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
