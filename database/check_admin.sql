-- 快速检查超级管理员是否存在
USE `xingfuli`;

SELECT 
    id,
    store_id,
    username,
    role,
    status,
    created_at
FROM sys_user 
WHERE username = 'admin' OR role = 'super_admin';

-- 如果上面查询没有结果，说明超级管理员未初始化
-- 请按照下面的步骤修复：

-- 步骤1: 删除可能存在的旧数据（如果有）
-- DELETE FROM sys_user WHERE id = 'SUPER_ADMIN';

-- 步骤2: 插入超级管理员账号
-- 用户名: admin
-- 密码: admin123
-- INSERT INTO `sys_user` (`id`, `store_id`, `username`, `password`, `role`, `status`) 
-- VALUES ('SUPER_ADMIN', NULL, 'admin', '$2b$10$X3Q8z.IV3dnkFQfDxKrp2es.9vbJxOg7.gevScdBbwat29JD6zh8G', 'super_admin', 1);

