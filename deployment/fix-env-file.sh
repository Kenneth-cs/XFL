#!/bin/bash
# fix-env-file.sh - 修复后端环境变量配置文件

echo "=========================================="
echo "🔧 修复后端环境变量配置"
echo "=========================================="

cd /www/projects/xinfu-project/backend

# 创建正确的 .env 文件（不是 .env.production）
cat > .env << 'ENV_EOF'
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=xinfu_user
DB_PASSWORD=Xinfu2026@Secure
DB_DATABASE=xinfu_db
JWT_SECRET=xinfu-project-jwt-secret-$(date +%s)-secure
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://115.159.58.73:8080,http://115.159.58.73
ENV_EOF

echo "✅ .env 文件已创建"
echo ""

# 显示文件内容（隐藏密码）
echo "📋 配置文件内容:"
cat .env | grep -v PASSWORD

echo ""
echo "🔄 重启后端服务..."
pm2 restart xinfu-backend

echo ""
echo "⏳ 等待5秒..."
sleep 5

echo ""
echo "=========================================="
echo "📊 检查服务状态"
echo "=========================================="
pm2 list

echo ""
echo "📋 查看最新日志（最后30行）:"
pm2 logs xinfu-backend --lines 30 --nostream

echo ""
echo "=========================================="
echo "✅ 修复完成！"
echo "=========================================="
