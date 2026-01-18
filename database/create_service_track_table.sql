USE xingfuli;

CREATE TABLE IF NOT EXISTS `service_track` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `store_id` char(6) NOT NULL,
  `initiator_id` varchar(20) NOT NULL,
  `target_id` varchar(20) DEFAULT NULL,
  `type` tinyint(4) NOT NULL COMMENT '1:匹配反馈, 2:约见记录, 3:治疗记录',
  `status` tinyint(4) DEFAULT NULL COMMENT '进度状态',
  `feedback_content` json DEFAULT NULL COMMENT '详细反馈内容/治疗记录(JSON)',
  `event_time` datetime NOT NULL COMMENT '匹配/约见/服务时间',
  `created_by` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
