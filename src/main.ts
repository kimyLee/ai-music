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

// 设计-模块划分：
// UI
// 1. 屏幕区（暂不支持触屏）: 用于展示菜单和游戏画面等实时功能
// 2. 键盘区：用于响应按键；同时支持点灯操作
// 音频: 单独TS实现
// 1. 乐器库: 播放钢琴本身音效；基于midi实现
// 2. BGM: 控制游戏背景音乐播放
// 3. Effect: 控制音效播放
// 灯光：
// 1. 控制灯效的各种接口
// System
// 1.针对玩法切换实现的操作系统
// Config
// 1. 针对测试调试的各种模拟器
// App：实现玩法逻辑的各个应用
// 1. AI 钢琴
// 2. 音游
