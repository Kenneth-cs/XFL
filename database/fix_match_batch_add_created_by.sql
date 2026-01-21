-- 修复 match_batch 表：添加 created_by 字段
-- 执行时间：2026-01-21

USE xingfuli;

-- 检查字段是否存在
SELECT 'Checking match_batch table structure...' AS message;

-- 添加 created_by 字段
ALTER TABLE `match_batch` 
ADD COLUMN `created_by` VARCHAR(20) NULL COMMENT '创建人（系统用户ID）' 
AFTER `filter_criteria`;

SELECT 'created_by field added successfully!' AS message;

-- 验证表结构
DESCRIBE match_batch;
