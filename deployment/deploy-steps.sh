#!/bin/bash
# 幸福力项目自动化部署脚本
# 使用方法: 在服务器上逐步执行各个步骤

set -e  # 遇到错误立即退出

echo "=========================================="
echo "🚀 幸福力项目部署脚本"
echo "=========================================="
echo ""

# 配置变量
PROJECT_NAME="xinfu-project"
DEPLOY_DIR="/www/projects/$PROJECT_NAME"
BACKEND_PORT=3001
NGINX_PORT=8080  # 由于80被占用，使用8080
DB_NAME="xinfu_db"
DB_USER="xinfu_user"
DB_PASSWORD="Xinfu2026@Secure"  # 请修改为更安全的密码

# ==========================================
# 步骤1: 创建部署目录
# ==========================================
step1_create_directories() {
    echo "=========================================="
    echo "📁 步骤1: 创建部署目录"
    echo "=========================================="
    
    mkdir -p $DEPLOY_DIR/{backend,frontend-admin,frontend-h5,logs}
    mkdir -p /var/backups/xinfu
    
    echo "✅ 目录创建完成:"
    ls -lh $DEPLOY_DIR
    echo ""
}

# ==========================================
# 步骤2: 安装Nginx
# ==========================================
step2_install_nginx() {
    echo "=========================================="
    echo "📦 步骤2: 安装Nginx"
    echo "=========================================="
    
    if ! command -v nginx &> /dev/null; then
        echo "正在安装Nginx..."
        yum install -y nginx
        systemctl enable nginx
        systemctl start nginx
        echo "✅ Nginx安装完成"
    else
        echo "✅ Nginx已安装"
    fi
    
    nginx -v
    echo ""
}

# ==========================================
# 步骤3: 配置数据库
# ==========================================
step3_setup_database() {
    echo "=========================================="
    echo "🗄️  步骤3: 配置数据库"
    echo "=========================================="
    
    echo "创建数据库和用户..."
    mysql -u root -p << MYSQL_EOF
-- 创建数据库
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';

-- 授权
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;

-- 显示数据库
SHOW DATABASES LIKE '$DB_NAME';
MYSQL_EOF
    
    echo "✅ 数据库配置完成"
    echo ""
}

# ==========================================
# 步骤4: 上传项目文件 (需要在本地执行)
# ==========================================
step4_upload_files() {
    echo "=========================================="
    echo "📤 步骤4: 上传项目文件"
    echo "=========================================="
    echo ""
    echo "⚠️  此步骤需要在本地电脑执行以下命令:"
    echo ""
    echo "cd /Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发"
    echo ""
    echo "# 压缩项目文件"
    echo "tar --exclude='node_modules' --exclude='.git' --exclude='*.log' --exclude='dist' -czf xinfu-project.tar.gz backend frontend-admin frontend-h5 database"
    echo ""
    echo "# 上传到服务器"
    echo "scp xinfu-project.tar.gz root@115.159.58.73:/tmp/"
    echo ""
    echo "# 在服务器上解压"
    echo "tar -xzf /tmp/xinfu-project.tar.gz -C $DEPLOY_DIR --strip-components=0"
    echo "rm /tmp/xinfu-project.tar.gz"
    echo ""
    read -p "完成上传后按回车继续..."
}

# ==========================================
# 步骤5: 配置后端环境变量
# ==========================================
step5_configure_backend() {
    echo "=========================================="
    echo "⚙️  步骤5: 配置后端环境变量"
    echo "=========================================="
    
    cat > $DEPLOY_DIR/backend/.env.production << ENV_EOF
# 应用配置
NODE_ENV=production
PORT=$BACKEND_PORT

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_DATABASE=$DB_NAME

# JWT配置
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=http://115.159.58.73:$NGINX_PORT,http://115.159.58.73
ENV_EOF
    
    echo "✅ 环境变量配置完成"
    cat $DEPLOY_DIR/backend/.env.production
    echo ""
}

