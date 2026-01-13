import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '首页', noAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: '登录', noAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { title: '注册', noAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: '个人中心' }
    },
    {
      path: '/assessment',
      name: 'assessment',
      component: () => import('@/views/assessment/AssessmentCenter.vue'),
      meta: { title: '测评中心' }
    },
    {
      path: '/assessment/enneagram',
      name: 'enneagram-test',
      component: () => import('@/views/assessment/EnneagramTest.vue'),
      meta: { title: '九型人格测试' }
    },
    {
      path: '/assessment/enneagram/result',
      name: 'enneagram-result',
      component: () => import('@/views/assessment/EnneagramResult.vue'),
      meta: { title: '测评结果' }
    },
    {
      path: '/assessment/attachment',
      name: 'attachment-test',
      component: () => import('@/views/assessment/AttachmentTest.vue'),
      meta: { title: '依恋关系测试' }
    },
    {
      path: '/assessment/attachment/result',
      name: 'attachment-result',
      component: () => import('@/views/assessment/AttachmentResult.vue'),
      meta: { title: '测评结果' }
    },
    {
      path: '/assessment/happiness',
      name: 'happiness-test',
      component: () => import('@/views/assessment/HappinessTest.vue'),
      meta: { title: '婚恋幸福力测试' }
    },
    {
      path: '/assessment/happiness/result',
      name: 'happiness-result',
      component: () => import('@/views/assessment/HappinessResult.vue'),
      meta: { title: '测评结果' }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  document.title = `${to.meta.title || '幸福力'} - 幸福力婚恋系统`
  
  // 需要登录的页面
  if (!to.meta.noAuth && !userStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router

