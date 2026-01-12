USE `xingfuli`;

-- ========================================
-- 基础管理模块
-- ========================================

-- 1. 门店表
CREATE TABLE IF NOT EXISTS `sys_store` (
  `id` CHAR(6) NOT NULL COMMENT '门店ID (如: XFL001)',
  `name` VARCHAR(50) NOT NULL COMMENT '门店名称',
  `mv_template_id` TINYINT NOT NULL DEFAULT 3 COMMENT '绑定的MV地域方案ID (1:广东周边, 2:江浙周边, 3:全国普适, 4:京沪, 5:东北新疆)',
  `region_info` JSON NULL COMMENT '省市区地址信息',
  `contact_person` VARCHAR(50) NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) NULL COMMENT '联系电话',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 0-禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='门店表';

-- 2. 后台用户表
CREATE TABLE IF NOT EXISTS `sys_user` (
  `id` VARCHAR(20) NOT NULL COMMENT '后台用户ID (如: XFL001G13702)',
  `store_id` CHAR(6) NOT NULL COMMENT '所属门店ID',
  `username` VARCHAR(50) NOT NULL COMMENT '登录账号/姓名',
  `password` VARCHAR(100) NOT NULL COMMENT '加密密码 (BCrypt)',
  `phone` VARCHAR(20) NULL COMMENT '手机号',
  `role` VARCHAR(20) NOT NULL COMMENT '角色: super_admin-超级管理员, admin-门店老板, manager-门店负责人, matchmaker-红娘',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 1-正常, 0-待审核, -1-禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_store_id` (`store_id`),
  INDEX `idx_username` (`username`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台用户表';

-- ========================================
-- 用户档案模块
-- ========================================

-- 3. 前台用户表
CREATE TABLE IF NOT EXISTS `app_user` (
  `id` VARCHAR(20) NOT NULL COMMENT '前台用户ID (如: XFL00100030)',
  `store_id` CHAR(6) NOT NULL COMMENT '所属门店ID',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `password` VARCHAR(100) NOT NULL COMMENT '加密密码',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 0-禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  INDEX `idx_store_id` (`store_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='前台用户表';

-- 4. 用户档案表
CREATE TABLE IF NOT EXISTS `app_user_profile` (
  `user_id` VARCHAR(20) NOT NULL COMMENT '用户ID',
  `base_info` JSON NOT NULL COMMENT '基础信息（同步自前台）: {name, gender, birthday, height, weight, education, marriage, ethnicity, avatar_url, ...}',
  `ext_info` JSON NULL COMMENT '扩展信息（红娘填写）: {income, house, car, appearance_score, family_bg, bra_cup, ...}',
  `mv_score` DECIMAL(5,2) NULL COMMENT '当前计算出的MV总分',
  `mv_detail` JSON NULL COMMENT 'MV各维度得分详情',
  `service_matchmaker_id` VARCHAR(20) NULL COMMENT '服务红娘ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`user_id`),
  INDEX `idx_matchmaker` (`service_matchmaker_id`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户档案表';

-- ========================================
-- 测评与业务模块
-- ========================================

-- 5. 测评记录表
CREATE TABLE IF NOT EXISTS `assessment_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` VARCHAR(20) NOT NULL COMMENT '用户ID',
  `type` TINYINT NOT NULL COMMENT '测评类型: 1-九型人格, 2-依恋关系, 3-婚恋幸福力',
  `answers` JSON NOT NULL COMMENT '原始答卷数据',
  `result_data` JSON NOT NULL COMMENT '结构化结果数据',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '测评时间',
  PRIMARY KEY (`id`),
  INDEX `idx_user_type` (`user_id`, `type`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='测评记录表';

-- 6. 匹配批次表
CREATE TABLE IF NOT EXISTS `match_batch` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '批次ID',
  `store_id` CHAR(6) NOT NULL COMMENT '门店ID（门店隔离）',
  `initiator_id` VARCHAR(20) NOT NULL COMMENT '发起方用户ID',
  `filter_criteria` JSON NULL COMMENT '筛选条件快照',
  `created_by` VARCHAR(20) NOT NULL COMMENT '操作人（红娘ID）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '匹配发起时间',
  PRIMARY KEY (`id`),
  INDEX `idx_store_initiator` (`store_id`, `initiator_id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='匹配批次表';

-- 7. 匹配明细表
CREATE TABLE IF NOT EXISTS `match_detail` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `batch_id` BIGINT NOT NULL COMMENT '批次ID',
  `candidate_id` VARCHAR(20) NOT NULL COMMENT '候选方用户ID',
  `mv_diff` DECIMAL(4,2) NULL COMMENT 'MV分差',
  `is_mv_pass` TINYINT NULL COMMENT 'MV是否通过: 1-通过, 0-不通过',
  `personality_match_score` INT NULL COMMENT '九型人格匹配得分',
  `is_personality_pass` TINYINT NULL COMMENT '九型人格是否通过: 1-通过, 0-不通过（一票否决）',
  `result_status` TINYINT NOT NULL COMMENT '最终系统判定: 1-通过, 0-不通过',
  `result_detail` JSON NULL COMMENT '详细匹配结果数据',
  PRIMARY KEY (`id`),
  INDEX `idx_batch_id` (`batch_id`),
  INDEX `idx_candidate_id` (`candidate_id`),
  CONSTRAINT `fk_detail_batch` FOREIGN KEY (`batch_id`) REFERENCES `match_batch` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='匹配明细表';

-- 8. 服务轨迹表
CREATE TABLE IF NOT EXISTS `service_track` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '轨迹ID',
  `store_id` CHAR(6) NOT NULL COMMENT '门店ID',
  `initiator_id` VARCHAR(20) NOT NULL COMMENT '本方用户ID',
  `target_id` VARCHAR(20) NULL COMMENT '对方用户ID（关联对象，治疗轨迹可为空）',
  `type` TINYINT NOT NULL COMMENT '轨迹类型: 1-匹配反馈, 2-约见记录, 3-治疗记录',
  `status` TINYINT NULL COMMENT '进度状态（如: 看中/未看中, 已约见/反馈等）',
  `feedback_content` TEXT NULL COMMENT '详细反馈内容/治疗记录',
  `event_time` DATETIME NULL COMMENT '匹配/约见时间',
  `created_by` VARCHAR(20) NOT NULL COMMENT '记录人（红娘ID）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_store_initiator` (`store_id`, `initiator_id`),
  INDEX `idx_target_id` (`target_id`),
  INDEX `idx_type` (`type`),
  INDEX `idx_event_time` (`event_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务轨迹表';

-- ========================================
-- Redis序列号初始化记录表（用于备份和恢复）
-- ========================================

-- 9. ID序列号记录表
CREATE TABLE IF NOT EXISTS `sys_id_sequence` (
  `key_name` VARCHAR(50) NOT NULL COMMENT 'Redis Key名称',
  `current_value` BIGINT NOT NULL DEFAULT 0 COMMENT '当前序列号值',
  `description` VARCHAR(100) NULL COMMENT '描述',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ID序列号记录表';

