import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'
import crontabs from '@/router/crontabs.ts'
import Layout from '@/components/layout/Layout.vue'

// make Layout the parent route so pages render as Layout's children
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    // redirect to a default child if desired
    redirect: '/crontabs',
    children: [...crontabs],
  },
  {
    path: '/demo',
    component: () => import('@/views/common/Demo.vue'),
    meta: { title: 'Demo Page' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
})

router.beforeEach((to, from, next) => {
  if (typeof to.meta?.title === 'string') {
    document.title = to.meta.title
  }
  next()
})

export default router
