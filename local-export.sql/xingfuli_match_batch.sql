create table match_batch
(
    id              bigint auto_increment
        primary key,
    initiator_id    varchar(20)                              not null,
    filter_criteria json                                     null,
    created_by      varchar(20)                              null comment '创建人（系统用户ID）',
    created_at      datetime(6) default CURRENT_TIMESTAMP(6) not null,
    store_id        varchar(6)                               not null,
    constraint FK_02449f2f3870348e259dd675f28
        foreign key (initiator_id) references app_user (id)
);

INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (1, 'XFL00167228', '{"ageMax": 40, "ageMin": 22, "heightMax": 180, "heightMin": 140, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-16 13:55:28.712303', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (2, 'XFL00167228', '{"ageMax": 40, "ageMin": 22, "heightMax": 180, "heightMin": 140, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-16 13:55:33.298904', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (3, 'XFL00167228', '{}', null, '2026-01-16 14:42:31.297860', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (4, 'XFL00167228', '{}', null, '2026-01-16 14:42:31.825596', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (5, 'XFL00167228', '{"ageMax": 170, "ageMin": 160, "heightMax": 170, "heightMin": 150, "educationMax": "985或更高", "educationMin": "大专"}', null, '2026-01-16 14:42:55.249373', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (6, 'XFL00167228', '{}', null, '2026-01-16 19:53:49.212221', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (7, 'XFL00167228', '{"ageMax": 39, "ageMin": 16, "heightMax": 180, "heightMin": 160, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-16 20:05:15.660629', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (8, 'XFL00167228', '{"ageMax": 39, "ageMin": 16, "heightMax": 180, "heightMin": 160, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-16 20:05:22.115711', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (9, 'XFL00167228', '{"ageMax": 39, "ageMin": 16, "heightMax": 180, "heightMin": 160, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-16 20:05:26.309323', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (10, 'XFL00167228', '{"ageMax": 39, "ageMin": 16, "heightMax": 180, "heightMin": 160, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-16 20:05:26.730953', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (11, 'XFL00167228', '{}', null, '2026-01-16 20:13:50.162918', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (12, 'XFL00167228', '{"ageMax": 33, "ageMin": 16, "heightMax": 180, "heightMin": 160, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-16 20:14:05.950536', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (13, 'XFL00167228', '{}', null, '2026-01-16 20:27:05.203223', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (14, 'XFL00167228', '{"ageMax": 32, "ageMin": 11, "heightMax": 180, "heightMin": 111, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-16 20:27:16.165839', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (15, 'XFL00167228', '{"ageMax": 37, "ageMin": 12, "heightMax": 190, "heightMin": 110, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-16 21:04:49.530375', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (16, 'XFL00100001', '{"ageMax": 35, "ageMin": 25, "heightMax": 170, "heightMin": 160, "educationMax": "普通一本", "educationMin": "大专以下"}', null, '2026-01-17 12:54:35.952968', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (17, 'XFL00100002', '{"ageMax": 30, "ageMin": 23, "heightMax": 170, "heightMin": 160, "educationMax": "985或更高", "educationMin": "普通一本"}', null, '2026-01-17 12:57:27.932308', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (18, 'XFL00100001', '{"ageMax": 33, "ageMin": 16, "heightMax": 180, "heightMin": 110, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-17 13:34:28.538395', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (19, 'XFL00100009', '{"ageMax": 32, "ageMin": 12, "heightMax": 180, "heightMin": 155, "educationMax": "985或更高", "educationMin": "大专"}', null, '2026-01-17 21:36:06.180316', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (20, 'XFL00100001', '{"ageMax": 32, "ageMin": 18, "heightMax": 180, "heightMin": 160, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-18 21:01:52.602372', 'XFL001');
INSERT INTO xingfuli.match_batch (id, initiator_id, filter_criteria, created_by, created_at, store_id) VALUES (21, 'XFL00100002', '{"ageMax": 45, "ageMin": 14, "heightMax": 189, "heightMin": 111, "educationMax": "985或更高", "educationMin": "大专以下"}', null, '2026-01-20 12:37:15.931071', 'XFL001');
