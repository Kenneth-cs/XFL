create table happiness_dimension
(
    id          tinyint                                 not null comment '维度ID 1-20'
        primary key,
    name        varchar(50)                             not null comment '维度名称（如：积极性格）',
    description text                                    null comment '维度说明',
    color       varchar(20)                             not null comment '展示颜色（HEX）',
    sort_order  tinyint                                 not null comment '圆环中的排序位置',
    max_score   decimal(4, 2) default 10.00             null comment '满分（默认10分）',
    created_at  datetime      default CURRENT_TIMESTAMP null,
    updated_at  datetime      default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    comment '婚恋幸福力20维度配置表';

INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (1, '积极性格', '乐观、开朗、自信的性格特质', '#FF6B6B', 1, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (2, '积极情绪', '体验和表达正面情绪的能力', '#4ECDC4', 2, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (3, '积极沟通', '有效表达和倾听的沟通能力', '#45B7D1', 3, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (4, '积极关系', '建立和维护良好人际关系的能力', '#96CEB4', 4, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (5, '情绪调节', '识别和管理自己情绪的能力', '#FFEAA7', 5, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (6, '同理心', '理解和感受他人情绪的能力', '#DFE6E9', 6, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (7, '自我认知', '了解自己优缺点和价值观', '#A29BFE', 7, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (8, '自我接纳', '接受真实自我的能力', '#FD79A8', 8, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (9, '目标设定', '设定合理目标并执行的能力', '#FDCB6E', 9, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (10, '问题解决', '面对困难时的应对和解决能力', '#6C5CE7', 10, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (11, '责任感', '对自己和他人负责的意识', '#00B894', 11, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (12, '忠诚度', '对关系的忠诚和承诺', '#E17055', 12, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (13, '包容力', '接纳差异、理解多样性的能力', '#74B9FF', 13, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (14, '感恩心', '珍惜和感激拥有的能力', '#A29BFE', 14, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (15, '幽默感', '用幽默化解紧张的能力', '#FFEAA7', 15, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (16, '浪漫情怀', '创造和享受浪漫的能力', '#FF7675', 16, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (17, '性吸引力', '身心健康和魅力的综合体现', '#FD79A8', 17, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (18, '财务智商', '理财和经济规划的能力', '#00B894', 18, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (19, '家庭观念', '对家庭责任和价值的认同', '#FDCB6E', 19, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
INSERT INTO xingfuli.happiness_dimension (id, name, description, color, sort_order, max_score, created_at, updated_at) VALUES (20, '成长意愿', '持续学习和自我提升的动力', '#6C5CE7', 20, 10.00, '2026-01-12 16:55:51', '2026-01-12 16:55:51');
