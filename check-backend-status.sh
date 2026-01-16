#!/bin/bash

echo "=== 后端服务诊断脚本 ==="
echo ""

# 1. 检查端口占用
echo "1️⃣ 检查端口 3000 占用情况:"
lsof -ti:3000 && echo "   ✅ 端口 3000 被占用" || echo "   ❌ 端口 3000 空闲"
echo ""

# 2. 检查 Node.js 进程
echo "2️⃣ 检查 Node.js 后端进程:"
ps aux | grep "nest start" | grep -v grep && echo "   ✅ 找到 nest 进程" || echo "   ❌ 未找到 nest 进程"
echo ""

# 3. 检查编译产物
echo "3️⃣ 检查编译产物:"
if [ -d "/Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发/backend/dist" ]; then
    echo "   ✅ dist 目录存在"
    echo "   最近修改时间: $(stat -f "%Sm" /Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发/backend/dist)"
else
    echo "   ❌ dist 目录不存在，需要编译"
fi
echo ""

# 4. 测试健康检查端点
echo "4️⃣ 测试健康检查端点:"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/v1/health 2>/dev/null)
if [ "$response" = "200" ]; then
    echo "   ✅ 健康检查通过 (HTTP 200)"
    curl -s http://localhost:3000/api/v1/health
else
    echo "   ❌ 健康检查失败 (HTTP $response)"
fi
echo ""

# 5. 检查数据库连接
echo "5️⃣ 检查 MySQL 连接:"
mysqladmin ping -h127.0.0.1 -P3306 2>/dev/null && echo "   ✅ MySQL 可访问" || echo "   ⚠️  MySQL 连接检查失败（可能需要密码）"
echo ""

echo "=== 诊断完成 ==="

