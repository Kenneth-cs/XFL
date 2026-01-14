-- 门店表结构更新脚本（MySQL 8.0 兼容版本）
-- 注意：如果字段已存在会报错，可以忽略重复字段的错误

USE xingfuli;

-- 步骤1：删除旧字段 region_info（如果存在）
-- 如果字段不存在会报错，可以忽略
ALTER TABLE `sys_store` DROP COLUMN `region_info`;

-- 步骤2：添加营业执照名称
ALTER TABLE `sys_store` 
  ADD COLUMN `business_license_name` VARCHAR(200) NULL COMMENT '营业执照名称' AFTER `mv_template_id`;

-- 步骤3：添加统一社会信用代码
ALTER TABLE `sys_store` 
  ADD COLUMN `credit_code` VARCHAR(50) NULL COMMENT '统一社会信用代码' AFTER `business_license_name`;

-- 步骤4：添加省份
ALTER TABLE `sys_store` 
  ADD COLUMN `province` VARCHAR(50) NULL COMMENT '省份' AFTER `credit_code`;

-- 步骤5：添加市
ALTER TABLE `sys_store` 
  ADD COLUMN `city` VARCHAR(50) NULL COMMENT '市' AFTER `province`;

-- 步骤6：添加区
ALTER TABLE `sys_store` 
  ADD COLUMN `district` VARCHAR(50) NULL COMMENT '区' AFTER `city`;

-- 步骤7：添加详细地址
ALTER TABLE `sys_store` 
  ADD COLUMN `address` VARCHAR(200) NULL COMMENT '详细地址' AFTER `district`;

-- 步骤8：添加合同号
ALTER TABLE `sys_store` 
  ADD COLUMN `contract_number` VARCHAR(100) NULL COMMENT '合同号' AFTER `contact_phone`;

-- 步骤9：添加签约时间
ALTER TABLE `sys_store` 
  ADD COLUMN `contract_start_date` DATE NULL COMMENT '签约时间' AFTER `contract_number`;

-- 步骤10：添加到期时间
ALTER TABLE `sys_store` 
  ADD COLUMN `contract_end_date` DATE NULL COMMENT '到期时间' AFTER `contract_start_date`;

-- 步骤11：添加索引
ALTER TABLE `sys_store` 
  ADD INDEX `idx_credit_code` (`credit_code`);

ALTER TABLE `sys_store` 
  ADD INDEX `idx_province_city` (`province`, `city`);

-- 步骤12：验证表结构
DESC sys_store;

