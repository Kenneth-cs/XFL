create table sys_store
(
    id                    char(6)                                  not null comment '门店ID (如: XFL001)'
        primary key,
    mv_template_id        tinyint                                  not null comment 'MV地域方案ID (1:广东周边, 2:江浙周边, 3:全国普适, 4:京沪, 5:东北新疆)',
    business_license_name varchar(200)                             null comment '营业执照名称',
    credit_code           varchar(50)                              null comment '统一社会信用代码',
    province              varchar(50)                              null comment '省份',
    city                  varchar(50)                              null comment '市',
    district              varchar(50)                              null comment '区',
    address               varchar(200)                             null comment '详细地址',
    contact_person        varchar(50)                              null comment '联系人',
    contact_phone         varchar(20)                              null comment '联系方式',
    contract_number       varchar(100)                             null comment '合同号',
    contract_start_date   date                                     null comment '签约时间',
    contract_end_date     date                                     null comment '到期时间',
    status                tinyint     default 1                    not null comment '状态: 1-正常, 0-禁用, -1-已删除(软删除)',
    created_at            datetime(6) default CURRENT_TIMESTAMP(6) not null comment '创建时间',
    updated_at            datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6) comment '更新时间',
    name                  varchar(100)                             not null comment '门店名称'
);

INSERT INTO xingfuli.sys_store (id, mv_template_id, business_license_name, credit_code, province, city, district, address, contact_person, contact_phone, contract_number, contract_start_date, contract_end_date, status, created_at, updated_at, name) VALUES ('XFL001', 1, '23456765434r', '345654345654345', '广东', '佛山', '南海', '深圳', '34343', '15521303902', '2345432', '2026-01-15', '2026-01-31', 1, '2026-01-12 02:33:05', '2026-01-18 20:48:02', '佛山店');
INSERT INTO xingfuli.sys_store (id, mv_template_id, business_license_name, credit_code, province, city, district, address, contact_person, contact_phone, contract_number, contract_start_date, contract_end_date, status, created_at, updated_at, name) VALUES ('XFL002', 2, null, null, null, null, null, null, null, null, null, null, null, 1, '2026-01-14 21:58:21', '2026-01-18 21:07:21', '');
INSERT INTO xingfuli.sys_store (id, mv_template_id, business_license_name, credit_code, province, city, district, address, contact_person, contact_phone, contract_number, contract_start_date, contract_end_date, status, created_at, updated_at, name) VALUES ('XFL003', 1, null, null, null, null, null, null, null, null, null, null, null, 1, '2026-01-14 21:58:21', '2026-01-15 01:23:08', '');
INSERT INTO xingfuli.sys_store (id, mv_template_id, business_license_name, credit_code, province, city, district, address, contact_person, contact_phone, contract_number, contract_start_date, contract_end_date, status, created_at, updated_at, name) VALUES ('XFL004', 3, null, null, null, null, null, null, null, null, null, null, null, 1, '2026-01-14 21:58:21', '2026-01-15 01:23:19', '');
INSERT INTO xingfuli.sys_store (id, mv_template_id, business_license_name, credit_code, province, city, district, address, contact_person, contact_phone, contract_number, contract_start_date, contract_end_date, status, created_at, updated_at, name) VALUES ('XFL005', 2, null, null, null, null, null, null, null, null, null, null, null, 1, '2026-01-15 01:23:30', '2026-01-15 01:23:30', '');
INSERT INTO xingfuli.sys_store (id, mv_template_id, business_license_name, credit_code, province, city, district, address, contact_person, contact_phone, contract_number, contract_start_date, contract_end_date, status, created_at, updated_at, name) VALUES ('XFL006', 1, null, null, null, null, null, null, null, null, null, null, null, 1, '2026-01-15 01:24:17', '2026-01-15 01:24:17', '');
