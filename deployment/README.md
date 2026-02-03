# 部署文档索引

本目录包含幸福力项目的完整部署文档和工具脚本。

## 📚 文档列表

### 1. 完整部署指南（推荐新手阅读）
**文件：** [`完整部署指南_含路径配置.md`](./完整部署指南_含路径配置.md)

**内容：**
- ✅ 服务器环境准备（Ubuntu 24.04）
- ✅ SSH密钥配置详解
- ✅ MySQL和Redis配置
- ✅ 后端NestJS部署
- ✅ **前端Vite路径配置（重点！）**
- ✅ Nginx反向代理配置
- ✅ PM2进程管理
- ✅ 常见问题完整解决方案
- ✅ 生产环境优化建议

**适合：** 首次部署、完整了解部署流程、排查疑难问题

---

### 2. 快速参考手册
**文件：** [`快速参考_路径配置.md`](./快速参考_路径配置.md)

**内容：**
- ⚡ 核心配置清单（Vite、Nginx、后端）
- ⚡ 快速部署命令
- ⚡ 常见错误与一行命令修复
- ⚡ 快速诊断命令
- ⚡ 部署前检查清单

**适合：** 日常更新部署、快速查找配置、应急修复

---

### 3. 其他部署文档

| 文档 | 说明 |
|------|------|
| `新服务器部署指南.md` | 腾讯云服务器专用部署流程 |
| `deploy-guide.md` | 早期部署文档 |
| `QUICK-DEPLOY-新服务器.md` | 新服务器快速部署 |
| `QUICK-START.md` | 项目快速启动指南 |

---

## 🛠️ 工具脚本

### 1. 部署前检查脚本（强烈推荐）
**文件：** [`check-before-deploy.sh`](./check-before-deploy.sh)

**功能：**
- ✅ 自动检查Vite配置是否正确
- ✅ 验证构建产物路径
- ✅ 检查后端环境变量
- ✅ 验证依赖安装情况
- ✅ 生成检查报告

**使用方法：**
```bash
cd /path/to/project
chmod +x deployment/check-before-deploy.sh
./deployment/check-before-deploy.sh
```

**示例输出：**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   幸福力项目部署前配置检查
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/6] 检查前端Vite配置
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ H5前端配置了正确的base路径: '/h5/'
✓ Admin前端配置了正确的base路径: '/admin/'

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   检查结果汇总
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  通过: 15
  警告: 2
  失败: 0

✓ 所有检查通过！可以开始部署。
```

---

### 2. 其他部署脚本

| 脚本 | 说明 |
|------|------|
| `deploy-steps.sh` | 分步部署脚本 |
| `deploy-to-new-server.sh` | 新服务器一键部署 |
| `fix-502-error.sh` | 修复502错误 |
| `check-server.sh` | 服务器状态检查 |
| `setup-ssh-key.sh` | SSH密钥配置 |

---

## 🚀 快速开始

### 对于新部署：

1. **阅读完整文档**
   ```bash
   cat deployment/完整部署指南_含路径配置.md
   ```

2. **修改Vite配置**（最重要！）
   - 编辑 `frontend-h5/vite.config.ts`，添加 `base: '/h5/'`
   - 编辑 `frontend-admin/vite.config.ts`，添加 `base: '/admin/'`

3. **运行检查脚本**
   ```bash
   ./deployment/check-before-deploy.sh
   ```

4. **按照文档步骤部署**

---

### 对于日常更新：

1. **查看快速参考**
   ```bash
   cat deployment/快速参考_路径配置.md
   ```

2. **构建并上传**
   ```bash
   # 前端
   cd frontend-h5 && npx vite build && cd ..
   scp -i ~/.ssh/XFL.pem -r frontend-h5/dist ubuntu@SERVER:/tmp/h5-dist
   
   # 后端
   cd backend && npm run build && cd ..
   scp -i ~/.ssh/XFL.pem -r backend/dist ubuntu@SERVER:/tmp/backend-dist
   ```

3. **服务器部署**
   ```bash
   ssh -i ~/.ssh/XFL.pem ubuntu@SERVER
   # 按快速参考中的命令操作
   ```

---

## ⚠️ 关键注意事项

### 1. 前端路径配置（最容易出错！）

**必须配置：**
- `frontend-h5/vite.config.ts` → `base: '/h5/'`
- `frontend-admin/vite.config.ts` → `base: '/admin/'`

**如果忘记配置会怎样：**
- ❌ 页面空白
- ❌ 浏览器控制台显示404
- ❌ 资源路径错误（`/assets/xxx` 而不是 `/h5/assets/xxx`）

### 2. Nginx配置

**关键点：**
- 使用 `alias`，不是 `root`
- `alias` 路径必须以 `/` 结尾
- 必须配置 `location = /h5` 的301重定向

### 3. 浏览器缓存

**问题：** 更新后页面没变化

**解决：**
- 强制刷新：`Ctrl + Shift + R`
- 或使用无痕模式
- 或在Nginx添加禁用缓存头（开发环境）

---

## 📞 获取帮助

### 遇到问题时的步骤：

1. **查看快速参考中的常见错误部分**
   ```bash
   cat deployment/快速参考_路径配置.md
   # 跳转到"常见错误与快速修复"章节
   ```

2. **查看完整文档的故障排查清单**
   ```bash
   cat deployment/完整部署指南_含路径配置.md
   # 跳转到"故障排查清单"章节
   ```

3. **查看服务日志**
   ```bash
   # 后端日志
   pm2 logs xinfu-backend --lines 50
   
   # Nginx日志
   sudo tail -n 50 /var/log/nginx/error.log
   ```

4. **检查浏览器控制台**
   - 按 `F12` 打开开发者工具
   - 查看 Console 面板的错误
   - 查看 Network 面板的请求

---

## 📋 部署前检查清单

每次部署前必须确认：

- [ ] ✅ 前端 `vite.config.ts` 已配置 `base` 路径
- [ ] ✅ 本地构建成功（`npm run build`）
- [ ] ✅ 验证HTML中的资源路径正确
- [ ] ✅ 后端 `.env` 配置正确
- [ ] ✅ 后端构建成功（检查 `dist/main.js` 存在）
- [ ] ✅ 运行了 `./deployment/check-before-deploy.sh`

---

## 📖 推荐阅读顺序

### 新手用户：
1. 📘 `完整部署指南_含路径配置.md` （完整阅读）
2. 🛠️ 运行 `check-before-deploy.sh` 检查配置
3. 📗 `快速参考_路径配置.md` （收藏备用）

### 有经验用户：
1. 📗 `快速参考_路径配置.md` （日常使用）
2. 📘 `完整部署指南_含路径配置.md` （遇到问题时查阅）

---

## 🔄 文档更新记录

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2026-01-28 | v1.0 | 创建完整部署指南和快速参考 |
| 2026-01-28 | v1.0 | 添加部署前检查脚本 |

---

## 📝 反馈与建议

如发现文档错误或有改进建议，请：
1. 在项目根目录创建 issue
2. 或直接修改文档并提交

---

**最后更新：** 2026-01-28  
**维护者：** 幸福力项目开发团队
