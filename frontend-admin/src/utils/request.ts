import axios from 'axios';
import { message } from 'ant-design-vue';
import router from '../router';

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 自动携带 Token
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('登录已过期，请重新登录');
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          router.push('/login');
          break;
        case 403:
          message.error('权限不足');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(error.response.data?.message || '请求失败');
      }
    } else {
      message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

export default request;

