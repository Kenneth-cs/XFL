# 使用DataGrip导出数据库步骤

## 第1步：在DataGrip中导出本地数据库

1. 打开 **DataGrip**
2. 在左侧找到 `xinfu_db` 数据库
3. 右键点击 `xinfu_db`
4. 选择 `SQL Scripts` → `SQL Generator...`
5. 在弹出窗口中：
   - ✅ 勾选所有表
   - ✅ 勾选 `Data` (导出数据)
   - ✅ 勾选 `Structure` (导出结构)
   - ✅ 设置输出路径为：`/Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发/local-export.sql`
6. 点击 `Generate`

**或者使用更简单的方法：**
1. 右键点击 `xinfu_db`
2. 选择 `Dump with 'mysqldump'`
3. 在弹出的对话框中：
   - Output file: 选择保存路径为 `/Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发/local-export.sql`
   - 点击 `OK`

## 第2步：上传到服务器

在终端执行：
```bash
cd "/Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发"
scp -i ~/.ssh/XFL.pem local-export.sql ubuntu@124.222.88.25:/tmp/xinfu_import.sql
```

## 第3步：导入到服务器

```bash
ssh -i ~/.ssh/XFL.pem ubuntu@124.222.88.25 << 'ENDSSH'
echo "正在导入数据..."
mysql -uroot -p'Xinfuli2024!' xinfu_db < /tmp/xinfu_import.sql

if [ $? -eq 0 ]; then
    echo "✅ 数据导入成功"
    rm /tmp/xinfu_import.sql
    echo "🔄 重启后端服务..."
    pm2 restart xinfu-backend
    echo "✅ 完成！"
else
    echo "❌ 数据导入失败！"
fi
ENDSSH
```

## 第4步：验证

1. 清除浏览器缓存（Ctrl+Shift+Delete）
2. 访问：http://124.222.88.25:8080/admin/
3. 登录后进入"智能匹配"页面
4. 检查幸福圆环是否显示

---

## 备份已完成

服务器数据库已备份到：
```
/Users/cs/Desktop/CS/创业/相亲项目开发/幸福力项目开发/database-backup-20260128-231916/server-backup.sql
```

如果导入后有问题，可以使用此备份回滚。
