import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login', // 默认子路由
    title: 'Login',
    component: () => import('@/page/Login'),
    meta: {
      requireAuth: false,
      title: '登录',
    }
  },
  {
    path: '/',
    component: () => import('@/page/Layout'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/page/Home'),
        meta: {
          requireAuth: false,
          title: '首页',
        }
      },
      {
        path: '/qa',
        name: 'Qa',
        component: () => import('@/page/Qa'),
        meta: {
          requireAuth: false,
          title: '问答',
        }
      },
      {
        path: '/video',
        name: 'Video',
        component: () => import('@/page/Video'),
        meta: {
          requireAuth: false,
          title: '视频',
        }
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('@/page/User'),
        meta: {
          requireAuth: false,
          title: '我的',
        },
      },
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/page/Search'),
    meta: {
      requireAuth: false,
      title: '搜索',
    },
  },
  {
    path: '/article/:articleId',
    name: 'Article',
    component: () => import('@/page/Article'),
    props: true,
    meta: {
      requireAuth: true,
      title: '文章详情'
    }
  },
  {
    path: '/users/:userId',
    name: 'Users',
    component: () => import('@/page/Users'),
    props: true,
    meta: {
      requireAuth: true,
      title: '用户主页'
    }
  },
  {
    path: '/user/profile',
    name: 'User-Profile',
    component: () => import('@/page/User-profile'),
    meta: {
      requireAuth: true,
      title: '个人资料',
    }
  },
  {
    path: '/user/chat',
    name: 'User-Chat',
    component: () => import('@/page/User-chat'),
    meta: {
      requireAuth: true,
      title: '小智同学',
    }
  }
]

const router = new VueRouter({
  routes
})

// 全局导航守卫
// to: 要访问的页面路由信息
// from: 来自哪个页面的路由信息
// next: 放行的标记

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | 黑马头条` : '黑马头条';
  if (to.meta.requireAuth) {
    if (store.state.user) {
      return next();
    }
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登录吗？',
    })
      .then(() => {
        // on confirm
        next(
          {
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
      })
      .catch(() => {
        // on cancel
        // 中断路由导航
        next(false);
      });
  } else {
    next()
  }
})
export default router
