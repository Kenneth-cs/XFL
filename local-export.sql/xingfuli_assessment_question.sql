create table assessment_question
(
    id           int auto_increment comment '题目ID'
        primary key,
    type         tinyint                            not null comment '测评类型: 1-九型人格, 2-依恋关系, 3-婚恋幸福力',
    question_no  int                                not null comment '题号（同类型内）',
    content      text                               not null comment '题目内容',
    sub_type     varchar(20)                        null comment '子类型（依恋测试用: anxiety/avoidance/security）',
    dimension_id tinyint                            null comment '所属维度ID（幸福力测评用，1-20）',
    options      json                               not null comment '选项数组: [{text: "选项A", score: {...}}]',
    sort_order   int      default 0                 null comment '排序',
    status       tinyint  default 1                 null comment '状态: 1-启用, 0-禁用',
    created_at   datetime default CURRENT_TIMESTAMP null,
    updated_at   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    comment '测评题库表';

create index idx_sort
    on assessment_question (type, sort_order);

create index idx_type
    on assessment_question (type, status);

