create table attachment_config
(
    id                tinyint                            not null comment '类型编号: 1-安全型, 2-焦虑型, 3-回避型, 4-紊乱型'
        primary key,
    name              varchar(50)                        not null comment '类型名称',
    description       text                               null comment '类型描述',
    traits            json                               null comment '核心特质',
    typical_behaviors json                               null comment '典型行为表现',
    created_at        datetime default CURRENT_TIMESTAMP null,
    updated_at        datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    comment '依恋类型配置表';

INSERT INTO xingfuli.attachment_config (id, name, description, traits, typical_behaviors, created_at, updated_at) VALUES (1, '安全型依恋', '能够建立稳定、信任的亲密关系', '["信任他人", "情绪稳定", "善于沟通", "独立自主"]', '["愿意分享感受", "不过度依赖", "能给予对方空间", "冲突时能理性沟通"]', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.attachment_config (id, name, description, traits, typical_behaviors, created_at, updated_at) VALUES (2, '焦虑型依恋', '过度担心被抛弃，需要不断的确认', '["敏感多疑", "情绪波动大", "需要被认可", "害怕被抛弃"]', '["频繁查看消息", "需要持续关注", "容易吃醋", "对分离高度焦虑"]', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.attachment_config (id, name, description, traits, typical_behaviors, created_at, updated_at) VALUES (3, '回避型依恋', '逃避亲密关系，保持情感距离', '["独立性强", "不愿依赖他人", "压抑情感", "逃避承诺"]', '["不主动表达爱意", "需要大量个人空间", "避免深入交流", "关系紧张时选择逃避"]', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.attachment_config (id, name, description, traits, typical_behaviors, created_at, updated_at) VALUES (4, '紊乱型依恋', '矛盾的依恋模式，既渴望又恐惧亲密', '["矛盾心理", "情绪不稳定", "自我价值感低", "关系模式混乱"]', '["忽冷忽热", "主动接近又突然疏远", "难以信任他人", "冲突处理能力差"]', '2026-01-12 16:55:51', '2026-01-12 16:55:51');
