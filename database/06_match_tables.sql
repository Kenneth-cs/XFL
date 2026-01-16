CREATE TABLE `match_batch` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `store_id` char(6) NOT NULL,
  `initiator_id` varchar(20) NOT NULL,
  `filter_criteria` json DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_match_batch_initiator` (`initiator_id`),
  CONSTRAINT `FK_match_batch_initiator` FOREIGN KEY (`initiator_id`) REFERENCES `app_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `match_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `batch_id` bigint(20) NOT NULL,
  `candidate_id` varchar(20) NOT NULL,
  `mv_diff` decimal(5,2) NOT NULL,
  `is_mv_pass` tinyint(4) NOT NULL COMMENT '1:通过, 0:不通过',
  `is_personality_pass` tinyint(4) NOT NULL COMMENT '1:通过, 0:不通过',
  `result_status` tinyint(4) NOT NULL COMMENT '1:通过, 0:不通过',
  `match_data` json DEFAULT NULL COMMENT '匹配详情数据快照',
  PRIMARY KEY (`id`),
  KEY `FK_match_detail_batch` (`batch_id`),
  KEY `FK_match_detail_candidate` (`candidate_id`),
  CONSTRAINT `FK_match_detail_batch` FOREIGN KEY (`batch_id`) REFERENCES `match_batch` (`id`),
  CONSTRAINT `FK_match_detail_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `app_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `service_track` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `store_id` char(6) NOT NULL,
  `initiator_id` varchar(20) NOT NULL,
  `target_id` varchar(20) NOT NULL,
  `type` tinyint(4) NOT NULL COMMENT '1:匹配反馈, 2:约见记录, 3:治疗记录',
  `status` tinyint(4) NOT NULL COMMENT '进度状态',
  `feedback_content` text DEFAULT NULL,
  `event_time` datetime NOT NULL,
  `created_by` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_service_track_initiator` (`initiator_id`),
  KEY `IDX_service_track_target` (`target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

