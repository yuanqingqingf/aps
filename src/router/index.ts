/*
 * @Author: yuanqingqing 1194367511@qq.com
 * @Date: 2024-07-18 16:18:22
 * @LastEditors: yuanqingqing 1194367511@qq.com
 * @LastEditTime: 2026-03-12 17:04:05
 * @Description:
 * Copyright (c) 2026-present HBIS Digital Technology Co.,Ltd. All rights reserved.
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DyView from '../views/DyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dy',
      name: 'dy',
      component: DyView
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/visTimeline.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
