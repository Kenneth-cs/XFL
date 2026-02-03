#!/bin/bash

# 新服务器一键部署脚本
# 使用方法：./deploy-to-new-server.sh

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 服务器配置
NEW_SERVER="124.222.88.25"
OLD_SERVER="115.159.58.73"
PROJECT_DIR="/Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发"
DATE=$(date +%Y%m%d_%H%M%S)

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  幸福力项目 - 新服务器部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 步骤1：准备本地部署包
echo -e "${YELLOW}[步骤1/7] 准备本地部署包...${NC}"
cd "$PROJECT_DIR"

# 构建后端
echo "构建后端..."
cd backend
npm run build
cd ..

# 构建前端管理系统
echo "构建前端管理系统..."
cd frontend-admin
npx vite build --mode production
cd ..

# 构建前端H5
echo "构建前端H5..."
cd frontend-h5
npx vite build --mode production
cd ..

# 打包部署文件
echo "打包部署文件..."
tar -czf "xinfu-deploy-${DATE}.tar.gz" \
  backend/dist \
  backend/package.json \
  backend/package-lock.json \
  frontend-admin/dist \
  frontend-h5/dist \
  database/*.sql \
  deployment/*.sh

echo -e "${GREEN}✓ 部署包已创建：xinfu-deploy-${DATE}.tar.gz${NC}"

# 步骤2：从旧服务器备份数据（可选）
echo -e "${YELLOW}[步骤2/7] 从旧服务器备份数据...${NC}"
read -p "是否需要从旧服务器(${OLD_SERVER})备份数据？(y/n): " backup_old
if [ "$backup_old" = "y" ]; then
    echo "连接旧服务器备份数据库..."
    read -p "请输入旧服务器密码: " -s old_password
    echo ""
    
    # 在旧服务器上备份
    sshpass -p "$old_password" ssh root@$OLD_SERVER "mysqldump -u root -p xinfu_db > /root/xinfu_db_backup_${DATE}.sql" || echo "备份失败，将使用初始SQL"
    
    # 下载备份到本地
    sshpass -p "$old_password" scp root@$OLD_SERVER:/root/xinfu_db_backup_${DATE}.sql ./xinfu_db_backup_${DATE}.sql || echo "下载备份失败"
    
    if [ -f "./xinfu_db_backup_${DATE}.sql" ]; then
        echo -e "${GREEN}✓ 数据库备份完成${NC}"
    fi
else
    echo "跳过旧服务器数据备份"
fi

# 步骤3：上传到新服务器
echo -e "${YELLOW}[步骤3/7] 上传文件到新服务器...${NC}"
read -p "请输入新服务器(${NEW_SERVER})密码: " -s new_password
echo ""

# 上传部署包
echo "上传部署包..."
sshpass -p "$new_password" scp "xinfu-deploy-${DATE}.tar.gz" root@$NEW_SERVER:/tmp/

# 如果有备份文件，也上传
if [ -f "./xinfu_db_backup_${DATE}.sql" ]; then
    echo "上传数据库备份..."
    sshpass -p "$new_password" scp "./xinfu_db_backup_${DATE}.sql" root@$NEW_SERVER:/tmp/
fi

echo -e "${GREEN}✓ 文件上传完成${NC}"

# 步骤4：创建部署脚本
echo -e "${YELLOW}[步骤4/7] 创建服务器端部署脚本...${NC}"

cat > /tmp/server_deploy.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
set -e

echo "======================================"
echo "  开始服务器端部署"
echo "======================================"

# 检查并安装必要软件
echo "[1/8] 检查系统环境..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "安装 Node.js 20.x..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    yum install -y nodejs
fi
echo "Node.js 版本: $(node -v)"

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi
echo "PM2 版本: $(pm2 -v)"

# 检查 MySQL
if ! command -v mysql &> /dev/null; then
    echo "安装 MySQL 8.0..."
    wget -q https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
    rpm -ivh mysql80-community-release-el7-3.noarch.rpm
    yum install -y mysql-server
    systemctl start mysqld
    systemctl enable mysqld
    echo "MySQL 已安装，请记录临时密码："
    grep 'temporary password' /var/log/mysqld.log || echo "未找到临时密码"
fi

# 检查 Nginx
if ! command -v nginx &> /dev/null; then
    echo "安装 Nginx..."
    yum install -y nginx
    systemctl start nginx
    systemctl enable nginx
fi

# 检查 Redis
if ! command -v redis-cli &> /dev/null; then
    echo "安装 Redis..."
    yum install -y redis
    systemctl start redis
    systemctl enable redis
fi

# 创建目录
echo "[2/8] 创建项目目录..."
mkdir -p /www/projects/xinfu-project
mkdir -p /www/wwwroot/admin
mkdir -p /www/wwwroot/h5
mkdir -p /www/logs

# 解压部署包
echo "[3/8] 解压部署包..."
cd /www/projects/xinfu-project
tar -xzf /tmp/xinfu-deploy-*.tar.gz

# 配置数据库
echo "[4/8] 配置数据库..."
read -p "请输入MySQL root密码: " -s mysql_root_pwd
echo ""

# 创建数据库和用户
mysql -u root -p"$mysql_root_pwd" << EOF
CREATE DATABASE IF NOT EXISTS xinfu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'xinfu_user'@'localhost' IDENTIFIED BY 'Xinfu2026Pass!';
GRANT ALL PRIVILEGES ON xinfu_db.* TO 'xinfu_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# 导入数据
echo "[5/8] 导入数据..."
if [ -f "/tmp/xinfu_db_backup_*.sql" ]; then
    echo "导入备份数据..."
    mysql -u root -p"$mysql_root_pwd" xinfu_db < /tmp/xinfu_db_backup_*.sql
else
    echo "导入初始SQL..."
    mysql -u root -p"$mysql_root_pwd" xinfu_db < /www/projects/xinfu-project/database/02_create_tables.sql
    mysql -u root -p"$mysql_root_pwd" xinfu_db < /www/projects/xinfu-project/database/03_init_data.sql
    mysql -u root -p"$mysql_root_pwd" xinfu_db < /www/projects/xinfu-project/database/04_assessment_tables.sql
    mysql -u root -p"$mysql_root_pwd" xinfu_db < /www/projects/xinfu-project/database/06_match_tables.sql
fi

# 配置后端
echo "[6/8] 配置后端..."
cd /www/projects/xinfu-project/backend

# 创建环境变量文件
cat > .env << EOF
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=xinfu_user
DB_PASSWORD=Xinfu2026Pass!
DB_DATABASE=xinfu_db

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=$(openssl rand -hex 32)

PORT=3001
NODE_ENV=production
EOF

# 安装依赖
npm install --production

# 配置 PM2
cd /www/projects/xinfu-project
cat > ecosystem.config.js << 'PM2_CONFIG'
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
PM2_CONFIG

# 启动后端
pm2 delete xinfu-backend 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "[7/8] 部署前端..."
# 复制前端文件
cp -r /www/projects/xinfu-project/frontend-admin/dist/* /www/wwwroot/admin/
cp -r /www/projects/xinfu-project/frontend-h5/dist/* /www/wwwroot/h5/

# 配置 Nginx
echo "[8/8] 配置 Nginx..."
cat > /etc/nginx/conf.d/xinfu.conf << 'NGINX_CONFIG'
server {
    listen 80;
    server_name _;
    
    location /admin/ {
        alias /www/wwwroot/admin/;
        try_files $uri $uri/ /admin/index.html;
        index index.html;
    }
    
    location /h5/ {
        alias /www/wwwroot/h5/;
        try_files $uri $uri/ /h5/index.html;
        index index.html;
    }
    
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
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONFIG

# 测试并重启 Nginx
nginx -t && nginx -s reload

# 配置防火墙
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http 2>/dev/null || true
    firewall-cmd --reload 2>/dev/null || true
fi

echo "======================================"
echo "  部署完成！"
echo "======================================"
echo ""
echo "访问地址："
echo "  管理后台: http://$(hostname -I | awk '{print $1}')/admin/"
echo "  H5前端:   http://$(hostname -I | awk '{print $1}')/h5/"
echo ""
echo "服务状态："
pm2 status
echo ""
echo "日志查看："
echo "  pm2 logs xinfu-backend"
DEPLOY_SCRIPT

# 上传部署脚本
sshpass -p "$new_password" scp /tmp/server_deploy.sh root@$NEW_SERVER:/tmp/
sshpass -p "$new_password" ssh root@$NEW_SERVER "chmod +x /tmp/server_deploy.sh"

echo -e "${GREEN}✓ 部署脚本已创建${NC}"

# 步骤5：执行部署
echo -e "${YELLOW}[步骤5/7] 在新服务器上执行部署...${NC}"
read -p "是否现在执行自动部署？(y/n): " run_deploy
if [ "$run_deploy" = "y" ]; then
    sshpass -p "$new_password" ssh -t root@$NEW_SERVER "/tmp/server_deploy.sh"
else
    echo "请手动登录服务器执行: /tmp/server_deploy.sh"
fi

# 步骤6：验证部署
echo -e "${YELLOW}[步骤6/7] 验证部署...${NC}"
sleep 3
echo "测试API连接..."
curl -s "http://${NEW_SERVER}/api/v1/health" && echo -e "${GREEN}✓ API正常${NC}" || echo -e "${RED}✗ API连接失败${NC}"

# 步骤7：清理
echo -e "${YELLOW}[步骤7/7] 清理临时文件...${NC}"
read -p "是否清理本地临时文件？(y/n): " clean_local
if [ "$clean_local" = "y" ]; then
    rm -f "xinfu-deploy-${DATE}.tar.gz"
    rm -f "./xinfu_db_backup_${DATE}.sql"
    echo -e "${GREEN}✓ 本地临时文件已清理${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "访问地址："
echo "  管理后台: http://${NEW_SERVER}/admin/"
echo "  H5前端:   http://${NEW_SERVER}/h5/"
echo ""
echo "后续操作："
echo "  1. 登录新服务器检查服务状态: ssh root@${NEW_SERVER}"
echo "  2. 查看后端日志: pm2 logs xinfu-backend"
echo "  3. 配置域名（如果需要）"
echo "  4. 配置HTTPS证书（建议）"
echo "  5. 设置定期备份任务"
echo ""
