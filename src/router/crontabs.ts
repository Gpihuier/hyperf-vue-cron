import type { RouteRecordRaw } from 'vue-router'

const crontabRoutes: RouteRecordRaw[] = [
  {
    path: '/crontabs',
    name: 'Crontabs',
    meta: { title: '定时任务', icon: 'el-icon-time' },
    children: [
      {
        path: '/crontabs',
        name: 'CrontabsList',
        component: () => import('@/views/crontabs/Index.vue'),
        meta: { title: '定时任务列表' },
      },
      {
        path: '/crontabs/create',
        name: 'CrontabsCreate',
        component: () => import('@/views/crontabs/Create.vue'),
        meta: { title: '创建定时任务' },
      },
      {
        path: '/crontabs/edit/:id',
        name: 'CrontabsEdit',
        component: () => import('@/views/crontabs/Edit.vue'),
        meta: { title: '编辑定时任务' },
      },
      {
        path: '/crontabs/:id/logs',
        name: 'CrontabLogs',
        component: () => import('@/views/crontabs/Logs.vue'),
        meta: { title: '执行日志' },
      },
    ],
  },
]

export default crontabRoutes
