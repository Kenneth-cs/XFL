#!/bin/bash
# 修复并启动幸福力项目

echo "=========================================="
echo "🔧 修复部署配置并启动服务"
echo "=========================================="
echo ""

# 进入项目目录
cd /www/projects/xinfu-project

# 1. 修复 PM2 配置文件
echo "📝 修复 PM2 配置..."
cat > ecosystem.config.js << 'PM2_EOF'
module.exports = {
  apps: [{
    name: 'xinfu-backend',
    script: './dist/main.js',
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
echo "✅ PM2 配置已修复"
echo ""

# 2. 检查后端构建产物
echo "🔍 检查后端构建产物..."
if [ -f "/www/projects/xinfu-project/backend/dist/main.js" ]; then
    echo "✅ 后端已构建"
    ls -lh /www/projects/xinfu-project/backend/dist/main.js
else
    echo "⚠️  后端未构建，开始构建..."
    cd /www/projects/xinfu-project/backend
    npm install --omit=dev --registry=https://registry.npmmirror.com
    npm run build
    echo "✅ 后端构建完成"
fi
echo ""

# 3. 检查前端构建产物
echo "🔍 检查前端构建产物..."
echo "管理后台:"
ls -lh /www/projects/xinfu-project/frontend-admin/dist/ 2>/dev/null | head -5 || echo "  ⚠️  未构建"
echo ""
echo "H5前台:"
ls -lh /www/projects/xinfu-project/frontend-h5/dist/ 2>/dev/null | head -5 || echo "  ⚠️  未构建"
echo ""

# 4. 启动 PM2
echo "🚀 启动后端服务..."
cd /www/projects/xinfu-project
pm2 delete xinfu-backend 2>/dev/null || echo "  (清理旧进程)"
pm2 start ecosystem.config.js
pm2 save
echo "✅ PM2 已启动"
echo ""

# 5. 启动 Nginx
echo "🌐 启动 Nginx..."
systemctl start nginx 2>/dev/null && echo "✅ Nginx 已启动" || echo "⚠️  Nginx 启动失败，检查配置..."
echo ""

# 6. 验证服务状态
echo "=========================================="
echo "📊 服务状态"
echo "=========================================="
echo ""
echo "PM2 进程:"
pm2 list
echo ""
echo "端口监听:"
ss -tuln | grep -E ':3001|:8080'
echo ""
echo "Nginx 状态:"
systemctl status nginx --no-pager | head -5
echo ""

# 7. 检查后端日志
echo "=========================================="
echo "📋 后端日志（最新20行）"
echo "=========================================="
pm2 logs xinfu-backend --lines 20 --nostream 2>/dev/null || echo "暂无日志"
echo ""

echo "=========================================="
echo "🎉 操作完成！"
echo "=========================================="
echo ""
echo "📱 访问地址:"
echo "   管理后台: http://115.159.58.73:8080/admin"
echo "   H5前台: http://115.159.58.73:8080/h5"
echo "   API: http://115.159.58.73:8080/api"
echo ""
echo "🔧 常用命令:"
echo "   查看日志: pm2 logs xinfu-backend"
echo "   重启服务: pm2 restart xinfu-backend"
echo "   查看状态: pm2 status"
echo ""
