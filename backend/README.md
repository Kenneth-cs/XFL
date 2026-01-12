# 幸福力婚恋系统 - 后端服务

## 技术栈

- **框架**：NestJS (TypeScript)
- **数据库**：MySQL 8.0+ (TypeORM)
- **缓存**：Redis
- **认证**：JWT + Passport
- **对象存储**：腾讯云COS

## 项目结构

```
backend/
├── src/
│   ├── common/              # 通用模块
│   │   ├── decorators/      # 装饰器（角色、公开接口等）
│   │   └── guards/          # 守卫（JWT、权限、门店隔离）
│   ├── entities/            # 数据库实体
│   │   ├── store.entity.ts
│   │   ├── sys-user.entity.ts
│   │   ├── app-user.entity.ts
│   │   └── app-user-profile.entity.ts
│   ├── modules/             # 业务模块
│   │   ├── auth/           # 认证模块
│   │   ├── store/          # 门店管理
│   │   ├── user/           # 用户管理
│   │   ├── profile/        # 用户档案
│   │   └── upload/         # 文件上传
│   ├── shared/              # 共享服务
│   │   └── services/
│   │       ├── redis.service.ts
│   │       ├── id-generator.service.ts
│   │       └── oss.service.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑.env文件，配置数据库、Redis、COS等信息
```

### 3. 启动服务
```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

## API文档

### 认证接口

#### 后台用户登录
```http
POST /api/v1/auth/login/sys
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### 前台用户登录
```http
POST /api/v1/auth/login/app
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "123456"
}
```

### 门店管理

#### 创建门店（需要超管权限）
```http
POST /api/v1/stores
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "深圳门店",
  "mvTemplateId": 1,
  "contactPerson": "张三",
  "contactPhone": "13800138000"
}
```

#### 获取门店列表
```http
GET /api/v1/stores
Authorization: Bearer <token>
```

### 用户管理

#### 前台用户注册
```http
POST /api/v1/users/register/app
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "123456",
  "name": "张三",
  "gender": "男",
  "birthday": "1990-01-01",
  "height": 175,
  "weight": 70,
  "education": "本科",
  "marriage": "未婚",
  "ethnicity": "汉族",
  "storeId": "XFL001"
}
```

#### 创建后台用户
```http
POST /api/v1/users/sys
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "matchmaker01",
  "storeId": "XFL001",
  "role": "matchmaker",
  "phone": "13800138001"
}
```

#### 获取用户档案
```http
GET /api/v1/users/profile/:userId
Authorization: Bearer <token>
```

### 文件上传

#### 上传图片
```http
POST /api/v1/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
```

## 核心功能说明

### 1. ID生成器

系统使用Redis + 混淆算法生成唯一ID：

- **门店ID**：`XFL` + 3位序列号（如 `XFL001`）
- **前台用户ID**：门店ID + 5位混淆序列号（如 `XFL00100030`）
- **后台用户ID**：门店ID + `G` + 5位混淆序列号（如 `XFL001G13702`）

### 2. 多租户隔离

- 所有业务数据绑定 `store_id`
- 使用守卫自动注入门店过滤条件
- 超级管理员可跨门店访问

### 3. RBAC权限控制

四级角色体系：
- **super_admin**：超级管理员（全系统权限）
- **admin**：门店老板（本门店最高权限）
- **manager**：门店负责人（管理会员和红娘）
- **matchmaker**：普通红娘（服务分配的会员）

### 4. 数据安全

- 密码使用BCrypt加密
- 手机号脱敏显示（红娘权限）
- JWT Token认证
- 防止越权访问

## 开发规范

### 命名规范
- 文件名：kebab-case（如 `user.service.ts`）
- 类名：PascalCase（如 `UserService`）
- 变量/函数：camelCase（如 `getUserInfo`）
- 常量：UPPER_SNAKE_CASE（如 `API_PREFIX`）

### Git提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

## 测试

```bash
# 单元测试
npm run test

# e2e测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

## 常见问题

### 1. 如何生成BCrypt密码哈希？
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password', 10).then(hash => console.log(hash))"
```

### 2. 如何重置Redis序列号？
```typescript
// 使用IdGeneratorService的resetSequence方法
await idGeneratorService.resetSequence('sys:store:seq');
```

### 3. 如何调试SQL查询？
在 `.env` 中设置：
```env
NODE_ENV=development
```
TypeORM会在开发模式下打印SQL语句。

## 性能优化

1. 使用连接池管理数据库连接
2. Redis缓存热点数据
3. 使用索引优化查询
4. 分页加载大数据集
5. 使用cluster模式部署

## 许可证

专有软件

