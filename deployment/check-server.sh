#!/bin/bash

echo "=========================================="
echo "🔍 服务器环境检查"
echo "=========================================="
echo ""

# 1. 检查操作系统信息
echo "📌 操作系统信息:"
cat /etc/os-release | grep -E "^NAME=|^VERSION=" || uname -a
echo ""

# 2. 检查已占用的端口
echo "📌 已占用的端口 (常用Web端口):"
netstat -tuln | grep -E ':(80|443|3000|3001|5000|5173|5174|5175|5183|8080|8888|9000)' || ss -tuln | grep -E ':(80|443|3000|3001|5000|5173|5174|5175|5183|8080|8888|9000)'
echo ""

# 3. 检查所有监听端口
echo "📌 所有监听的TCP端口:"
netstat -tuln | grep LISTEN | awk '{print $4}' | awk -F: '{print $NF}' | sort -n | uniq || ss -tuln | grep LISTEN | awk '{print $5}' | awk -F: '{print $NF}' | sort -n | uniq
echo ""

# 4. 检查运行中的Node.js进程
echo "📌 运行中的 Node.js 进程:"
ps aux | grep node | grep -v grep
echo ""

# 5. 检查运行中的PM2进程
echo "📌 PM2 管理的进程:"
if command -v pm2 &> /dev/null; then
    pm2 list
else
    echo "PM2 未安装"
fi
echo ""

# 6. 检查Nginx配置
echo "📌 Nginx 状态:"
if command -v nginx &> /dev/null; then
    nginx -v
    systemctl status nginx --no-pager -l || service nginx status
    echo ""
    echo "Nginx 配置文件:"
    ls -la /etc/nginx/sites-enabled/ 2>/dev/null || ls -la /etc/nginx/conf.d/ 2>/dev/null
else
    echo "Nginx 未安装"
fi
echo ""

# 7. 检查MySQL服务
echo "📌 MySQL 状态:"
if command -v mysql &> /dev/null; then
    mysql --version
    systemctl status mysql --no-pager -l || service mysql status
else
    echo "MySQL 未安装"
fi
echo ""

# 8. 检查Node.js版本
echo "📌 Node.js 版本:"
if command -v node &> /dev/null; then
    node -v
else
    echo "Node.js 未安装"
fi
echo ""

# 9. 检查npm版本
echo "📌 npm 版本:"
if command -v npm &> /dev/null; then
    npm -v
else
    echo "npm 未安装"
fi
echo ""

# 10. 检查磁盘空间
echo "📌 磁盘使用情况:"
df -h | grep -E "Filesystem|/$|/home|/var"
echo ""

# 11. 检查内存使用
echo "📌 内存使用情况:"
free -h
echo ""

# 12. 检查部署目录
echo "📌 常见部署目录:"
for dir in /var/www /home/ubuntu /root /opt; do
    if [ -d "$dir" ]; then
        echo "  $dir 内容:"
        ls -la "$dir" 2>/dev/null | head -20
        echo ""
    fi
done

echo "=========================================="
echo "✅ 检查完成"
echo "=========================================="
