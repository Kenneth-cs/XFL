#!/bin/bash

echo "=========================================="
echo "MySQL数据库检查和初始化脚本"
echo "=========================================="
echo ""

# 添加MySQL到PATH
export PATH="/usr/local/mysql/bin:$PATH"

echo "步骤1: 检查xingfuli数据库是否存在..."
echo "请输入MySQL root密码："
mysql -u root -p -e "SHOW DATABASES LIKE 'xingfuli';"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功连接到MySQL"
    echo ""
    echo "步骤2: 查看xingfuli数据库的表..."
    mysql -u root -p -e "USE xingfuli; SHOW TABLES;"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 数据库已存在并包含表"
        echo ""
        echo "步骤3: 查看表的记录数..."
        mysql -u root -p -e "
            USE xingfuli;
            SELECT 'sys_store' as table_name, COUNT(*) as count FROM sys_store
            UNION ALL
            SELECT 'sys_user', COUNT(*) FROM sys_user
            UNION ALL
            SELECT 'app_user', COUNT(*) FROM app_user;
        "
    else
        echo ""
        echo "⚠️ 数据库存在但没有表，需要初始化"
    fi
else
    echo ""
    echo "❌ 无法连接MySQL或数据库不存在"
    echo "可能需要初始化数据库"
fi

echo ""
echo "=========================================="
echo "如果需要初始化数据库，请运行："
echo "cd database"
echo "mysql -u root -p < 01_create_database.sql"
echo "mysql -u root -p < 02_create_tables.sql"
echo "mysql -u root -p < 03_init_data.sql"
echo "=========================================="

