-- 为门店表添加完整的档案字段
USE xingfuli;

ALTER TABLE `sys_store` 
  ADD COLUMN `business_license_name` VARCHAR(200) NULL COMMENT '营业执照名称' AFTER `mv_template_id`,
  ADD COLUMN `credit_code` VARCHAR(50) NULL COMMENT '统一社会信用代码' AFTER `business_license_name`,
  ADD COLUMN `province` VARCHAR(50) NULL COMMENT '省份' AFTER `credit_code`,
  ADD COLUMN `city` VARCHAR(50) NULL COMMENT '市' AFTER `province`,
  ADD COLUMN `district` VARCHAR(50) NULL COMMENT '区' AFTER `city`,
  ADD COLUMN `address` VARCHAR(200) NULL COMMENT '详细地址' AFTER `district`,
  DROP COLUMN `region_info`,
  MODIFY COLUMN `contact_person` VARCHAR(50) NULL COMMENT '联系人' AFTER `address`,
  MODIFY COLUMN `contact_phone` VARCHAR(20) NULL COMMENT '联系方式' AFTER `contact_person`,
  ADD COLUMN `contract_number` VARCHAR(100) NULL COMMENT '合同号' AFTER `contact_phone`,
  ADD COLUMN `contract_start_date` DATE NULL COMMENT '签约时间' AFTER `contract_number`,
  ADD COLUMN `contract_end_date` DATE NULL COMMENT '到期时间' AFTER `contract_start_date`;

-- 添加索引
ALTER TABLE `sys_store` 
  ADD INDEX `idx_credit_code` (`credit_code`),
  ADD INDEX `idx_province_city` (`province`, `city`);

