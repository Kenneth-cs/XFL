create table sys_id_sequence
(
    key_name      varchar(50)                        not null comment 'Redis Key名称'
        primary key,
    current_value bigint   default 0                 not null comment '当前序列号值',
    description   varchar(100)                       null comment '描述',
    updated_at    datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间'
)
    comment 'ID序列号记录表';

INSERT INTO xingfuli.sys_id_sequence (key_name, current_value, description, updated_at) VALUES ('sys:store:seq', 0, '门店ID序列号', '2026-01-12 02:33:05');
INSERT INTO xingfuli.sys_id_sequence (key_name, current_value, description, updated_at) VALUES ('sys:user:global:seq', 0, '全局用户序列号（用于混淆计算）', '2026-01-12 02:33:05');
