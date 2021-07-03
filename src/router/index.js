import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login', // 默认子路由
    name: 'Login',
    component: () => import('@/page/Login'),
  },
  {
    path: '/',
    component: () => import('@/page/Layout'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/page/Home'),
      },
      {
        path: '/qa',
        name: 'Qa',
        component: () => import('@/page/Qa'),
      },
      {
        path: '/video',
        name: 'Video',
        component: () => import('@/page/Video')
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('@/page/User')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
