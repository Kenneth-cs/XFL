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
      component: () => import('../views/system/DashboardView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/members/list' // 默认跳转到用户列表
        },
        // 后台人员管理
        {
          path: 'staff/approval',
          name: 'StaffApproval',
          component: () => import('../views/staff/StaffApproval.vue'),
          meta: { title: '人员审核', requiresAuth: true }
        },
        {
          path: 'staff/list',
          name: 'StaffList',
          component: () => import('../views/staff/StaffList.vue'),
          meta: { title: '人员列表', requiresAuth: true }
        },
        // 角色&门店管理
        {
          path: 'system/roles',
          name: 'RolesList',
          component: () => import('../views/system/RolesList.vue'),
          meta: { title: '角色列表', requiresAuth: true }
        },
        {
          path: 'system/stores',
          name: 'StoresList',
          component: () => import('../views/system/StoresList.vue'),
          meta: { title: '门店列表', requiresAuth: true }
        },
        // 用户档案管理
        {
          path: 'members/list',
          name: 'MembersList',
          component: () => import('../views/members/MembersList.vue'),
          meta: { title: '用户列表', requiresAuth: true }
        },
        {
          path: 'members/detail/:id',
          name: 'MemberDetail',
          component: () => import('../views/members/MemberDetail.vue'),
          meta: { title: '用户档案详情', requiresAuth: true }
        },
        {
          path: 'members/match',
          name: 'MembersMatch',
          component: () => import('../views/members/MembersMatch.vue'),
          meta: { title: '智能匹配', requiresAuth: true }
        },
        {
          path: 'members/match-detail/:id',
          name: 'MatchDetail',
          component: () => import('../views/members/MatchDetail.vue'),
          meta: { title: '匹配详情', requiresAuth: true }
        }
      ]
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
