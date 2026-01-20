#!/bin/bash
# 请在服务器终端中执行此脚本

echo "=========================================="
echo "🔍 服务器环境检查"
echo "=========================================="
echo ""

echo "📌 1. 监听端口:"
ss -tuln | grep LISTEN | awk '{print $5}' | sed 's/.*://' | sort -n | uniq
echo ""

echo "📌 2. 详细端口占用:"
ss -tulnp | grep LISTEN
echo ""

echo "📌 3. Node.js进程:"
ps aux | grep -E 'node|npm' | grep -v grep || echo "无"
echo ""

echo "📌 4. PM2状态:"
command -v pm2 &> /dev/null && pm2 list || echo "PM2未安装"
echo ""

echo "📌 5. 软件版本:"
echo -n "Node: " && (node -v 2>/dev/null || echo "未安装")
echo -n "npm: " && (npm -v 2>/dev/null || echo "未安装")
echo -n "Nginx: " && (nginx -v 2>&1 || echo "未安装")
echo -n "MySQL: " && (mysql --version 2>/dev/null || echo "未安装")
echo ""

echo "📌 6. 磁盘和内存:"
df -h / | tail -1
free -h | grep Mem
echo ""

echo "✅ 完成！请将以上输出复制给AI"
