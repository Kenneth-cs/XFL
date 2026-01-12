# 幸福力婚恋系统 - 部署指南

## 服务器环境要求

### 操作系统
- CentOS 7/8 或 Ubuntu 20.04+

### 软件环境
- Node.js 18.x+
- MySQL 8.0+
- Redis 6.x+
- Nginx 1.18+
- PM2 (进程管理器)

## 部署步骤

### 1. 服务器准备

#### 1.1 安装Node.js
```bash
# 使用nvm安装Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

#### 1.2 安装MySQL
```bash
# Ubuntu
sudo apt update
sudo apt install mysql-server

# CentOS
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 设置root密码
sudo mysql_secure_installation
```

#### 1.3 安装Redis
```bash
# Ubuntu
sudo apt install redis-server

# CentOS
sudo yum install redis
sudo systemctl start redis
sudo systemctl enable redis
```

#### 1.4 安装Nginx
```bash
# Ubuntu
sudo apt install nginx

# CentOS
sudo yum install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 1.5 安装PM2
```bash
npm install -g pm2
```

### 2. 数据库配置

#### 2.1 创建数据库
```bash
# 登录MySQL
mysql -u root -p

# 执行数据库初始化脚本
source /path/to/database/01_create_database.sql
source /path/to/database/02_create_tables.sql
source /path/to/database/03_init_data.sql
```

#### 2.2 创建数据库用户（生产环境）
```sql
CREATE USER 'xingfuli'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON xingfuli.* TO 'xingfuli'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 后端部署

#### 3.1 上传代码
```bash
# 在服务器上创建项目目录
mkdir -p /var/www/xingfuli
cd /var/www/xingfuli

# 使用git克隆或直接上传代码
# git clone your-repository-url
```

#### 3.2 安装依赖并构建
```bash
cd /var/www/xingfuli/backend
npm install --production
npm run build
```

#### 3.3 配置环境变量
```bash
# 复制环境变量文件
cp .env.example .env

# 编辑.env文件
nano .env
```

`.env` 生产环境配置示例：
```env
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=xingfuli
DB_PASSWORD=your_strong_password
DB_DATABASE=xingfuli

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT配置
JWT_SECRET=your-very-strong-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# 腾讯云COS配置
COS_SECRET_ID=your_secret_id
COS_SECRET_KEY=your_secret_key
COS_BUCKET=xingfuli-bucket
COS_REGION=ap-guangzhou
```

#### 3.4 生成超级管理员密码
```bash
# 使用Node.js生成BCrypt哈希
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log(hash))"

# 将生成的哈希值更新到数据库
mysql -u root -p xingfuli -e "UPDATE sys_user SET password='生成的哈希值' WHERE id='SUPER_ADMIN'"
```

#### 3.5 使用PM2启动
```bash
# 创建PM2配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'xingfuli-backend',
    script: './dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save
```

### 4. 前端部署

#### 4.1 构建前台H5
```bash
cd /var/www/xingfuli/frontend-h5

# 安装依赖
npm install

# 修改API地址（如果需要）
# 编辑 vite.config.ts 中的 proxy 配置

# 构建生产版本
npm run build
```

构建产物将在 `dist` 目录中。

#### 4.2 配置Nginx

创建Nginx配置文件：
```bash
sudo nano /etc/nginx/sites-available/xingfuli
```

配置内容：
```nginx
# 前台H5
server {
    listen 80;
    server_name h5.yourdomain.com;

    root /var/www/xingfuli/frontend-h5/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理到后端
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# 后端API（可选，直接暴露）
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

启用配置并重启Nginx：
```bash
sudo ln -s /etc/nginx/sites-available/xingfuli /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL证书配置（推荐）

#### 5.1 使用Let's Encrypt免费证书
```bash
# 安装certbot
sudo apt install certbot python3-certbot-nginx  # Ubuntu
# 或
sudo yum install certbot python3-certbot-nginx  # CentOS

# 申请证书
sudo certbot --nginx -d h5.yourdomain.com -d api.yourdomain.com

# 设置自动续期
sudo certbot renew --dry-run
```

### 6. 防火墙配置

```bash
# 开放必要端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 7. 日志管理

#### 7.1 PM2日志
```bash
# 查看日志
pm2 logs xingfuli-backend

# 日志文件位置
~/.pm2/logs/
```

#### 7.2 Nginx日志
```bash
# 访问日志
/var/log/nginx/access.log

# 错误日志
/var/log/nginx/error.log
```

### 8. 监控与维护

#### 8.1 PM2监控
```bash
# 查看进程状态
pm2 status

# 查看详细信息
pm2 show xingfuli-backend

# 查看CPU和内存使用
pm2 monit
```

#### 8.2 数据库备份
```bash
# 创建备份脚本
cat > /usr/local/bin/backup-xingfuli.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
mysqldump -u root -p'your_password' xingfuli | gzip > $BACKUP_DIR/xingfuli_$DATE.sql.gz
# 保留最近7天的备份
find $BACKUP_DIR -name "xingfuli_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-xingfuli.sh

# 设置定时任务（每天凌晨2点备份）
crontab -e
# 添加: 0 2 * * * /usr/local/bin/backup-xingfuli.sh
```

## 常见问题排查

### 1. 后端无法连接数据库
- 检查MySQL服务是否运行：`sudo systemctl status mysql`
- 检查数据库用户权限
- 检查防火墙设置

### 2. Redis连接失败
- 检查Redis服务：`sudo systemctl status redis`
- 检查Redis配置文件：`/etc/redis/redis.conf`

### 3. 前端页面空白
- 检查Nginx配置是否正确
- 检查前端构建是否成功
- 查看浏览器控制台错误信息

### 4. API请求失败
- 检查后端服务是否运行：`pm2 status`
- 检查Nginx代理配置
- 查看后端日志：`pm2 logs`

## 性能优化建议

1. **数据库优化**
   - 创建必要的索引
   - 定期分析和优化表
   - 配置合理的连接池大小

2. **Redis缓存**
   - 缓存热点数据
   - 设置合理的过期时间
   - 监控内存使用

3. **Nginx优化**
   - 启用gzip压缩
   - 配置静态资源缓存
   - 调整worker进程数

4. **Node.js优化**
   - 使用cluster模式
   - 调整堆内存大小
   - 监控内存泄漏

## 安全建议

1. 定期更新系统和软件包
2. 使用强密码并定期更换
3. 限制数据库和Redis的访问IP
4. 启用防火墙
5. 定期备份数据
6. 监控异常访问和攻击

---

**部署完成后，请访问：**
- 前台H5：https://h5.yourdomain.com
- API文档：https://api.yourdomain.com

**默认管理员账号：**
- 用户名：admin
- 密码：admin123（首次登录后请修改）

