create table enneagram_match_matrix
(
    id          int auto_increment
        primary key,
    male_type   tinyint                            not null comment '男方人格类型 1-9',
    female_type tinyint                            not null comment '女方人格类型 1-9',
    score       tinyint                            not null comment '匹配得分: 1-适合, 0-中性, -1-互斥',
    description varchar(200)                       null comment '匹配说明',
    created_at  datetime default CURRENT_TIMESTAMP null,
    constraint uk_match
        unique (male_type, female_type)
)
    comment '九型人格匹配矩阵（9x9）';

