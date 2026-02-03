create table enneagram_config
(
    id             tinyint                            not null comment '人格编号 1-9'
        primary key,
    name           varchar(50)                        not null comment '人格名称（如：完美主义者）',
    title          varchar(100)                       not null comment '副标题',
    description    text                               null comment '详细描述',
    traits         json                               null comment '核心特质列表',
    standard_score int                                not null comment '标准满分',
    color          varchar(20)                        null comment '展示颜色',
    created_at     datetime default CURRENT_TIMESTAMP null,
    updated_at     datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    comment '九型人格配置表';

INSERT INTO xingfuli.enneagram_config (id, name, title, description, traits, standard_score, color, created_at, updated_at) VALUES (1, '完美主义者', '改革者·理想主义', '追求完美，有强烈的是非观念，注重原则和纪律', null, 100, '#E74C3C', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.enneagram_config (id, name, title, description, traits, standard_score, color, created_at, updated_at) VALUES (2, '助人者', '给予者·博爱主义', '热心助人，渴望被需要，关注他人需求', null, 100, '#3498DB', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.enneagram_config (id, name, title, description, traits, standard_score, color, created_at, updated_at) VALUES (3, '成就者', '实干家·目标导向', '追求成功，注重效率，善于展示自己', null, 100, '#2ECC71', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.enneagram_config (id, name, title, description, traits, standard_score, color, created_at, updated_at) VALUES (4, '浪漫主义者', '艺术家·个性独特', '情感丰富，追求独特性，艺术气质浓厚', null, 100, '#9B59B6', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.enneagram_config (id, name, title, description, traits, standard_score, color, created_at, updated_at) VALUES (5, '观察者', '思考者·理性分析', '喜欢思考，注重知识，保持客观冷静', null, 100, '#1ABC9C', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.enneagram_config (id, name, title, description, traits, standard_score, color, created_at, updated_at) VALUES (6, '忠诚者', '怀疑论者·安全第一', '忠诚可靠，注重安全感，有责任心', null, 100, '#F39C12', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.enneagram_config (id, name, title, description, traits, standard_score, color, created_at, updated_at) VALUES (7, '享乐主义者', '冒险家·乐观派', '乐观开朗，追求快乐，喜欢新鲜体验', null, 100, '#E67E22', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.enneagram_config (id, name, title, description, traits, standard_score, color, created_at, updated_at) VALUES (8, '挑战者', '领导者·保护者', '意志坚定，保护弱者，掌控力强', null, 100, '#34495E', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.enneagram_config (id, name, title, description, traits, standard_score, color, created_at, updated_at) VALUES (9, '和平主义者', '调停者·和谐至上', '随和平静，追求和谐，避免冲突', null, 100, '#95A5A6', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
