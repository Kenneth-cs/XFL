# SSH 密钥配置指南
# SSH 密钥配置指南

## 🔐 方案一：从腾讯云控制台获取/创建密钥对（推荐）

### 步骤1：登录腾讯云控制台
1. 访问 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入 **云服务器 CVM** → **SSH 密钥**
3. 位置：左侧菜单 "实例与镜像" → "SSH 密钥"

### 步骤2：查看或创建密钥对

#### 如果已有密钥对：
- 查看是否已经绑定到您的服务器实例 `ins-n1ouopal`
- 如果已绑定，您应该已经有对应的私钥文件（.pem 或 .key）
- 私钥文件通常在创建时下载，保存在本地电脑上

#### 如果需要创建新密钥对：
1. 点击 **"创建密钥"**
2. 选择 **"创建新密钥对"**
3. 输入密钥名称（如：`xinfu-project-key`）
4. 点击 **"确定"**
5. **重要**: 浏览器会自动下载私钥文件（如 `xinfu-project-key.pem`），请妥善保管
6. 选择密钥后，点击 **"绑定实例"**
7. 选择您的服务器 `ins-n1ouopal`
8. 确认绑定

⚠️ **注意**：
- 私钥文件只会在创建时下载一次，腾讯云不会保存您的私钥
- 如果丢失私钥，只能重新创建新密钥对
- 绑定新密钥后，需要重启服务器才能生效

### 步骤3：配置本地 SSH

```bash
# 1. 将下载的密钥文件移动到 SSH 目录
mkdir -p ~/.ssh
mv ~/Downloads/xinfu-project-key.pem ~/.ssh/

# 2. 修改权限（必须，否则 SSH 会拒绝使用）
chmod 400 ~/.ssh/xinfu-project-key.pem

# 3. 测试连接（腾讯云默认用户通常是 ubuntu 或 root）
ssh -i ~/.ssh/xinfu-project-key.pem ubuntu@115.159.58.73
# 或
ssh -i ~/.ssh/xinfu-project-key.pem root@115.159.58.73
```

如果提示输入密码，说明密钥未正确绑定或用户名不对。

### 步骤4：（可选）简化SSH连接

编辑 `~/.ssh/config` 文件，添加配置：

```bash
# 编辑或创建 SSH 配置文件
nano ~/.ssh/config
```

添加以下内容：

```
Host xinfu-server
    HostName 115.159.58.73
    User ubuntu  # 或 root，根据实际情况
    IdentityFile ~/.ssh/xinfu-project-key.pem
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

保存后，就可以简单地使用：

```bash
ssh xinfu-server
```

---

## 🔐 方案二：使用本地生成的 SSH 密钥（更推荐）

这种方式不需要腾讯云控制台，更灵活且安全。

### 步骤1：在本地生成 SSH 密钥对

```bash
# 1. 生成新的 SSH 密钥对（使用 ED25519 算法，更安全）
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/xinfu_project

# 或使用传统的 RSA 算法（4096位）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/.ssh/xinfu_project

# 按提示操作：
# - Enter passphrase: 可以设置密码短语（更安全）或直接回车（方便）
# - 生成两个文件：
#   - ~/.ssh/xinfu_project (私钥，保密)
#   - ~/.ssh/xinfu_project.pub (公钥，可以分享)
```

### 步骤2：将公钥上传到服务器

#### 方式 A：使用 ssh-copy-id（最简单，需要知道服务器密码）

```bash
ssh-copy-id -i ~/.ssh/xinfu_project.pub ubuntu@115.159.58.73
# 或
ssh-copy-id -i ~/.ssh/xinfu_project.pub root@115.159.58.73

