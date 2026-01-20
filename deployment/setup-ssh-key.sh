#!/bin/bash

echo "=========================================="
echo "🔐 SSH 密钥自动配置脚本"
echo "=========================================="
echo ""

# 设置变量
SERVER_IP="115.159.58.73"
KEY_NAME="xinfu_project"
KEY_PATH="$HOME/.ssh/$KEY_NAME"

echo "📋 配置信息："
echo "   服务器IP: $SERVER_IP"
echo "   密钥名称: $KEY_NAME"
echo "   密钥路径: $KEY_PATH"
echo ""

# 检查是否已存在密钥
if [ -f "$KEY_PATH" ]; then
    echo "⚠️  发现已存在的密钥文件: $KEY_PATH"
    read -p "是否使用现有密钥？(y/n): " use_existing
    if [ "$use_existing" != "y" ] && [ "$use_existing" != "Y" ]; then
        read -p "请输入新的密钥名称: " new_key_name
        KEY_NAME="$new_key_name"
        KEY_PATH="$HOME/.ssh/$KEY_NAME"
    else
        echo "✅ 使用现有密钥"
        SKIP_GENERATE=true
    fi
fi

# 生成新密钥
if [ "$SKIP_GENERATE" != "true" ]; then
    echo ""
    echo "🔑 正在生成 SSH 密钥对..."
    echo ""
    
    # 创建 .ssh 目录
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    
    # 生成密钥（使用 ED25519 算法）
    ssh-keygen -t ed25519 -C "xinfu-project" -f "$KEY_PATH" -N ""
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 密钥生成成功！"
        echo "   私钥: $KEY_PATH"
        echo "   公钥: ${KEY_PATH}.pub"
        echo ""
    else
        echo "❌ 密钥生成失败！"
        exit 1
    fi
    
    # 设置正确的权限
    chmod 600 "$KEY_PATH"
    chmod 644 "${KEY_PATH}.pub"
fi

# 显示公钥
echo "=========================================="
echo "📄 您的公钥内容："
echo "=========================================="
cat "${KEY_PATH}.pub"
echo "=========================================="
echo ""

# 询问服务器用户名
echo "❓ 请选择服务器登录用户："
echo "   1) root"
echo "   2) ubuntu"
echo "   3) 其他（手动输入）"
read -p "请选择 (1-3): " user_choice

case $user_choice in
    1)
        SERVER_USER="root"
        ;;
    2)
        SERVER_USER="ubuntu"
        ;;
    3)
        read -p "请输入用户名: " SERVER_USER
        ;;
    *)
        echo "使用默认用户: ubuntu"
        SERVER_USER="ubuntu"
        ;;
esac

echo ""
echo "=========================================="
echo "📤 接下来需要将公钥上传到服务器"
echo "=========================================="
echo ""
echo "方式一：自动上传（推荐，需要输入服务器密码）"
echo "   命令: ssh-copy-id -i ${KEY_PATH}.pub ${SERVER_USER}@${SERVER_IP}"
echo ""
echo "方式二：手动上传（如果自动上传失败）"
echo "   1. 登录服务器: ssh ${SERVER_USER}@${SERVER_IP}"
echo "   2. 在服务器上执行:"
echo "      mkdir -p ~/.ssh && chmod 700 ~/.ssh"
echo "      echo '$(cat ${KEY_PATH}.pub)' >> ~/.ssh/authorized_keys"
echo "      chmod 600 ~/.ssh/authorized_keys"
echo ""
echo "方式三：使用腾讯云 VNC 登录"
echo "   1. 访问腾讯云控制台"
echo "   2. 找到实例 ins-n1ouopal，点击"登录" → "VNC登录""
echo "   3. 执行方式二中的命令"
echo ""

read -p "是否现在执行自动上传？(y/n): " do_upload

if [ "$do_upload" == "y" ] || [ "$do_upload" == "Y" ]; then
    echo ""
    echo "🚀 开始上传公钥..."
    echo "⚠️  接下来会要求输入服务器密码（这是最后一次使用密码）"
    echo ""
    
    ssh-copy-id -i "${KEY_PATH}.pub" "${SERVER_USER}@${SERVER_IP}"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 公钥上传成功！"
        echo ""
        echo "🧪 正在测试密钥登录..."
        ssh -i "$KEY_PATH" -o BatchMode=yes -o ConnectTimeout=5 "${SERVER_USER}@${SERVER_IP}" "echo '连接成功！'" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ 密钥登录测试成功！"
        else
            echo "⚠️  密钥登录测试失败，请手动检查"
        fi
    else
        echo ""
        echo "❌ 公钥上传失败，请尝试手动上传"
        echo "   或使用腾讯云 VNC 登录方式"
    fi
fi

# 生成 SSH config
echo ""
echo "=========================================="
echo "📝 配置 SSH Config 文件"
echo "=========================================="
echo ""

CONFIG_ENTRY="
Host xinfu-server
    HostName ${SERVER_IP}
    User ${SERVER_USER}
    IdentityFile ${KEY_PATH}
    ServerAliveInterval 60
    ServerAliveCountMax 3
"

echo "建议在 ~/.ssh/config 中添加以下配置："
echo "$CONFIG_ENTRY"
echo ""

read -p "是否自动添加到 ~/.ssh/config？(y/n): " add_config

if [ "$add_config" == "y" ] || [ "$add_config" == "Y" ]; then
    # 检查是否已存在相同配置
    if grep -q "Host xinfu-server" ~/.ssh/config 2>/dev/null; then
        echo "⚠️  发现已存在 xinfu-server 配置，跳过添加"
    else
        echo "$CONFIG_ENTRY" >> ~/.ssh/config
        chmod 600 ~/.ssh/config
        echo "✅ 配置已添加到 ~/.ssh/config"
    fi
    
    echo ""
    echo "🎉 现在您可以使用以下命令连接服务器："
    echo "   ssh xinfu-server"
else
    echo ""
    echo "🎉 现在您可以使用以下命令连接服务器："
    echo "   ssh -i ${KEY_PATH} ${SERVER_USER}@${SERVER_IP}"
fi

echo ""
echo "=========================================="
echo "✅ SSH 密钥配置完成！"
echo "=========================================="
echo ""
echo "📝 重要文件位置："
echo "   私钥（保密）: $KEY_PATH"
echo "   公钥（可分享）: ${KEY_PATH}.pub"
echo ""
echo "🔒 安全提示："
echo "   1. 私钥文件请妥善保管，不要分享给任何人"
echo "   2. 建议定期备份私钥文件"
echo "   3. 配置成功后，建议在服务器上禁用密码登录"
echo ""
echo "📚 下一步："
echo "   1. 测试 SSH 连接: ssh xinfu-server 或 ssh -i ${KEY_PATH} ${SERVER_USER}@${SERVER_IP}"
echo "   2. 继续部署项目"
echo ""
