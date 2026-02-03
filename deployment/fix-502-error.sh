#!/bin/bash
# 502 错误紧急修复脚本

echo "🔍 开始诊断 502 错误..."
echo ""

# 1. 检查后端服务状态
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣ 检查 PM2 后端服务状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 status
echo ""

# 2. 检查端口监听
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣ 检查 3001 端口是否被监听"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if command -v netstat > /dev/null; then
    netstat -tlnp | grep 3001 || echo "❌ 端口 3001 未被监听"
else
    ss -tlnp | grep 3001 || echo "❌ 端口 3001 未被监听"
fi
echo ""

# 3. 查看后端日志（最近30行）
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣ 查看后端错误日志（最近30行）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 logs xinfu-backend --lines 30 --nostream --err
echo ""

# 4. 检查环境变量配置
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣ 检查后端环境变量"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f /www/projects/xinfu-project/backend/.env ]; then
    cat /www/projects/xinfu-project/backend/.env
else
    echo "❌ .env 文件不存在！"
fi
echo ""

# 5. 查看 Nginx 错误日志
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣ 查看 Nginx 错误日志（最近20行）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
tail -n 20 /var/log/nginx/error.log
echo ""

# 6. 尝试自动修复
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣ 尝试自动修复"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 6.1 检查并创建 .env 文件
if [ ! -f /www/projects/xinfu-project/backend/.env ]; then
    echo "⚠️ 创建缺失的 .env 文件..."
    cat > /www/projects/xinfu-project/backend/.env << 'ENVEOF'
NODE_ENV=production
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=xinfu_user
DB_PASSWORD=Xinfu@2024
DB_DATABASE=xinfu_db

# JWT配置
JWT_SECRET=xinfu-jwt-secret-2024
JWT_EXPIRES_IN=7d

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
ENVEOF
    echo "✅ .env 文件已创建"
fi

# 6.2 检查后端构建文件
echo "检查后端构建文件..."
if [ ! -f /www/projects/xinfu-project/backend/dist/main.js ]; then
    echo "⚠️ 后端未构建，开始构建..."
    cd /www/projects/xinfu-project/backend
    npm install
    npm run build
    echo "✅ 后端构建完成"
fi

# 6.3 重启后端服务
echo "重启后端服务..."
cd /www/projects/xinfu-project
pm2 restart xinfu-backend
sleep 3

# 7. 验证修复结果
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣ 验证修复结果"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 status
echo ""

if command -v netstat > /dev/null; then
    netstat -tlnp | grep 3001 && echo "✅ 后端服务已在 3001 端口监听" || echo "❌ 后端服务仍未监听 3001 端口"
else
    ss -tlnp | grep 3001 && echo "✅ 后端服务已在 3001 端口监听" || echo "❌ 后端服务仍未监听 3001 端口"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 诊断完成！"
echo ""
echo "请尝试刷新浏览器访问："
echo "   http://124.222.88.25:8080/admin"
echo ""
echo "如果仍有问题，请查看上方日志输出"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
