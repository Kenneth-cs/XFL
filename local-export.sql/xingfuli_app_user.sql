create table app_user
(
    id         varchar(20)                              not null comment '前台用户ID'
        primary key,
    store_id   char(6)                                  not null comment '所属门店ID',
    phone      varchar(20)                              not null comment '手机号',
    password   varchar(100)                             not null comment '加密密码',
    status     tinyint     default 1                    not null comment '状态: 1-正常, 0-禁用',
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null comment '注册时间',
    updated_at datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6) comment '更新时间',
    constraint IDX_6a952ce9581e4c18e08d1f5213
        unique (phone),
    constraint FK_b222595c516b833bdc9b1ba26b6
        foreign key (store_id) references sys_store (id)
);

INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00100001', 'XFL001', '13800000001', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, '2026-01-17 12:51:47', '2026-01-17 12:51:47');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00100002', 'XFL001', '13800000002', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, '2026-01-17 12:51:47', '2026-01-17 12:51:47');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00100003', 'XFL001', '13800000003', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, '2026-01-17 12:51:47', '2026-01-17 12:51:47');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00100004', 'XFL001', '13800000004', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, '2026-01-17 12:51:47', '2026-01-17 12:51:47');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00100005', 'XFL001', '13800000005', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, '2026-01-17 12:51:47', '2026-01-17 12:51:47');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00100006', 'XFL001', '13800000006', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, '2026-01-17 12:51:47', '2026-01-17 12:51:47');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00100007', 'XFL001', '13800000007', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, '2026-01-17 12:51:47', '2026-01-17 12:51:47');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00100008', 'XFL001', '13800000008', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, '2026-01-17 12:51:48', '2026-01-17 12:51:48');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00100009', 'XFL001', '13800000009', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, '2026-01-17 12:51:48', '2026-01-17 12:51:48');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00100843', 'XFL001', '15521333333', '$2b$10$pWe6BQxcAlYRh3IXKCdmieVsuyxVHVRO4VgyPGs6PBC5blcfq7uri', 1, '2026-01-19 00:15:54.215051', '2026-01-19 00:15:54.215051');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00116807', 'XFL001', '1111111', '$2b$10$jiic3ZlqkgFbHLlXI.ZdnOEk/JNeBJA1fpUq5PSeLHc/T.d9lY.qK', 1, '2026-01-12 11:58:35', '2026-01-12 11:58:35');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00133614', 'XFL001', '12345678', '$2b$10$IxED4ep1DHZGKwdtxGeK9eJ9Lemm63vso5mkIcF6.MOMBX2KsrEdq', 1, '2026-01-12 12:02:38', '2026-01-12 12:02:38');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00150421', 'XFL001', '15521303902', '$2b$10$PO/viXil0juMLeViVridQOjGy1lyME1WuAIJERqwAHY30DnWPUiQa', 1, '2026-01-12 13:26:04', '2026-01-12 13:26:04');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00167228', 'XFL001', '15521303903', '$2b$10$1PBv//eJ7F/BnWq.o5WbK.DrTzPnuc6k8m7SZaIJsAss9dhPmW6wa', 1, '2026-01-12 15:55:50', '2026-01-12 15:55:50');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00184035', 'XFL001', '15521303904', '$2b$10$egAr/fvkpJeVjW5MF7K32OPT6O.9iXje9O./nb4pap.OcM/3Uml0S', 1, '2026-01-16 00:31:45', '2026-01-16 00:31:45');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00216807', 'XFL002', '15521303111', '$2b$10$oBECiTMWrnlNXj8uHzxwTO/Uh/G24BjvrzcGFUH1Nq678DW1Rqdni', 1, '2026-01-18 20:42:22.395297', '2026-01-18 20:42:22.395297');
INSERT INTO xingfuli.app_user (id, store_id, phone, password, status, created_at, updated_at) VALUES ('XFL00233614', 'XFL002', '15521303911', '$2b$10$cRvBphUMW14mrFNLbHZXkuG1FSKKS1l/bsNdttJHwSdTTugDN7.3q', 1, '2026-01-19 20:21:43.596652', '2026-01-19 20:21:43.596652');
