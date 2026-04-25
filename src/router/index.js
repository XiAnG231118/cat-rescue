import { createRouter, createWebHashHistory } from 'vue-router'
import UserProfile from '@/views/UserList.vue'
import NewsDetail from '@/views/NewsDetail.vue' 
import PointsShop from '@/views/PointsShop.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: () => import('@/views/LoginList.vue') },
  { path: '/register', component: () => import('@/views/RegisterList.vue') },
  { path: '/home', component: () => import('@/views/HomeList.vue') },
  { path: '/cats', component: () => import('@/views/CatList.vue') },
  { path: '/guide', component: () => import('@/views/GuideList.vue') },
  { path: '/stories', component: () => import('@/views/StoryList.vue') },
  {
    path: '/cats/:id',
    name: 'CatDetail',
    component: () => import('@/views/CatDetail.vue'),
    props: true
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: NewsDetail,
    props: true,
  },
  {
    path: '/points',
    name: 'PointsShop',
    component: PointsShop,
    meta: { requiresAuth: true }
  },
  {
      path: '/profile',
      name: 'Profile',
      component: UserProfile,
      meta: { requiresAuth: true } // 需要登录才能访问
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  if (!isLoggedIn && to.path !== '/login' && to.path !== '/register') {
    next('/login')
  } else if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    next('/home') // 已登录时禁止返回登录页或注册页
  } else {
    next()
  }
})

export default router