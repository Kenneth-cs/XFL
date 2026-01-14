import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { message } from 'ant-design-vue'

// 配置 axios 全局默认值
axios.defaults.baseURL = '/api/v1'

// 请求拦截器：自动携带 Token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一错误处理
axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      message.error('登录已过期，请重新登录')
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      router.push('/login')
    } else if (error.response?.status === 403) {
      message.error('权限不足')
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
