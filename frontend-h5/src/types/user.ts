export interface LoginParams {
  phone: string
  password: string
}

export interface RegisterParams {
  phone: string
  password: string
  name: string
  gender: string
  birthday: string
  height: number
  weight: number
  education: string
  marriage: string
  ethnicity: string
  storeId: string
  avatarUrl?: string
}

export interface UserInfo {
  id: string
  phone: string
  storeId: string
}

