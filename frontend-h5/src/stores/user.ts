import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, getUserInfo } from '@/api/user'
import type { LoginParams, RegisterParams } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<any>(null)

  const isLoggedIn = computed(() => !!token.value)

  // 登录
  async function loginUser(params: LoginParams) {
    const res = await login(params)
    token.value = res.accessToken
    userInfo.value = res.user
    localStorage.setItem('token', res.accessToken)
    return res
  }

  // 注册
  async function registerUser(params: RegisterParams) {
    const res = await register(params)
    return res
  }

  // 获取用户信息
  async function fetchUserInfo() {
    if (!token.value) return
    const res = await getUserInfo()
    userInfo.value = res
    return res
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    loginUser,
    registerUser,
    fetchUserInfo,
    logout
  }
})

