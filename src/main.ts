import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { Button } from 'vant'
// 2. 引入组件样式
import 'vant/lib/index.css'
import '@/style/common.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
app.use(Button)
