create table sys_user
(
    id         varchar(20)                              not null comment '后台用户ID'
        primary key,
    store_id   char(6)                                  null comment '所属门店ID (超级管理员为NULL)',
    username   varchar(50)                              not null comment '登录账号',
    name       varchar(50)                              null comment '真实姓名',
    id_card    varchar(18)                              null comment '身份证号',
    password   varchar(100)                             not null comment '加密密码',
    phone      varchar(20)                              null comment '手机号',
    role       varchar(20)                              not null comment '角色',
    status     tinyint     default 0                    not null comment '状态: 1-正常, 0-待审核, -1-禁用',
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null comment '创建时间',
    updated_at datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6) comment '更新时间',
    constraint FK_2945a2aee738eef84b5fc87c23a
        foreign key (store_id) references sys_store (id)
);

INSERT INTO xingfuli.sys_user (id, store_id, username, name, id_card, password, phone, role, status, created_at, updated_at) VALUES ('SUPER_ADMIN', null, 'super_admin', null, null, '$2b$10$W0Da0AiFJf28oh4o4el.xOHBNeGIUkOsKBi.RRCszfFFrECigq6ji', null, 'super_admin', 1, '2026-01-14 13:45:10', '2026-01-14 13:45:10');
INSERT INTO xingfuli.sys_user (id, store_id, username, name, id_card, password, phone, role, status, created_at, updated_at) VALUES ('XFL001G16807', 'XFL001', 'admin', '张老板', '440981199410168888', '$2b$10$uVXKYbExXM1OaLuvzqAyLOG4O91orC.R12tDAwFuz9WeMAlZbGvBa', '15521303999', 'admin', 1, '2026-01-14 21:59:35', '2026-01-18 21:06:54');
INSERT INTO xingfuli.sys_user (id, store_id, username, name, id_card, password, phone, role, status, created_at, updated_at) VALUES ('XFL001G33614', 'XFL001', 'admin44', '111', '440981199610120987', '$2b$10$x/il9YHuqC/tLrlcZ7lZp.OVmZE7XxYHAC9X84TP293vNBYmMfhJ.', '15521333222', 'manager', 1, '2026-01-14 22:43:54', '2026-01-14 22:45:17');
INSERT INTO xingfuli.sys_user (id, store_id, username, name, id_card, password, phone, role, status, created_at, updated_at) VALUES ('XFL001G50421', 'XFL001', 'admin5', '22222', '440981199511210987', '$2b$10$3T5SOW6byItF6QWw8YiPw.UsIbcQy/fmv8w/9N04n9yOxhnGft19i', '15521444555', 'matchmaker', 1, '2026-01-14 22:44:31', '2026-01-22 22:36:08');
INSERT INTO xingfuli.sys_user (id, store_id, username, name, id_card, password, phone, role, status, created_at, updated_at) VALUES ('XFL002G16807', 'XFL002', 'admin1', '111', '440981199410169876', '$2b$10$U3JUs9VQnrKubYCU3u/bIe5UY9bFE/lhGgohUuIPkdklU7LaSUMZG', '15521303903', 'manager', 0, '2026-01-14 22:35:44', '2026-01-14 22:35:44');
INSERT INTO xingfuli.sys_user (id, store_id, username, name, id_card, password, phone, role, status, created_at, updated_at) VALUES ('XFL002G33614', 'XFL002', 'admin2', '22222', '440981199510160987', '$2b$10$PZK1j4cZNF7Mzw7ekvwS1.JVMIT7fMsaJqxQU3Q1X7u8eLPM8C8i6', '15521303992', 'matchmaker', 1, '2026-01-14 22:36:22', '2026-01-18 20:45:51');
