import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/LoginView.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/system/DashboardView.vue'),
      meta: { title: '控制台', requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
