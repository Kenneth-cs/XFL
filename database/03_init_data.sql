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
-- 用户名: super_admin
-- 密码: admin654321
INSERT INTO `sys_user` (`id`, `store_id`, `username`, `password`, `role`, `status`) VALUES
('SUPER_ADMIN', NULL, 'super_admin', '$2b$10$W0Da0AiFJf28oh4o4el.xOHBNeGIUkOsKBi.RRCszfFFrECigq6ji', 'super_admin', 1);

