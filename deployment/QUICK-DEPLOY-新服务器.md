# 快速部署到新服务器 (124.222.88.25)

## 方式一：一键自动部署（推荐）

### 前提条件
```bash
# 安装 sshpass（用于自动输入密码）
# macOS:
brew install sshpass

# 如果安装失败，可以跳过，手动输入密码
```

### 执行部署
```bash
cd /Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发/deployment
./deploy-to-new-server.sh
```

按照提示操作即可。

---

## 方式二：手动分步部署

### 第一步：本地准备

```bash
cd /Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发

# 1. 构建所有代码
cd backend && npm run build && cd ..
cd frontend-admin && npx vite build --mode production && cd ..
cd frontend-h5 && npx vite build --mode production && cd ..

# 2. 打包
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "xinfu-deploy-${DATE}.tar.gz" \
  backend/dist \
  backend/package*.json \
  frontend-admin/dist \
  frontend-h5/dist \
  database/*.sql

echo "✓ 部署包已创建: xinfu-deploy-${DATE}.tar.gz"
```

### 第二步：上传到新服务器

```bash
# 上传部署包
scp xinfu-deploy-*.tar.gz root@124.222.88.25:/tmp/

# 如果有旧服务器的数据库备份，也上传
scp ~/Desktop/xinfu_db_backup_*.sql root@124.222.88.25:/tmp/
```

### 第三步：登录新服务器

```bash
ssh root@124.222.88.25
```

### 第四步：安装必要软件

```bash
# 1. 更新系统
yum update -y

# 2. 安装 Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# 3. 安装 PM2
npm install -g pm2

# 4. 安装 MySQL
wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
rpm -ivh mysql80-community-release-el7-3.noarch.rpm
yum install -y mysql-server
systemctl start mysqld
systemctl enable mysqld

# 记录临时密码
grep 'temporary password' /var/log/mysqld.log

# 5. 安装 Nginx
yum install -y nginx
systemctl start nginx
systemctl enable nginx

# 6. 安装 Redis
yum install -y redis
systemctl start redis
systemctl enable redis
```

### 第五步：配置 MySQL

```bash
# 1. 修改 root 密码（用临时密码登录）
mysql -u root -p

# 2. 在 MySQL 中执行：
ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
FLUSH PRIVILEGES;

# 3. 创建数据库和用户
CREATE DATABASE IF NOT EXISTS xinfu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'xinfu_user'@'localhost' IDENTIFIED BY 'Xinfu2026Pass!';
GRANT ALL PRIVILEGES ON xinfu_db.* TO 'xinfu_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 第六步：导入数据

```bash
# 如果有旧服务器的备份
mysql -u root -p xinfu_db < /tmp/xinfu_db_backup_*.sql

# 如果没有备份，用初始SQL
cd /www/projects/xinfu-project
mysql -u root -p xinfu_db < database/02_create_tables.sql
mysql -u root -p xinfu_db < database/03_init_data.sql
mysql -u root -p xinfu_db < database/04_assessment_tables.sql
mysql -u root -p xinfu_db < database/06_match_tables.sql
```

### 第七步：部署项目

```bash
# 1. 创建目录
mkdir -p /www/projects/xinfu-project
mkdir -p /www/wwwroot/admin
mkdir -p /www/wwwroot/h5
mkdir -p /www/logs

# 2. 解压
cd /www/projects/xinfu-project
tar -xzf /tmp/xinfu-deploy-*.tar.gz

# 3. 配置后端环境变量
cd /www/projects/xinfu-project/backend
cat > .env << 'EOF'
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=xinfu_user
DB_PASSWORD=Xinfu2026Pass!
DB_DATABASE=xinfu_db

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

PORT=3001
NODE_ENV=production
EOF

# 4. 安装后端依赖
npm install --production

# 5. 配置 PM2
cd /www/projects/xinfu-project
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'xinfu-backend',
    script: './backend/dist/main.js',
    cwd: '/www/projects/xinfu-project',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/www/logs/xinfu-backend-error.log',
    out_file: '/www/logs/xinfu-backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
}
EOF

# 6. 启动后端
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 7. 部署前端
cp -r /www/projects/xinfu-project/frontend-admin/dist/* /www/wwwroot/admin/
cp -r /www/projects/xinfu-project/frontend-h5/dist/* /www/wwwroot/h5/
```

### 第八步：配置 Nginx

```bash
cat > /etc/nginx/conf.d/xinfu.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    # 管理后台
    location /admin/ {
        alias /www/wwwroot/admin/;
        try_files $uri $uri/ /admin/index.html;
        index index.html;
    }
    
    # H5前端
    location /h5/ {
        alias /www/wwwroot/h5/;
        try_files $uri $uri/ /h5/index.html;
        index index.html;
    }
    
    # 后端API
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 测试配置
nginx -t

# 重启 Nginx
nginx -s reload
```

### 第九步：配置防火墙

```bash
# 开放HTTP端口
firewall-cmd --permanent --add-service=http
firewall-cmd --reload

# 或者
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --reload
```

### 第十步：验证部署

```bash
# 检查服务状态
pm2 status
systemctl status nginx
systemctl status mysqld

# 检查端口
netstat -tlnp | grep -E '3001|80'

# 查看后端日志
pm2 logs xinfu-backend --lines 50
```

## 访问地址

- **管理后台：** http://124.222.88.25/admin/
- **H5前端：** http://124.222.88.25/h5/
- **API测试：** http://124.222.88.25/api/v1/health

## 常见问题

### 1. 后端无法启动

```bash
# 查看详细日志
pm2 logs xinfu-backend --lines 100

# 检查环境变量
cat /www/projects/xinfu-project/backend/.env

# 测试数据库连接
mysql -u xinfu_user -pXinfu2026Pass! -e "SELECT 1;"
```

### 2. 前端404

```bash
# 检查文件
ls -la /www/wwwroot/admin/
ls -la /www/wwwroot/h5/

# 检查Nginx配置
nginx -t
cat /etc/nginx/conf.d/xinfu.conf

# 重启Nginx
nginx -s reload
```

### 3. API 502错误

```bash
# 确认后端运行
pm2 status

# 确认端口监听
netstat -tlnp | grep 3001

# 测试本地API
curl http://127.0.0.1:3001/api/v1/health
```

## 从旧服务器备份数据

如果需要从旧服务器 (115.159.58.73) 备份数据：

```bash
# 在本地执行
ssh root@115.159.58.73

# 在旧服务器上备份
mysqldump -u root -p xinfu_db > /root/xinfu_db_backup_$(date +%Y%m%d).sql

# 退出旧服务器
exit

# 下载备份到本地
scp root@115.159.58.73:/root/xinfu_db_backup_*.sql ~/Desktop/

# 上传到新服务器
scp ~/Desktop/xinfu_db_backup_*.sql root@124.222.88.25:/tmp/
```

## 完成后

✅ 登录管理后台测试功能  
✅ 测试H5前端各功能模块  
✅ 检查数据完整性  
✅ 设置定期备份（参考：`deployment/新服务器部署指南.md`）  
✅ 配置HTTPS（如果有域名）  
