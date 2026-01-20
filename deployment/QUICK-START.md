# 🚀 幸福力项目 - 快速部署指南

## 📊 环境分析结果

根据服务器检查，我们已确定：

### ✅ 已具备的环境
- Node.js v20.19.6
- npm 10.8.2
- MySQL 8.0.44
- PM2

### ❌ 需要安装
- Nginx

### 🔌 端口规划
| 服务 | 端口 | 说明 |
|------|------|------|
| 后端API | 3001 | 避免与现有3000端口冲突 |
| Nginx | 8080 | 80被Python占用，使用8080 |
| MySQL | 3306 | 已运行 |

### 📁 部署目录
```
/www/projects/xinfu-project/
├── backend/
├── frontend-admin/
├── frontend-h5/
├── logs/
└── ecosystem.config.js
```

---

## 🎯 部署流程（两种方式）

### 方式一：交互式部署（推荐新手）

1. **上传部署脚本到服务器**

在本地执行：
```bash
scp deployment/deploy-steps.sh root@115.159.58.73:/tmp/
```

2. **在服务器上运行脚本**

在服务器上执行：
```bash
chmod +x /tmp/deploy-steps.sh
/tmp/deploy-steps.sh
```

然后按照菜单提示，逐步执行各个步骤。

---

### 方式二：分步手动部署（更灵活）

#### 📝 第一步：在本地准备项目文件

```bash
cd /Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发

# 压缩项目（排除不需要的文件）
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='dist' \
    --exclude='deployment' \
    -czf xinfu-project.tar.gz \
    backend frontend-admin frontend-h5 database

# 上传到服务器
scp xinfu-project.tar.gz root@115.159.58.73:/tmp/
```

---

#### 📝 第二步：在服务器上执行部署

**复制以下全部命令，在服务器终端中粘贴执行：**

```bash
# ============================================
# 1. 创建目录结构
# ============================================
mkdir -p /www/projects/xinfu-project/{backend,frontend-admin,frontend-h5,logs,database}
mkdir -p /var/backups/xinfu

# ============================================
# 2. 解压项目文件
# ============================================
cd /www/projects/xinfu-project
tar -xzf /tmp/xinfu-project.tar.gz
rm /tmp/xinfu-project.tar.gz

echo "✅ 项目文件已解压"
ls -lh /www/projects/xinfu-project

# ============================================
# 3. 安装Nginx
# ============================================
if ! command -v nginx &> /dev/null; then
    echo "正在安装Nginx..."
    yum install -y nginx
    systemctl enable nginx
    systemctl start nginx
fi

nginx -v
echo "✅ Nginx已安装"

# ============================================
# 4. 配置数据库
# ============================================
echo "正在配置数据库..."
mysql -u root -p << 'MYSQL_EOF'
-- 创建数据库
CREATE DATABASE IF NOT EXISTS xinfu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（请修改密码）
CREATE USER IF NOT EXISTS 'xinfu_user'@'localhost' IDENTIFIED BY 'Xinfu2026@Secure';

-- 授权
GRANT ALL PRIVILEGES ON xinfu_db.* TO 'xinfu_user'@'localhost';
FLUSH PRIVILEGES;

-- 验证
SHOW DATABASES LIKE 'xinfu_db';
SELECT user, host FROM mysql.user WHERE user='xinfu_user';
MYSQL_EOF

echo "✅ 数据库配置完成"

# ============================================
# 5. 导入数据库表结构
# ============================================
cd /www/projects/xinfu-project/database
echo "正在导入数据库表结构..."

for sql_file in *.sql; do
    if [ -f "$sql_file" ]; then
        echo "  导入 $sql_file ..."
        mysql -u xinfu_user -p'Xinfu2026@Secure' xinfu_db < "$sql_file" 2>/dev/null || echo "    (跳过，可能已存在)"
    fi
done

echo "✅ 数据库表结构导入完成"

# ============================================
# 6. 配置后端环境变量
# ============================================
cd /www/projects/xinfu-project/backend

cat > .env.production << 'ENV_EOF'
# 应用配置
NODE_ENV=production
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=xinfu_user
DB_PASSWORD=Xinfu2026@Secure
DB_DATABASE=xinfu_db

# JWT配置 (请修改为随机字符串)
JWT_SECRET=your-very-secure-jwt-secret-key-change-this
JWT_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=http://115.159.58.73:8080,http://115.159.58.73
ENV_EOF

echo "✅ 后端环境变量配置完成"
cat .env.production

# ============================================
# 7. 构建后端
# ============================================
echo "正在构建后端..."
cd /www/projects/xinfu-project/backend
npm install --production --registry=https://registry.npmmirror.com
npm run build

echo "✅ 后端构建完成"

# ============================================
# 8. 构建管理后台
# ============================================
echo "正在构建管理后台..."
cd /www/projects/xinfu-project/frontend-admin
npm install --registry=https://registry.npmmirror.com
npm run build

echo "✅ 管理后台构建完成"
ls -lh dist/

# ============================================
# 9. 构建H5前台
# ============================================
echo "正在构建H5前台..."
cd /www/projects/xinfu-project/frontend-h5
npm install --registry=https://registry.npmmirror.com
npm run build

echo "✅ H5前台构建完成"
ls -lh dist/

# ============================================
# 10. 配置PM2
# ============================================
cd /www/projects/xinfu-project

cat > ecosystem.config.js << 'PM2_EOF'
module.exports = {
  apps: [{
    name: 'xinfu-backend',
    script: './backend/dist/main.js',
    cwd: '/www/projects/xinfu-project/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/www/projects/xinfu-project/logs/backend-error.log',
    out_file: '/www/projects/xinfu-project/logs/backend-out.log',
    log_file: '/www/projects/xinfu-project/logs/backend-combined.log',
    time: true,
    merge_logs: true
  }]
};
PM2_EOF

# 启动应用
pm2 start ecosystem.config.js
pm2 save

echo "✅ PM2配置完成"
pm2 list

# ============================================
# 11. 配置Nginx
# ============================================
cat > /etc/nginx/conf.d/xinfu-project.conf << 'NGINX_EOF'
upstream xinfu_backend {
    server 127.0.0.1:3001;
}

server {
    listen 8080;
    server_name _;
    
    access_log /var/log/nginx/xinfu-access.log;
    error_log /var/log/nginx/xinfu-error.log;
    
    # 管理后台
    location /admin {
        alias /www/projects/xinfu-project/frontend-admin/dist;
        try_files $uri $uri/ /admin/index.html;
        index index.html;
    }
    
    # H5前台
    location /h5 {
        alias /www/projects/xinfu-project/frontend-h5/dist;
        try_files $uri $uri/ /h5/index.html;
        index index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://xinfu_backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 根路径重定向到管理后台
    location = / {
        return 301 /admin;
    }
}
NGINX_EOF

# 测试并重启Nginx
nginx -t && systemctl restart nginx

echo "✅ Nginx配置完成"

# ============================================
# 12. 配置防火墙
# ============================================
if systemctl is-active --quiet firewalld; then
    firewall-cmd --permanent --add-port=8080/tcp
    firewall-cmd --reload
    echo "✅ 防火墙已配置"
fi

# ============================================
# 13. 最终验证
# ============================================
echo ""
echo "=========================================="
echo "🎉 部署完成！正在验证..."
echo "=========================================="

echo ""
echo "📊 PM2状态:"
pm2 list

echo ""
echo "🔌 端口监听:"
ss -tuln | grep -E ':3001|:8080'

echo ""
echo "🌐 Nginx状态:"
systemctl status nginx --no-pager | head -5

echo ""
echo "🧪 后端健康检查:"
curl -s http://localhost:3001/api/v1/health || echo "⚠️  健康检查失败"

echo ""
echo "=========================================="
echo "✅ 所有步骤完成！"
echo "=========================================="
echo ""
echo "📱 访问地址:"
echo "   管理后台: http://115.159.58.73:8080/admin"
echo "   H5前台: http://115.159.58.73:8080/h5"
echo "   API文档: http://115.159.58.73:8080/api"
echo ""
echo "⚠️  重要提醒:"
echo "   1. 请在腾讯云控制台开放安全组端口: 8080"
echo "   2. 请修改数据库密码: /www/projects/xinfu-project/backend/.env.production"
echo "   3. 请修改JWT密钥: /www/projects/xinfu-project/backend/.env.production"
echo ""
echo "📚 常用命令:"
echo "   查看后端日志: pm2 logs xinfu-backend"
echo "   重启后端: pm2 restart xinfu-backend"
echo "   查看Nginx日志: tail -f /var/log/nginx/xinfu-error.log"
echo ""
```

