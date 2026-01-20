# 幸福力婚恋项目 - 腾讯云部署指南

## 📋 服务器信息
- **公网IP**: 115.159.58.73
- **内网IP**: 172.17.0.5
- **地域**: 上海二区
- **实例类型**: 标准S5

## 🎯 项目架构
本项目包含三个部分：
1. **后端API** (NestJS) - 需要端口: 建议 3000 或其他未占用端口
2. **管理后台** (Vue3 + Vite) - 需要端口: 建议 5175 或其他未占用端口
3. **H5前台** (Vue3 + Vite) - 需要端口: 建议 5183 或其他未占用端口

## 📝 部署步骤

### 第一步：连接服务器并检查环境

```bash
# 1. 连接到服务器 (使用您的SSH方式)
ssh root@115.159.58.73
# 或
ssh -i ~/.ssh/your_key.pem root@115.159.58.73

# 2. 上传并运行检查脚本
# 在本地执行:
scp /Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发/deployment/check-server.sh root@115.159.58.73:/tmp/
ssh root@115.159.58.73 'bash /tmp/check-server.sh'
```

### 第二步：安装必要的环境（如果未安装）

```bash
# Node.js 18+ (推荐使用 nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# PM2 (进程管理器)
npm install -g pm2

# MySQL (如果未安装)
# Ubuntu/Debian:
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL:
sudo yum install mysql-server

# Nginx (如果需要反向代理)
# Ubuntu/Debian:
sudo apt install nginx

# CentOS/RHEL:
sudo yum install nginx
```

### 第三步：创建部署目录

```bash
# 在服务器上创建项目目录
mkdir -p /var/www/xinfu-project
cd /var/www/xinfu-project
```

### 第四步：上传项目文件

**方式1: 使用 Git (推荐)**
```bash
# 在服务器上克隆仓库
cd /var/www/xinfu-project
git clone <your-git-repository-url> .

# 如果还没有Git仓库，需要先在本地初始化并推送
```

**方式2: 使用 SCP 直接上传**
```bash
# 在本地执行 (排除 node_modules)
cd /Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发
tar --exclude='node_modules' --exclude='.git' --exclude='*.log' -czf xinfu-project.tar.gz .
scp xinfu-project.tar.gz root@115.159.58.73:/var/www/xinfu-project/

# 在服务器上解压
ssh root@115.159.58.73 'cd /var/www/xinfu-project && tar -xzf xinfu-project.tar.gz && rm xinfu-project.tar.gz'
```

**方式3: 使用 rsync (推荐用于后续更新)**
```bash
# 在本地执行
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='*.log' \
  /Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发/ \
  root@115.159.58.73:/var/www/xinfu-project/
```

### 第五步：配置数据库

```bash
# 连接到MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE IF NOT EXISTS xinfu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 创建用户并授权
CREATE USER 'xinfu_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON xinfu_db.* TO 'xinfu_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 导入数据库结构
cd /var/www/xinfu-project
mysql -u xinfu_user -p xinfu_db < database/create_all_tables.sql
# 或者逐个导入
mysql -u xinfu_user -p xinfu_db < database/01_stores.sql
mysql -u xinfu_user -p xinfu_db < database/02_sys_users.sql
# ... 其他SQL文件
```

### 第六步：配置后端环境变量

```bash
# 在服务器上创建生产环境配置
cd /var/www/xinfu-project/backend
cp .env.example .env.production

# 编辑生产环境配置
nano .env.production
```

`.env.production` 内容示例：
```env
# 应用配置
NODE_ENV=production
PORT=3000  # 根据服务器实际可用端口调整

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=xinfu_user
DB_PASSWORD=your_strong_password
DB_DATABASE=xinfu_db

# JWT配置
JWT_SECRET=your_production_jwt_secret_key_very_long_and_secure
JWT_EXPIRES_IN=7d

# CORS配置 (改为实际域名或IP)
CORS_ORIGIN=http://115.159.58.73,https://your-domain.com
```

### 第七步：安装依赖并构建

```bash
# 后端
cd /var/www/xinfu-project/backend
npm install --production
npm run build

# 管理后台前端
cd /var/www/xinfu-project/frontend-admin
npm install
npm run build

# H5前台
cd /var/www/xinfu-project/frontend-h5
npm install
npm run build
```

