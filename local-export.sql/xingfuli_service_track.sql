create table service_track
(
    id               bigint auto_increment
        primary key,
    store_id         char(6)                                  not null,
    initiator_id     varchar(20)                              not null,
    target_id        varchar(20)                              null,
    type             tinyint                                  not null comment '1:匹配反馈, 2:约见记录, 3:治疗记录',
    status           tinyint                                  null comment '进度状态',
    feedback_content json                                     null comment '详细反馈内容/治疗记录(JSON)',
    event_time       datetime                                 not null comment '匹配/约见/服务时间',
    created_by       varchar(20)                              not null,
    created_at       datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at       datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6)
)
    collate = utf8mb4_general_ci;

INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (1, 'XFL001', 'XFL00100008', null, 1, 0, '{"myResult": "未看中"}', '2026-01-18 23:12:29', 'XFL001G16807', '2026-01-18 23:24:23.480308', '2026-01-18 23:57:07');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (2, 'XFL001', 'XFL00100008', 'XFL00100009', 2, 0, '{"feedback": "111"}', '2026-01-18 23:24:30', 'XFL001G16807', '2026-01-18 23:24:36.165549', '2026-01-18 23:24:36.165549');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (3, 'XFL001', 'XFL00100008', 'XFL00100002', 1, 1, '{"myResult": "看中"}', '2026-01-18 23:25:27', 'XFL001G16807', '2026-01-18 23:25:39.508300', '2026-01-18 23:56:57');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (4, 'XFL001', 'XFL00100008', 'XFL00100003', 1, 2, '{"myResult": "未看中", "peerResult": "看中"}', '2026-01-18 23:25:43', 'XFL001G16807', '2026-01-18 23:25:49.817213', '2026-01-18 23:58:14');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (5, 'XFL001', 'XFL00100003', 'XFL00100008', 2, 0, '{"feedback": "111"}', '2026-01-18 23:58:58', 'XFL001G16807', '2026-01-18 23:59:05.809237', '2026-01-18 23:59:05.809237');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (6, 'XFL001', 'XFL00100003', null, 3, null, '{}', '2026-01-18 23:59:13', 'XFL001G16807', '2026-01-19 00:00:44.996273', '2026-01-19 00:00:44.996273');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (7, 'XFL001', 'XFL00100843', 'XFL00100008', 1, 0, '{"myResult": "未看中"}', '2026-01-19 20:35:55', 'XFL001G16807', '2026-01-19 20:36:01.998107', '2026-01-19 20:36:01.998107');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (8, 'XFL002', 'XFL00233614', 'XFL00233614', 1, 0, '{"myResult": "未看中"}', '2026-01-23 15:27:30', 'XFL002G33614', '2026-01-23 15:27:38.221425', '2026-01-23 15:27:38.221425');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (9, 'XFL001', 'XFL00100008', 'XFL00100002', 2, null, '{"feedback": ""}', '2026-01-27 23:04:22', 'XFL001G16807', '2026-01-27 23:04:33.142664', '2026-01-27 23:04:33.142664');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (10, 'XFL001', 'XFL00100008', 'XFL00100002', 2, null, '{"feedback": ""}', '2026-01-27 23:04:42', 'XFL001G16807', '2026-01-27 23:04:47.934963', '2026-01-27 23:04:47.934963');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (11, 'XFL001', 'XFL00100008', 'XFL00100009', 2, 1, '{"feedback": ""}', '2026-01-27 23:04:58', 'XFL001G16807', '2026-01-27 23:05:09.492972', '2026-01-27 23:05:09.492972');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (12, 'XFL001', 'XFL00100008', 'XFL00100005', 2, 0, '{"feedback": "最新测试"}', '2026-01-27 23:05:35', 'XFL001G16807', '2026-01-27 23:05:46.759457', '2026-01-27 23:05:46.759457');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (13, 'XFL001', 'XFL00100008', 'XFL00100004', 2, null, '{"feedback": ""}', '2026-01-27 23:06:43', 'XFL001G16807', '2026-01-27 23:06:54.036113', '2026-01-27 23:06:54.036113');
INSERT INTO xingfuli.service_track (id, store_id, initiator_id, target_id, type, status, feedback_content, event_time, created_by, created_at, updated_at) VALUES (14, 'XFL001', 'XFL00100008', 'XFL00100004', 1, null, '{"myResult": "待反馈"}', '2026-01-27 23:06:56', 'XFL001G16807', '2026-01-27 23:07:00.275400', '2026-01-27 23:07:00.275400');