# ==========================================
# 步骤6: 安装依赖并构建
# ==========================================
step6_build_projects() {
    echo "=========================================="
    echo "🔨 步骤6: 安装依赖并构建"
    echo "=========================================="
    
    # 后端
    echo "构建后端..."
    cd $DEPLOY_DIR/backend
    npm install --production
    npm run build
    echo "✅ 后端构建完成"
    echo ""
    
    # 管理后台
    echo "构建管理后台..."
    cd $DEPLOY_DIR/frontend-admin
    npm install
    npm run build
    echo "✅ 管理后台构建完成"
    echo ""
    
    # H5前台
    echo "构建H5前台..."
    cd $DEPLOY_DIR/frontend-h5
    npm install
    npm run build
    echo "✅ H5前台构建完成"
    echo ""
}

# ==========================================
# 步骤7: 导入数据库表结构
# ==========================================
step7_import_database() {
    echo "=========================================="
    echo "📊 步骤7: 导入数据库表结构"
    echo "=========================================="
    
    cd $DEPLOY_DIR/database
    
    echo "导入SQL文件..."
    for sql_file in *.sql; do
        if [ -f "$sql_file" ]; then
            echo "  - 导入 $sql_file"
            mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < "$sql_file" || echo "    ⚠️  $sql_file 导入失败（可能已存在）"
        fi
    done
    
    echo "✅ 数据库表结构导入完成"
    echo ""
}

# ==========================================
# 步骤8: 配置PM2
# ==========================================
step8_configure_pm2() {
    echo "=========================================="
    echo "🔧 步骤8: 配置PM2"
    echo "=========================================="
    
    cat > $DEPLOY_DIR/ecosystem.config.js << PM2_EOF
module.exports = {
  apps: [{
    name: 'xinfu-backend',
    script: './backend/dist/main.js',
    cwd: '$DEPLOY_DIR/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',  // 考虑到服务器内存较小
    env: {
      NODE_ENV: 'production',
      PORT: $BACKEND_PORT
    },
    error_file: '$DEPLOY_DIR/logs/backend-error.log',
    out_file: '$DEPLOY_DIR/logs/backend-out.log',
    log_file: '$DEPLOY_DIR/logs/backend-combined.log',
    time: true,
    merge_logs: true
  }]
};
PM2_EOF
    
    # 启动应用
    cd $DEPLOY_DIR
    pm2 start ecosystem.config.js
    pm2 save
    
    echo "✅ PM2配置完成，应用已启动"
    pm2 list
    echo ""
}

