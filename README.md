# 幸福力婚恋系统 - 第一阶段开发完成

## 项目简介

幸福力婚恋系统是一套专业的婚恋服务平台，基于多维度心理学模型（九型人格、依恋关系、婚恋幸福力）和MV（婚恋价值）算法的科学匹配引擎。

系统包含：
- **前台H5端**：面向C端用户，提供注册、登录、测评、个人中心等功能
- **后台管理端**：面向B端红娘/管理员，提供用户管理、智能匹配、服务跟踪等功能
- **后端API**：基于NestJS构建的RESTful API服务

## 技术栈

### 后端
- **框架**：NestJS (TypeScript)
- **数据库**：MySQL 8.0+
- **缓存**：Redis
- **ORM**：TypeORM
- **认证**：JWT + Passport
- **对象存储**：腾讯云COS

### 前台H5
- **框架**：Vue 3 + TypeScript
- **UI组件**：Vant 4
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **HTTP客户端**：Axios
- **构建工具**：Vite

## 项目结构

```
幸福力项目开发/
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── common/         # 通用模块（装饰器、守卫等）
│   │   ├── entities/       # 数据库实体
│   │   ├── modules/        # 业务模块
│   │   │   ├── auth/      # 认证模块
│   │   │   ├── store/     # 门店管理
│   │   │   ├── user/      # 用户管理
│   │   │   ├── profile/   # 用户档案
│   │   │   └── upload/    # 文件上传
│   │   ├── shared/         # 共享服务
│   │   │   └── services/  # Redis、ID生成器、OSS
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── .env.example
├── frontend-h5/            # 前台H5项目
│   ├── src/
│   │   ├── api/           # API接口
│   │   ├── router/        # 路由配置
│   │   ├── stores/        # 状态管理
│   │   ├── types/         # TypeScript类型
│   │   ├── views/         # 页面组件
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   └── vite.config.ts
├── database/               # 数据库脚本
│   ├── 01_create_database.sql
│   ├── 02_create_tables.sql
│   └── 03_init_data.sql
└── 文档/                   # 项目文档
```

## 第一阶段功能清单

### ✅ 已完成功能

#### 1. 基础架构
- [x] 项目目录结构创建
- [x] 多租户数据隔离架构设计
- [x] MySQL数据库表结构设计（9张核心表）
- [x] Redis缓存集成

#### 2. ID生成引擎
- [x] 门店ID生成（XFL001格式）
- [x] 前台用户ID生成（XFL00100030格式，带混淆）
- [x] 后台用户ID生成（XFL001G13702格式，带混淆）

#### 3. 认证与权限系统
- [x] JWT认证机制
- [x] RBAC权限控制
- [x] 四级角色体系（超管、门店老板、门店负责人、红娘）
- [x] 多租户数据隔离守卫
- [x] 前后台分离登录

#### 4. 后台管理功能
- [x] 门店管理（CRUD、启用/禁用）
- [x] 后台用户管理（创建、审核、角色分配）
- [x] 前台用户列表查看（门店隔离）
- [x] 用户档案管理（查看、编辑）

#### 5. 前台用户功能
- [x] 用户注册（完整表单，包含门店选择）
- [x] 用户登录
- [x] 个人中心（查看档案信息）

#### 6. 文件上传
- [x] 腾讯云COS对象存储集成
- [x] 图片上传接口（头像等）
- [x] 文件类型和大小验证

## 快速开始

### 1. 环境要求

- Node.js >= 18.x
- MySQL >= 8.0
- Redis >= 6.x

### 2. 数据库初始化

```bash
# 进入数据库目录
cd database

# 依次执行SQL脚本
mysql -u root -p < 01_create_database.sql
mysql -u root -p < 02_create_tables.sql
mysql -u root -p < 03_init_data.sql
```

### 3. 后端启动

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件，填入数据库、Redis、COS等配置

# 启动开发服务器
npm run start:dev
```

后端服务将运行在：`http://localhost:3000`

