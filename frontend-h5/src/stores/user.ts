import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, getUserInfo } from '@/api/user'
import type { LoginParams, RegisterParams } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  
  // 从 localStorage 恢复 userInfo
  const getUserInfoFromStorage = () => {
    const stored = localStorage.getItem('userInfo')
    return stored ? JSON.parse(stored) : null
  }
  
  const userInfo = ref<any>(getUserInfoFromStorage())

  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 登录
  async function loginUser(params: LoginParams) {
    const res = await login(params)
    token.value = res.accessToken
    userInfo.value = res.user
    
    // 持久化存储
    localStorage.setItem('token', res.accessToken)
    localStorage.setItem('userInfo', JSON.stringify(res.user))
    
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
    
    // 持久化存储
    localStorage.setItem('userInfo', JSON.stringify(res))
    
    return res
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    
    // 清除持久化数据
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
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

