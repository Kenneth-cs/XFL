#!/bin/bash
# 数据库迁移脚本：本地 → 服务器
# 执行前请确保本地数据库数据正确！

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  幸福力项目 - 数据库迁移脚本"
echo "  本地 → 服务器 (124.222.88.25)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 配置
LOCAL_DB_USER="root"
LOCAL_DB_PASS="123456"
LOCAL_DB_NAME="xinfu_db"
REMOTE_HOST="124.222.88.25"
REMOTE_USER="ubuntu"
REMOTE_DB_USER="root"
REMOTE_DB_PASS="Xinfuli2024!"
REMOTE_DB_NAME="xinfu_db"
SSH_KEY="$HOME/.ssh/XFL.pem"
BACKUP_DIR="./database-backup-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

echo "━━━ 第1步：备份服务器数据库 ━━━"
echo "正在备份服务器数据库到本地..."
ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" "mysqldump -u$REMOTE_DB_USER -p'$REMOTE_DB_PASS' $REMOTE_DB_NAME" > "$BACKUP_DIR/server-backup.sql"

if [ $? -eq 0 ]; then
    echo "✅ 服务器数据库备份完成: $BACKUP_DIR/server-backup.sql"
else
    echo "❌ 服务器数据库备份失败！"
    exit 1
fi

echo ""
echo "━━━ 第2步：导出本地数据库 ━━━"
echo "正在导出本地数据库..."
mysqldump -u$LOCAL_DB_USER -p$LOCAL_DB_PASS $LOCAL_DB_NAME > "$BACKUP_DIR/local-export.sql"

if [ $? -eq 0 ]; then
    echo "✅ 本地数据库导出完成: $BACKUP_DIR/local-export.sql"
    echo "   文件大小: $(ls -lh $BACKUP_DIR/local-export.sql | awk '{print $5}')"
else
    echo "❌ 本地数据库导出失败！请检查MySQL连接"
    exit 1
fi

echo ""
echo "━━━ 第3步：上传本地数据到服务器 ━━━"
echo "正在上传SQL文件到服务器..."
scp -i "$SSH_KEY" "$BACKUP_DIR/local-export.sql" "$REMOTE_USER@$REMOTE_HOST:/tmp/xinfu_import.sql"

if [ $? -eq 0 ]; then
    echo "✅ 文件上传完成"
else
    echo "❌ 文件上传失败！"
    exit 1
fi

echo ""
echo "━━━ 第4步：在服务器上导入数据 ━━━"
echo "⚠️  警告：即将覆盖服务器数据库！"
read -p "确认继续？(输入 YES 继续): " confirm

if [ "$confirm" != "YES" ]; then
    echo "❌ 操作已取消"
    exit 0
fi

ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << ENDSSH
echo "正在服务器上导入数据..."
mysql -u$REMOTE_DB_USER -p'$REMOTE_DB_PASS' $REMOTE_DB_NAME < /tmp/xinfu_import.sql

if [ \$? -eq 0 ]; then
    echo "✅ 数据导入成功"
    rm /tmp/xinfu_import.sql
    echo "🔄 重启后端服务..."
    pm2 restart xinfu-backend
else
    echo "❌ 数据导入失败！"
    exit 1
fi
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ 数据库迁移完成！"
echo ""
echo "  📁 备份文件保存在: $BACKUP_DIR/"
echo "     - server-backup.sql (服务器原数据，可用于回滚)"
echo "     - local-export.sql  (本地数据副本)"
echo ""
echo "  🔄 后续操作："
echo "     1. 清除浏览器缓存"
echo "     2. 重新登录后台: http://124.222.88.25:8080/admin/"
echo "     3. 测试智能匹配功能"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
