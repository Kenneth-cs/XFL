#!/bin/bash
# 在服务器上执行此命令进行一键部署

mkdir -p /www/projects/xinfu-project/{logs,database} && \
cd /www/projects/xinfu-project && \
tar -xzf /tmp/xinfu-project.tar.gz && \
rm /tmp/xinfu-project.tar.gz && \
echo "✅ 项目文件解压完成" && \
(command -v nginx &> /dev/null || (yum install -y nginx && systemctl enable nginx && systemctl start nginx)) && \
echo "✅ Nginx已就绪" && \
echo "配置数据库（请输入MySQL root密码）..." && \
mysql -u root -p << 'MYSQL_EOF'
CREATE DATABASE IF NOT EXISTS xinfu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'xinfu_user'@'localhost' IDENTIFIED BY 'Xinfu2026@Secure';
GRANT ALL PRIVILEGES ON xinfu_db.* TO 'xinfu_user'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES LIKE 'xinfu_db';
MYSQL_EOF
echo "✅ 数据库配置完成" && \
cd /www/projects/xinfu-project/database && \
for sql_file in *.sql; do
    [ -f "$sql_file" ] && mysql -u xinfu_user -p'Xinfu2026@Secure' xinfu_db < "$sql_file" 2>/dev/null && echo "  ✓ $sql_file"
done && \
echo "✅ 数据库表结构导入完成" && \
cd /www/projects/xinfu-project/backend && \
cat > .env.production << 'ENV_EOF'
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=xinfu_user
DB_PASSWORD=Xinfu2026@Secure
DB_DATABASE=xinfu_db
JWT_SECRET=xinfu-project-jwt-secret-$(date +%s)-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://115.159.58.73:8080,http://115.159.58.73
ENV_EOF
echo "✅ 后端环境变量配置完成" && \
echo "构建后端（这可能需要几分钟）..." && \
npm install --production --registry=https://registry.npmmirror.com && \
npm run build && \
echo "✅ 后端构建完成" && \
cd /www/projects/xinfu-project/frontend-admin && \
echo "构建管理后台（这可能需要几分钟）..." && \
npm install --registry=https://registry.npmmirror.com && \
npm run build && \
echo "✅ 管理后台构建完成" && \
cd /www/projects/xinfu-project/frontend-h5 && \
echo "构建H5前台（这可能需要几分钟）..." && \
npm install --registry=https://registry.npmmirror.com && \
npm run build && \
echo "✅ H5前台构建完成" && \
cd /www/projects/xinfu-project && \
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
    time: true
  }]
};
PM2_EOF
pm2 start ecosystem.config.js && \
pm2 save && \
echo "✅ PM2配置完成，后端已启动" && \
cat > /etc/nginx/conf.d/xinfu-project.conf << 'NGINX_EOF'
upstream xinfu_backend {
    server 127.0.0.1:3001;
}

server {
    listen 8080;
    server_name _;
    
    access_log /var/log/nginx/xinfu-access.log;
    error_log /var/log/nginx/xinfu-error.log;
    
    location /admin {
        alias /www/projects/xinfu-project/frontend-admin/dist;
        try_files $uri $uri/ /admin/index.html;
        index index.html;
    }
    
    location /h5 {
        alias /www/projects/xinfu-project/frontend-h5/dist;
        try_files $uri $uri/ /h5/index.html;
        index index.html;
    }
    
    location /api/ {
        proxy_pass http://xinfu_backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
    
    location = / {
        return 301 /admin;
    }
}
NGINX_EOF
nginx -t && systemctl restart nginx && \
echo "✅ Nginx配置完成" && \
(systemctl is-active --quiet firewalld && firewall-cmd --permanent --add-port=8080/tcp && firewall-cmd --reload && echo "✅ 防火墙已配置") || echo "⚠️  防火墙未配置（可能已禁用）" && \
echo "" && \
echo "==========================================" && \
echo "🎉 部署完成！" && \
echo "==========================================" && \
echo "" && \
echo "📊 服务状态:" && \
pm2 list && \
echo "" && \
echo "🔌 端口监听:" && \
ss -tuln | grep -E ':3001|:8080' && \
echo "" && \
echo "=========================================="&& \
echo "📱 访问地址:" && \
echo "   管理后台: http://115.159.58.73:8080/admin" && \
echo "   H5前台: http://115.159.58.73:8080/h5" && \
echo "   API: http://115.159.58.73:8080/api" && \
echo "" && \
echo "⚠️  重要: 请在腾讯云控制台开放安全组端口 8080" && \
echo "=========================================="