### 第八步：配置 PM2 启动后端

```bash
# 创建 PM2 配置文件
cd /var/www/xinfu-project
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'xinfu-backend',
    script: './backend/dist/main.js',
    cwd: '/var/www/xinfu-project/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/www/xinfu-project/logs/backend-error.log',
    out_file: '/var/www/xinfu-project/logs/backend-out.log',
    log_file: '/var/www/xinfu-project/logs/backend-combined.log',
    time: true
  }]
};
EOF

# 创建日志目录
mkdir -p /var/www/xinfu-project/logs

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs xinfu-backend

# 设置开机自启动
pm2 startup
pm2 save
```

### 第九步：配置 Nginx 反向代理

```bash
# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/xinfu-project
```

Nginx 配置内容：
```nginx
# 后端API
server {
    listen 80;
    server_name api.your-domain.com;  # 或使用 IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# 管理后台
server {
    listen 80;
    server_name admin.your-domain.com;  # 或使用不同端口

    root /var/www/xinfu-project/frontend-admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# H5前台
server {
    listen 80;
    server_name h5.your-domain.com;  # 或使用不同端口

    root /var/www/xinfu-project/frontend-h5/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

启用配置：
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/xinfu-project /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
# 或
sudo service nginx restart
```

### 第十步：配置防火墙规则

```bash
# 如果使用 ufw
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable

# 如果使用 firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

**⚠️ 注意：腾讯云还需要在控制台配置安全组规则！**

### 第十一步：验证部署

```bash
# 1. 检查后端API
curl http://localhost:3000/api/v1/health
curl http://115.159.58.73/api/v1/health  # 通过Nginx

# 2. 检查PM2状态
pm2 status
pm2 logs xinfu-backend --lines 50

# 3. 检查Nginx状态
sudo systemctl status nginx
sudo nginx -t

# 4. 查看端口占用
netstat -tuln | grep -E ':(80|443|3000)'
```

## 🔄 日常运维命令

### 更新项目
```bash
# 拉取最新代码
cd /var/www/xinfu-project
git pull

# 重新构建后端
cd backend
npm install
npm run build
pm2 restart xinfu-backend

# 重新构建前端
cd ../frontend-admin
npm install
npm run build

cd ../frontend-h5
npm install
npm run build

# 重启Nginx
sudo systemctl restart nginx
```

### 查看日志
```bash
# 后端日志
pm2 logs xinfu-backend
pm2 logs xinfu-backend --lines 100
pm2 logs xinfu-backend --err  # 只看错误日志

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MySQL 日志
sudo tail -f /var/log/mysql/error.log
```

### 数据库备份
```bash
# 备份数据库
mysqldump -u xinfu_user -p xinfu_db > /var/backups/xinfu_db_$(date +%Y%m%d_%H%M%S).sql

# 创建定时备份任务
crontab -e
# 添加：每天凌晨2点备份
0 2 * * * mysqldump -u xinfu_user -p'your_password' xinfu_db > /var/backups/xinfu_db_$(date +\%Y\%m\%d).sql
```

## 🚨 故障排查

### 后端无法启动
1. 检查端口是否被占用：`netstat -tuln | grep 3000`
2. 检查数据库连接：`mysql -u xinfu_user -p xinfu_db`
3. 查看PM2日志：`pm2 logs xinfu-backend --err`
4. 检查环境变量：`cat backend/.env.production`

### 前端404错误
1. 检查构建文件：`ls -la frontend-admin/dist`
2. 检查Nginx配置：`sudo nginx -t`
3. 查看Nginx错误日志：`sudo tail -f /var/log/nginx/error.log`

### API跨域问题
1. 检查后端CORS配置
2. 检查前端API地址配置
3. 检查Nginx代理配置

## 📞 下一步

1. **SSL证书**: 使用 Let's Encrypt 配置HTTPS
2. **域名绑定**: 将域名解析到服务器IP
3. **CDN加速**: 配置腾讯云CDN加速静态资源
4. **监控告警**: 配置服务器监控和告警通知
