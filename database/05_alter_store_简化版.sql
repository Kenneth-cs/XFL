-- 门店表结构更新脚本（简化版 - 一次性执行）
-- 执行此脚本前，请确保没有重复字段

USE xingfuli;

-- 一次性添加所有新字段
ALTER TABLE `sys_store` 
  ADD COLUMN `business_license_name` VARCHAR(200) NULL COMMENT '营业执照名称' AFTER `mv_template_id`,
  ADD COLUMN `credit_code` VARCHAR(50) NULL COMMENT '统一社会信用代码' AFTER `business_license_name`,
  ADD COLUMN `province` VARCHAR(50) NULL COMMENT '省份' AFTER `credit_code`,
  ADD COLUMN `city` VARCHAR(50) NULL COMMENT '市' AFTER `province`,
  ADD COLUMN `district` VARCHAR(50) NULL COMMENT '区' AFTER `city`,
  ADD COLUMN `address` VARCHAR(200) NULL COMMENT '详细地址' AFTER `district`,
  ADD COLUMN `contract_number` VARCHAR(100) NULL COMMENT '合同号' AFTER `contact_phone`,
  ADD COLUMN `contract_start_date` DATE NULL COMMENT '签约时间' AFTER `contract_number`,
  ADD COLUMN `contract_end_date` DATE NULL COMMENT '到期时间' AFTER `contract_start_date`,
  ADD INDEX `idx_credit_code` (`credit_code`),
  ADD INDEX `idx_province_city` (`province`, `city`);