# 输入服务器密码后，公钥会自动添加到服务器的 ~/.ssh/authorized_keys
```

#### 方式 B：手动添加（如果方式A不可用）

1. **临时使用密码登录服务器**（最后一次使用密码）：
   ```bash
   ssh ubuntu@115.159.58.73
   ```

2. **在服务器上操作**：
   ```bash
   # 创建 .ssh 目录（如果不存在）
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   
   # 编辑 authorized_keys 文件
   nano ~/.ssh/authorized_keys
   ```

3. **在本地另开一个终端，查看公钥内容**：
   ```bash
   cat ~/.ssh/xinfu_project.pub
   ```

4. **将公钥内容复制粘贴到服务器的 authorized_keys 文件中**，保存并退出

5. **在服务器上设置正确的权限**：
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   ```

6. **退出服务器，测试密钥登录**：
   ```bash
   exit
   ssh -i ~/.ssh/xinfu_project ubuntu@115.159.58.73
   ```

#### 方式 C：通过腾讯云控制台的"自定义数据"功能（高级）

1. 在腾讯云控制台，找到您的实例
2. 关机后，选择 "更多" → "实例设置" → "自定义数据"
3. 添加以下脚本：
   ```bash
   #!/bin/bash
   echo "你的公钥内容" >> /home/ubuntu/.ssh/authorized_keys
   # 或
   echo "你的公钥内容" >> /root/.ssh/authorized_keys
   ```
4. 重启实例

### 步骤3：配置 SSH config（同方案一的步骤4）

```bash
nano ~/.ssh/config
```

添加：

```
Host xinfu-server
    HostName 115.159.58.73
    User ubuntu  # 或 root
    IdentityFile ~/.ssh/xinfu_project
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

### 步骤4：（重要）禁用密码登录，只允许密钥登录

配置好密钥登录后，为了安全，建议禁用密码登录：

```bash
# 1. SSH 连接到服务器
ssh xinfu-server

# 2. 备份 SSH 配置
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 3. 编辑 SSH 配置
sudo nano /etc/ssh/sshd_config

# 4. 修改以下配置项：
# PasswordAuthentication no          # 禁用密码登录
# PubkeyAuthentication yes           # 启用公钥登录
# PermitRootLogin prohibit-password  # 禁止 root 密码登录（可选）

# 5. 重启 SSH 服务
sudo systemctl restart sshd
# 或
sudo service ssh restart

# 6. 不要关闭当前 SSH 连接，新开一个终端测试
# 如果测试失败，在当前连接中恢复配置
```

⚠️ **注意**：修改 SSH 配置前，请确保至少有一个密钥登录连接是正常的，否则可能锁死自己！

---

## 🔐 方案三：通过腾讯云 VNC 登录（紧急情况）

如果您无法通过 SSH 连接，还可以使用腾讯云的 VNC 功能：

1. 登录腾讯云控制台
2. 找到您的实例 `ins-n1ouopal`
3. 点击 "登录" → "VNC 登录"
4. 在网页终端中操作

---

## 📝 我接下来需要什么信息？

配置好 SSH 密钥后，只需告诉我：

1. **SSH 用户名**: `ubuntu` 还是 `root`？
2. **私钥文件路径**: 例如 `~/.ssh/xinfu_project` 或 `~/.ssh/xinfu-project-key.pem`

或者，如果您已经配置了 `~/.ssh/config`，直接告诉我：

3. **SSH Host 别名**: 例如 `xinfu-server`

这样我就可以安全地帮您连接服务器并部署项目了！

---

## 🎯 为什么使用 SSH 密钥更安全？

1. **密码容易被暴力破解**：SSH 密钥的加密强度远超普通密码
2. **密钥不会在网络传输**：只有公钥在服务器上，私钥永远在本地
3. **可以设置多重保护**：私钥本身可以再加密码短语
4. **便于管理**：不同项目/用户可以用不同密钥
5. **支持密钥轮换**：定期更换密钥，增强安全性

---

## 💡 推荐流程

**如果您从未配置过 SSH 密钥**：
👉 使用 **方案二**（本地生成密钥），最灵活且学习价值高

**如果您已有腾讯云密钥对**：
👉 使用 **方案一**（从控制台绑定），最快捷

**如果遇到任何问题**：
👉 使用 **方案三**（VNC 登录），紧急救援方案
