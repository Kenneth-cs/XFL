USE `xingfuli`;

-- ========================================
-- 初始化数据
-- ========================================

-- 初始化ID序列号记录
INSERT INTO `sys_id_sequence` (`key_name`, `current_value`, `description`) VALUES
('sys:store:seq', 0, '门店ID序列号'),
('sys:user:global:seq', 0, '全局用户序列号（用于混淆计算）');

-- 创建第一个门店（用于测试）
INSERT INTO `sys_store` (`id`, `name`, `mv_template_id`, `status`) VALUES
('XFL001', '总部测试门店', 3, 1);

-- 创建超级管理员账号
-- 密码: admin123 (BCrypt加密后的值，实际使用时需要通过代码生成)
INSERT INTO `sys_user` (`id`, `store_id`, `username`, `password`, `role`, `status`) VALUES
('SUPER_ADMIN', 'XFL001', 'admin', '$2b$10$YourBcryptHashHere', 'super_admin', 1);

-- 注意：上面的密码哈希值是示例，实际部署时需要使用真实的BCrypt哈希
-- 可以使用以下Node.js代码生成:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('admin123', 10);
-- console.log(hash);