# ==========================================
# 步骤9: 配置Nginx
# ==========================================
step9_configure_nginx() {
    echo "=========================================="
    echo "🌐 步骤9: 配置Nginx"
    echo "=========================================="
    
    cat > /etc/nginx/conf.d/xinfu-project.conf << NGINX_EOF
# 幸福力项目 Nginx 配置

# 后端API代理
upstream xinfu_backend {
    server 127.0.0.1:$BACKEND_PORT;
}

# 主服务器配置
server {
    listen $NGINX_PORT;
    server_name 115.159.58.73;
    
    # 日志
    access_log /var/log/nginx/xinfu-access.log;
    error_log /var/log/nginx/xinfu-error.log;
    
    # 管理后台
    location /admin {
        alias $DEPLOY_DIR/frontend-admin/dist;
        try_files \$uri \$uri/ /admin/index.html;
        index index.html;
    }
    
    # H5前台
    location /h5 {
        alias $DEPLOY_DIR/frontend-h5/dist;
        try_files \$uri \$uri/ /h5/index.html;
        index index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://xinfu_backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # 默认首页
    location = / {
        return 301 /admin;
    }
}
NGINX_EOF
    
    # 测试配置
    nginx -t
    
    # 重启Nginx
    systemctl restart nginx
    
    echo "✅ Nginx配置完成"
    echo ""
}

# ==========================================
# 步骤10: 配置防火墙
# ==========================================
step10_configure_firewall() {
    echo "=========================================="
    echo "🔥 步骤10: 配置防火墙"
    echo "=========================================="
    
    # 检查firewalld是否运行
    if systemctl is-active --quiet firewalld; then
        echo "配置firewalld..."
        firewall-cmd --permanent --add-port=$NGINX_PORT/tcp
        firewall-cmd --reload
        echo "✅ 防火墙端口 $NGINX_PORT 已开放"
    else
        echo "⚠️  firewalld未运行，跳过防火墙配置"
    fi
    
    echo ""
    echo "⚠️  重要: 请在腾讯云控制台配置安全组规则:"
    echo "   1. 登录腾讯云控制台"
    echo "   2. 进入 云服务器 > 安全组"
    echo "   3. 添加入站规则: TCP:$NGINX_PORT, 来源: 0.0.0.0/0"
    echo ""
}

# ==========================================
# 步骤11: 验证部署
# ==========================================
step11_verify_deployment() {
    echo "=========================================="
    echo "✅ 步骤11: 验证部署"
    echo "=========================================="
    
    echo "检查后端API..."
    curl -s http://localhost:$BACKEND_PORT/api/v1/health || echo "⚠️  后端健康检查失败"
    echo ""
    
    echo "检查PM2状态..."
    pm2 list
    echo ""
    
    echo "检查Nginx状态..."
    systemctl status nginx --no-pager | head -5
    echo ""
    
    echo "检查端口监听..."
    ss -tuln | grep -E ":$BACKEND_PORT|:$NGINX_PORT"
    echo ""
    
    echo "=========================================="
    echo "🎉 部署完成！"
    echo "=========================================="
    echo ""
    echo "📱 访问地址:"
    echo "   管理后台: http://115.159.58.73:$NGINX_PORT/admin"
    echo "   H5前台: http://115.159.58.73:$NGINX_PORT/h5"
    echo "   API接口: http://115.159.58.73:$NGINX_PORT/api"
    echo ""
    echo "📊 管理命令:"
    echo "   查看后端日志: pm2 logs xinfu-backend"
    echo "   重启后端: pm2 restart xinfu-backend"
    echo "   查看Nginx日志: tail -f /var/log/nginx/xinfu-error.log"
    echo ""
}

# ==========================================
# 主菜单
# ==========================================
show_menu() {
    echo ""
    echo "=========================================="
    echo "📋 请选择要执行的步骤:"
    echo "=========================================="
    echo "  1) 创建部署目录"
    echo "  2) 安装Nginx"
    echo "  3) 配置数据库"
    echo "  4) 上传项目文件说明"
    echo "  5) 配置后端环境变量"
    echo "  6) 安装依赖并构建"
    echo "  7) 导入数据库表结构"
    echo "  8) 配置并启动PM2"
    echo "  9) 配置Nginx"
    echo " 10) 配置防火墙"
    echo " 11) 验证部署"
    echo " 12) 一键执行全部步骤"
    echo "  0) 退出"
    echo "=========================================="
    echo ""
}

# ==========================================
# 执行全部步骤
# ==========================================
run_all() {
    step1_create_directories
    step2_install_nginx
    step3_setup_database
    step4_upload_files
    step5_configure_backend
    step6_build_projects
    step7_import_database
    step8_configure_pm2
    step9_configure_nginx
    step10_configure_firewall
    step11_verify_deployment
}

# ==========================================
# 主程序
# ==========================================
if [ "$1" == "--all" ]; then
    run_all
    exit 0
fi

while true; do
    show_menu
    read -p "请输入选项 (0-12): " choice
    
    case $choice in
        1) step1_create_directories ;;
        2) step2_install_nginx ;;
        3) step3_setup_database ;;
        4) step4_upload_files ;;
        5) step5_configure_backend ;;
        6) step6_build_projects ;;
        7) step7_import_database ;;
        8) step8_configure_pm2 ;;
        9) step9_configure_nginx ;;
        10) step10_configure_firewall ;;
        11) step11_verify_deployment ;;
        12) run_all ;;
        0) echo "退出部署脚本"; exit 0 ;;
        *) echo "⚠️  无效选项，请重新选择" ;;
    esac
    
    read -p "按回车继续..."
done
