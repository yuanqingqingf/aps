/*
 * @Author: yuanqingqing 1194367511@qq.com
 * @Date: 2024-07-18 16:18:22
 * @LastEditors: yuanqingqing 1194367511@qq.com
 * @LastEditTime: 2026-03-16 14:48:46
 * @Description:
 * Copyright (c) 2026-present HBIS Digital Technology Co.,Ltd. All rights reserved.
 */
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
// main.js
// import microApp from '@micro-zoe/micro-app'

// microApp.start()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