---

## 🎯 关键配置说明

### 1. 端口选择（避免冲突）
- **后端**: 3001 (原3000被占用)
- **Nginx**: 8080 (原80被Python占用)

### 2. 数据库凭据
```
数据库名: xinfu_db
用户名: xinfu_user
密码: Xinfu2026@Secure  (请修改！)
```

### 3. 访问路径
- 管理后台: `/admin`
- H5前台: `/h5`
- API: `/api`

---

## ⚠️ 部署后必做事项

### 1. 开放腾讯云安全组端口
1. 登录腾讯云控制台
2. 进入 **云服务器 > 安全组**
3. 找到实例绑定的安全组
4. 添加入站规则: **TCP:8080**, 来源: **0.0.0.0/0**
5. 应用规则

### 2. 修改敏感配置
编辑 `/www/projects/xinfu-project/backend/.env.production`:
- 修改 `DB_PASSWORD`
- 修改 `JWT_SECRET`（使用随机字符串）

然后重启后端:
```bash
pm2 restart xinfu-backend
```

### 3. 验证部署
```bash
# 检查后端
curl http://localhost:3001/api/v1/health

# 检查Nginx
curl http://localhost:8080/admin

# 查看日志
pm2 logs xinfu-backend --lines 50
tail -f /var/log/nginx/xinfu-error.log
```

---

## 🆘 故障排查

### 后端无法启动
```bash
# 查看详细日志
pm2 logs xinfu-backend --err

# 检查端口占用
ss -tuln | grep 3001

# 手动测试启动
cd /www/projects/xinfu-project/backend
node dist/main.js
```

### 前端404错误
```bash
# 检查构建产物
ls -lh /www/projects/xinfu-project/frontend-admin/dist

# 检查Nginx配置
nginx -t
cat /etc/nginx/conf.d/xinfu-project.conf

# 重新构建
cd /www/projects/xinfu-project/frontend-admin
npm run build
systemctl restart nginx
```

### 数据库连接失败
```bash
# 测试连接
mysql -u xinfu_user -p'Xinfu2026@Secure' xinfu_db

# 检查用户权限
mysql -u root -p
SHOW GRANTS FOR 'xinfu_user'@'localhost';
```

---

## 📞 获取帮助

部署过程中遇到问题，请提供以下信息：
1. 具体报错信息
2. PM2日志: `pm2 logs xinfu-backend --lines 50`
3. Nginx日志: `tail -50 /var/log/nginx/xinfu-error.log`
4. 端口占用: `ss -tuln | grep -E '3001|8080'`
