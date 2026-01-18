USE xingfuli;

-- 为张三 (XFL00100001) 插入依恋关系测试结果 (安全型)
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES (
    'XFL00100001', 
    2, 
    '{}', 
    JSON_OBJECT(
        'type', '安全型',
        'typeLabel', '安全型',
        'description', '您在亲密关系中感到安全和舒适，能够自由地依赖伴侣，也乐于被伴侣依赖。您不担心被抛弃，也不担心与他人过于亲密。',
        'anxietyScore', 2.5,
        'avoidanceScore', 1.5,
        'securityScore', 5.5
    ), 
    '{}', 
    1, 
    NOW()
);

-- 为李四 (XFL00100003) 插入依恋关系测试结果 (焦虑型)
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES (
    'XFL00100003', 
    2, 
    '{}', 
    JSON_OBJECT(
        'type', '焦虑型',
        'typeLabel', '焦虑型',
        'description', '您渴望高度的亲密关系，但常常担心伴侣不如您期望的那样爱您。这种不安全感有时会让您在关系中表现得过于粘人或情绪化。',
        'anxietyScore', 5.8,
        'avoidanceScore', 2.1,
        'securityScore', 2.5
    ), 
    '{}', 
    1, 
    NOW()
);