### 4. 前台H5启动

```bash
# 进入前台项目目录
cd frontend-h5

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前台H5将运行在：`http://localhost:5174`

## 核心API接口

### 认证接口
- `POST /api/v1/auth/login/sys` - 后台用户登录
- `POST /api/v1/auth/login/app` - 前台用户登录

### 门店管理
- `POST /api/v1/stores` - 创建门店（超管）
- `GET /api/v1/stores` - 获取门店列表
- `PATCH /api/v1/stores/:id` - 更新门店信息
- `PATCH /api/v1/stores/:id/toggle-status` - 切换门店状态

### 用户管理
- `POST /api/v1/users/register/app` - 前台用户注册
- `POST /api/v1/users/sys` - 创建后台用户
- `GET /api/v1/users/sys` - 获取后台用户列表
- `PATCH /api/v1/users/sys/:id/approve` - 审核后台用户
- `GET /api/v1/users/app` - 获取前台用户列表
- `GET /api/v1/users/profile/:userId` - 获取用户档案
- `PATCH /api/v1/users/profile/:userId` - 更新用户档案

### 文件上传
- `POST /api/v1/upload/image` - 上传图片

## 数据库设计要点

### 核心表结构
1. **sys_store** - 门店表（多租户核心）
2. **sys_user** - 后台用户表（红娘、管理员）
3. **app_user** - 前台用户表（C端会员）
4. **app_user_profile** - 用户档案表（JSON字段存储灵活数据）
5. **assessment_record** - 测评记录表
6. **match_batch** - 匹配批次表
7. **match_detail** - 匹配明细表
8. **service_track** - 服务轨迹表
9. **sys_id_sequence** - ID序列号记录表

### 多租户隔离策略
- 所有业务表强制包含 `store_id` 字段
- 使用守卫在应用层自动注入门店过滤条件
- 超级管理员可绕过限制查看全局数据

## 默认账号

### 超级管理员
- **账号**：admin
- **密码**：admin123
- **门店**：XFL001（总部测试门店）

> 注意：首次使用需要在数据库中手动设置BCrypt加密后的密码

## 下一阶段开发计划

### 第二阶段：三大测评引擎与动态档案系统
- [ ] 九型人格测试（题库、算法、结果展示）
- [ ] 依恋关系测试
- [ ] 婚恋幸福力测试（双层圆环图展示）
- [ ] MV值自动计算引擎
- [ ] 档案动态编辑功能

### 第三阶段：智能匹配引擎与服务闭环
- [ ] 智能匹配算法（MV匹配、九型人格匹配）
- [ ] 匹配结果展示（批次化管理）
- [ ] 服务轨迹管理（匹配、约见、治疗）
- [ ] 历史查询与统计

## 注意事项

1. **环境变量配置**：务必正确配置 `.env` 文件中的数据库、Redis、COS等信息
2. **密码加密**：生产环境需要使用真实的BCrypt哈希值
3. **跨域配置**：生产环境需要正确配置CORS白名单
4. **文件存储**：确保COS bucket已创建并配置了正确的访问权限
5. **Redis连接**：确保Redis服务正常运行

## 技术亮点

1. **多租户架构**：完整的门店数据隔离，确保数据安全
2. **ID生成策略**：带混淆的唯一ID生成算法，防止数据爬取
3. **RBAC权限**：细粒度的角色权限控制
4. **类型安全**：全栈TypeScript，提供完整的类型支持
5. **模块化设计**：清晰的模块划分，便于维护和扩展

## 开发规范

- 代码风格：遵循ESLint + Prettier配置
- Git提交：使用语义化提交信息
- API文档：遵循RESTful设计规范
- 数据验证：使用class-validator进行参数校验

## 联系方式

如有问题，请查阅项目文档或联系开发团队。

---

**版本**：v1.0.0 (第一阶段)  
**更新时间**：2026-01-11

