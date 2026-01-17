USE xingfuli;

-- 为现有测试用户添加幸福力测评记录
-- 张三 (XFL00100001)
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100001', 3, '{}', 
    JSON_OBJECT(
        '积极性格', 8, '积极情绪', 7, '积极心态', 9, '积极力量', 6, '积极语言', 8,
        '积极沟通', 7, '积极教育', 5, '积极教养', 6, '积极习惯', 9, '积极天赋', 8,
        '积极自尊', 7, '积极关系', 8, '积极改变', 6, '积极信念', 9, '积极体验', 8,
        '积极品质', 7, '积极投入', 8, '积极自我', 6, '积极目标', 9, '积极意义', 7
    ),
    '{}', 1, NOW()
);

-- 李四 (XFL00100002)
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100002', 3, '{}', 
    JSON_OBJECT(
        '积极性格', 6, '积极情绪', 8, '积极心态', 7, '积极力量', 8, '积极语言', 6,
        '积极沟通', 8, '积极教育', 7, '积极教养', 8, '积极习惯', 6, '积极天赋', 7,
        '积极自尊', 8, '积极关系', 6, '积极改变', 8, '积极信念', 7, '积极体验', 8,
        '积极品质', 6, '积极投入', 7, '积极自我', 8, '积极目标', 6, '积极意义', 8
    ),
    '{}', 1, NOW()
);

-- 王芳 (XFL00100003)
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100003', 3, '{}', 
    JSON_OBJECT(
        '积极性格', 9, '积极情绪', 9, '积极心态', 8, '积极力量', 9, '积极语言', 8,
        '积极沟通', 9, '积极教育', 8, '积极教养', 9, '积极习惯', 8, '积极天赋', 9,
        '积极自尊', 8, '积极关系', 9, '积极改变', 8, '积极信念', 9, '积极体验', 8,
        '积极品质', 9, '积极投入', 8, '积极自我', 9, '积极目标', 8, '积极意义', 9
    ),
    '{}', 1, NOW()
);

-- 林心如 (XFL00100005)
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100005', 3, '{}', 
    JSON_OBJECT(
        '积极性格', 7, '积极情绪', 6, '积极心态', 7, '积极力量', 6, '积极语言', 7,
        '积极沟通', 6, '积极教育', 7, '积极教养', 6, '积极习惯', 7, '积极天赋', 6,
        '积极自尊', 7, '积极关系', 6, '积极改变', 7, '积极信念', 6, '积极体验', 7,
        '积极品质', 6, '积极投入', 7, '积极自我', 6, '积极目标', 7, '积极意义', 6
    ),
    '{}', 1, NOW()
);

-- 周慧敏 (XFL00100007)
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100007', 3, '{}', 
    JSON_OBJECT(
        '积极性格', 5, '积极情绪', 4, '积极心态', 5, '积极力量', 4, '积极语言', 5,
        '积极沟通', 4, '积极教育', 5, '积极教养', 4, '积极习惯', 5, '积极天赋', 4,
        '积极自尊', 5, '积极关系', 4, '积极改变', 5, '积极信念', 4, '积极体验', 5,
        '积极品质', 4, '积极投入', 5, '积极自我', 4, '积极目标', 5, '积极意义', 4
    ),
    '{}', 1, NOW()
);

SELECT '✅ 幸福力测试数据补充完成！' AS status;

