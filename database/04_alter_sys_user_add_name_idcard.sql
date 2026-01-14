-- ========================================
-- 数据库迁移脚本：为 sys_user 表添加真实姓名和身份证号字段
-- 执行时间：2026-01-14
-- 目的：支持后台用户注册时采集真实姓名和身份证号
-- ========================================

USE xingfuli;

-- 添加真实姓名字段
ALTER TABLE `sys_user` 
ADD COLUMN `name` VARCHAR(50) NULL COMMENT '真实姓名' AFTER `username`;

-- 添加身份证号字段
ALTER TABLE `sys_user` 
ADD COLUMN `id_card` VARCHAR(18) NULL COMMENT '身份证号' AFTER `name`;

-- 为身份证号添加索引（用于去重和查询）
ALTER TABLE `sys_user` 
ADD INDEX `idx_id_card` (`id_card`);

-- 验证字段是否添加成功
DESCRIBE `sys_user`;

