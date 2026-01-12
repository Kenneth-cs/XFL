# 幸福力婚恋系统 - 前台H5

## 技术栈

- **框架**：Vue 3 + TypeScript
- **UI组件**：Vant 4
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **HTTP客户端**：Axios
- **构建工具**：Vite

## 项目结构

```
frontend-h5/
├── src/
│   ├── api/              # API接口
│   │   ├── request.ts    # Axios实例配置
│   │   └── user.ts       # 用户相关接口
│   ├── router/           # 路由配置
│   │   └── index.ts
│   ├── stores/           # Pinia状态管理
│   │   └── user.ts
│   ├── types/            # TypeScript类型定义
│   │   └── user.ts
│   ├── views/            # 页面组件
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   └── ProfileView.vue
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
└── vite.config.ts
```

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

访问：http://localhost:5173

### 3. 构建生产版本
```bash
npm run build
```

构建产物在 `dist/` 目录。

## 功能说明

### 已实现功能

1. **用户注册**
   - 完整的注册表单
   - 表单验证
   - 门店选择
   - 多种选择器（性别、学历、婚况等）

2. **用户登录**
   - 手机号+密码登录
   - JWT Token管理
   - 自动跳转

3. **个人中心**
   - 查看基本信息
   - 查看档案详情
   - 测评入口（预留）

### 待开发功能（第二阶段）

- 九型人格测试
- 依恋关系测试
- 婚恋幸福力测试
- 测评结果展示
- 测评历史记录

## 页面路由

```
/              首页
/login         登录页
/register      注册页
/profile       个人中心
```

## API接口

所有API请求通过 `/api/v1` 代理到后端服务。

### 接口示例

```typescript
// 登录
import { login } from '@/api/user'

const result = await login({
  phone: '13800138000',
  password: '123456'
})

// 注册
import { register } from '@/api/user'

const result = await register({
  phone: '13800138000',
  password: '123456',
  name: '张三',
  // ... 其他字段
})

// 获取用户档案
import { getUserProfile } from '@/api/user'

const profile = await getUserProfile(userId)
```

## 状态管理

使用Pinia进行状态管理，主要的store：

### UserStore

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 登录
await userStore.loginUser({ phone, password })

// 注册
await userStore.registerUser({ ... })

// 获取用户信息
await userStore.fetchUserInfo()

// 登出
userStore.logout()

// 判断登录状态
userStore.isLoggedIn
```

## 开发规范

### 组件命名
- 页面组件：`XxxView.vue`
- 业务组件：`XxxComponent.vue`
- 通用组件：`TheXxx.vue` 或 `BaseXxx.vue`

### TypeScript类型
所有接口参数和返回值都应定义类型。

```typescript
// types/user.ts
export interface LoginParams {
  phone: string
  password: string
}

export interface UserInfo {
  id: string
  phone: string
  storeId: string
}
```

### 样式
- 使用scoped样式避免污染
- 响应式单位推荐使用 `vw`、`vh`、`rem`
- 颜色、字体等常量应提取为CSS变量

## 环境变量

Vite支持 `.env` 文件配置：

```env
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
```

使用：
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

## 调试技巧

### 1. 查看网络请求
浏览器开发者工具 → Network 标签

### 2. 查看Vuex状态
安装Vue DevTools浏览器扩展

### 3. 移动端调试
```bash
# 启动时指定host
npm run dev -- --host
```
然后在手机浏览器访问电脑的IP地址。

### 4. 模拟移动设备
浏览器开发者工具 → 切换设备模式（Ctrl+Shift+M）

## 性能优化

1. **路由懒加载**
```typescript
{
  path: '/profile',
  component: () => import('@/views/ProfileView.vue')
}
```

2. **组件懒加载**
```typescript
const HeavyComponent = defineAsyncComponent(() => 
  import('@/components/HeavyComponent.vue')
)
```

3. **图片优化**
- 使用WebP格式
- 图片懒加载
- 使用CDN

4. **代码分割**
Vite自动处理，无需额外配置。

## 常见问题

### 1. Vant组件样式不生效
确保已安装 `unplugin-vue-components` 并配置了 `VantResolver`。

### 2. API请求跨域
开发环境使用Vite的proxy配置，生产环境需配置Nginx。

### 3. 移动端适配
使用viewport meta标签和rem单位。

## 浏览器兼容性

- Chrome/Edge (最新版本)
- Safari (iOS 12+)
- 微信浏览器
- 其他现代浏览器

## 许可证

专有软件

