import request from './request'
import type { LoginParams, RegisterParams } from '@/types/user'

// 登录
export function login(data: LoginParams) {
  return request.post('/auth/login/app', data)
}

// 注册
export function register(data: RegisterParams) {
  return request.post('/users/register/app', data)
}

// 获取用户信息
export function getUserInfo() {
  return request.get('/users/me')
}

// 获取用户档案
export function getUserProfile(userId: string) {
  return request.get(`/users/profile/${userId}`)
}

// 更新用户档案
export function updateUserProfile(userId: string, data: any) {
  return request.patch(`/users/profile/${userId}`, data)
}

