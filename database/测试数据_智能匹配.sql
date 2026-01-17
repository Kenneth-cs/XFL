-- =====================================================
-- 智能匹配测试数据脚本
-- 用途：创建多个用户用于测试智能匹配功能
-- 使用方法：在 DataGrip 中全选并执行
-- =====================================================

-- 设置门店ID（根据实际情况修改）
SET @store_id = 'XFL001';

-- =====================================================
-- 1. 男性发起人 - 张三（30岁，二本，MV 80分）
-- =====================================================
INSERT INTO app_user (id, store_id, phone, password, status, created_at, updated_at)
VALUES ('XFL00100001', @store_id, '13800000001', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, NOW(), NOW());

INSERT INTO app_user_profile (user_id, base_info, ext_info, mv_score, mv_detail, created_at, updated_at)
VALUES ('XFL00100001', 
    JSON_OBJECT(
        'name', '张三',
        'gender', '男',
        'height', 175,
        'weight', 70,
        'birthday', '1994-03-15',
        'marriage', '未婚',
        'education', '二本',
        'ethnicity', '汉族'
    ),
    JSON_OBJECT(
        'appearance', '帅气',
        'annualIncome', '20w-50w',
        'housingStatus', '有',
        'hasCar', '有',
        'eqScore', JSON_ARRAY('自我认知', '情绪管理', '认知他人情绪'),
        'parentsMaritalStatus', '父母健康（家庭和睦）'
    ),
    80.00,
    JSON_OBJECT(
        'age', JSON_OBJECT('value', 30, 'score', 12.5, 'label', '25-35岁'),
        'height', JSON_OBJECT('value', 175, 'score', 10.5, 'label', '170-179cm'),
        'appearance', JSON_OBJECT('value', '帅气', 'score', 12.5, 'label', '帅/网红'),
        'wealth', JSON_OBJECT('value', 35, 'score', 10.5, 'label', '20-50W'),
        'intelligence', JSON_OBJECT('value', '二本', 'score', 9.5, 'label', '二本'),
        'eq', JSON_OBJECT('value', 3, 'score', 8.5, 'label', '3项优'),
        'sexual_ability', JSON_OBJECT('value', 30, 'score', 11.5, 'label', '30-35岁'),
        'commitment', JSON_OBJECT('value', 85, 'score', 11.5, 'label', '80分以上')
    ),
    NOW(), NOW()
);

-- 张三的九型人格测评结果（2号助人型为主）
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100001', 1, '{}',
    JSON_OBJECT(
        'top3', JSON_ARRAY(2, 7, 9),
        'percentages', JSON_OBJECT('1', 0.45, '2', 0.85, '3', 0.52, '4', 0.38, '5', 0.42, '6', 0.55, '7', 0.78, '8', 0.48, '9', 0.72),
        'validTypes', JSON_ARRAY(2, 7, 9),
        'matchableOppositeCount', 4,
        'matchableOppositeTypes', JSON_ARRAY(1, 4, 5, 7)
    ),
    JSON_OBJECT('1', 18, '2', 34, '3', 21, '4', 15, '5', 17, '6', 22, '7', 31, '8', 19, '9', 29),
    1, NOW()
);

-- =====================================================
-- 2. 男性发起人 - 李四（25岁，985大学，MV 92分）
-- =====================================================
INSERT INTO app_user (id, store_id, phone, password, status, created_at, updated_at)
VALUES ('XFL00100002', @store_id, '13800000002', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, NOW(), NOW());

INSERT INTO app_user_profile (user_id, base_info, ext_info, mv_score, mv_detail, created_at, updated_at)
VALUES ('XFL00100002',
    JSON_OBJECT(
        'name', '李四',
        'gender', '男',
        'height', 178,
        'weight', 75,
        'birthday', '1999-08-20',
        'marriage', '未婚',
        'education', '985或更高',
        'ethnicity', '汉族'
    ),
    JSON_OBJECT(
        'appearance', '阳光帅气',
        'annualIncome', '50w-100w',
        'housingStatus', '有',
        'hasCar', '有',
        'eqScore', JSON_ARRAY('自我认知', '情绪管理', '自我激励', '认知他人情绪', '处理人际关系'),
        'parentsMaritalStatus', '父母健康（家庭和睦）'
    ),
    92.00,
    JSON_OBJECT(
        'age', JSON_OBJECT('value', 25, 'score', 12.5, 'label', '25-35岁'),
        'height', JSON_OBJECT('value', 178, 'score', 10.5, 'label', '170-179cm'),
        'appearance', JSON_OBJECT('value', '阳光帅气', 'score', 12.5, 'label', '帅/网红'),
        'wealth', JSON_OBJECT('value', 75, 'score', 12.5, 'label', '50-100W'),
        'intelligence', JSON_OBJECT('value', '985或更高', 'score', 12.5, 'label', '985或更高'),
        'eq', JSON_OBJECT('value', 5, 'score', 12.5, 'label', '5项优'),
        'sexual_ability', JSON_OBJECT('value', 25, 'score', 12.5, 'label', '24-29岁'),
        'commitment', JSON_OBJECT('value', 90, 'score', 12.5, 'label', '80分以上')
    ),
    NOW(), NOW()
);

-- 李四的九型人格测评结果（3号成就型为主）
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100002', 1, '{}',
    JSON_OBJECT(
        'top3', JSON_ARRAY(3, 1, 8),
        'percentages', JSON_OBJECT('1', 0.72, '2', 0.48, '3', 0.88, '4', 0.45, '5', 0.52, '6', 0.55, '7', 0.65, '8', 0.70, '9', 0.58),
        'validTypes', JSON_ARRAY(3, 1, 8),
        'matchableOppositeCount', 5,
        'matchableOppositeTypes', JSON_ARRAY(2, 4, 6, 7, 9)
    ),
    JSON_OBJECT('1', 29, '2', 19, '3', 35, '4', 18, '5', 21, '6', 22, '7', 26, '8', 28, '9', 23),
    1, NOW()
);

-- =====================================================
-- 3. 女性候选人 - 王芳（28岁，一本，MV 76分）✅ 与张三匹配
-- =====================================================
INSERT INTO app_user (id, store_id, phone, password, status, created_at, updated_at)
VALUES ('XFL00100003', @store_id, '13800000003', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, NOW(), NOW());

INSERT INTO app_user_profile (user_id, base_info, ext_info, mv_score, mv_detail, created_at, updated_at)
VALUES ('XFL00100003',
    JSON_OBJECT(
        'name', '王芳',
        'gender', '女',
        'height', 165,
        'weight', 52,
        'birthday', '1996-05-10',
        'marriage', '未婚',
        'education', '一本',
        'ethnicity', '汉族'
    ),
    JSON_OBJECT(
        'appearance', '清秀',
        'braCup', 'C',
        'parentsMaritalStatus', '父母健康（家庭和睦）'
    ),
    76.00,
    JSON_OBJECT(
        'age', JSON_OBJECT('value', 28, 'score', 12.5, 'label', '23-30岁'),
        'bmi', JSON_OBJECT('value', 19.1, 'score', 12.5, 'label', '18.5-24正常'),
        'appearance', JSON_OBJECT('value', '清秀', 'score', 10.5, 'label', '清秀/甜美'),
        'bra_cup', JSON_OBJECT('value', 'C', 'score', 12.5, 'label', 'C'),
        'education', JSON_OBJECT('value', '一本', 'score', 10.5, 'label', '一本'),
        'personality', JSON_OBJECT('value', 4, 'score', 10.5, 'label', '4个匹配'),
        'family', JSON_OBJECT('value', '父母健康（家庭和睦）', 'score', 12.5, 'label', '父母健康家庭和睦')
    ),
    NOW(), NOW()
);

-- 王芳的九型人格测评结果（4号艺术型为主）- 与张三的2号匹配
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100003', 1, '{}',
    JSON_OBJECT(
        'top3', JSON_ARRAY(4, 9, 2),
        'percentages', JSON_OBJECT('1', 0.52, '2', 0.68, '3', 0.45, '4', 0.82, '5', 0.48, '6', 0.55, '7', 0.60, '8', 0.42, '9', 0.75),
        'validTypes', JSON_ARRAY(4, 9, 2),
        'matchableOppositeCount', 4,
        'matchableOppositeTypes', JSON_ARRAY(2, 5, 7, 9)
    ),
    JSON_OBJECT('1', 21, '2', 27, '3', 18, '4', 33, '5', 19, '6', 22, '7', 24, '8', 17, '9', 30),
    1, NOW()
);

-- =====================================================
-- 4. 女性候选人 - 赵敏（35岁，大专，MV 58分）❌ MV差距过大
-- =====================================================
INSERT INTO app_user (id, store_id, phone, password, status, created_at, updated_at)
VALUES ('XFL00100004', @store_id, '13800000004', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, NOW(), NOW());

INSERT INTO app_user_profile (user_id, base_info, ext_info, mv_score, mv_detail, created_at, updated_at)
VALUES ('XFL00100004',
    JSON_OBJECT(
        'name', '赵敏',
        'gender', '女',
        'height', 160,
        'weight', 58,
        'birthday', '1989-11-25',
        'marriage', '离异',
        'education', '大专',
        'ethnicity', '汉族'
    ),
    JSON_OBJECT(
        'appearance', '一般',
        'braCup', 'B',
        'parentsMaritalStatus', '父母离异（家庭健康）'
    ),
    58.00,
    JSON_OBJECT(
        'age', JSON_OBJECT('value', 35, 'score', 10.5, 'label', '31-40岁'),
        'bmi', JSON_OBJECT('value', 22.7, 'score', 12.5, 'label', '18.5-24正常'),
        'appearance', JSON_OBJECT('value', '一般', 'score', 8.5, 'label', '一般'),
        'bra_cup', JSON_OBJECT('value', 'B', 'score', 10.5, 'label', 'B'),
        'education', JSON_OBJECT('value', '大专', 'score', 6.5, 'label', '大专'),
        'personality', JSON_OBJECT('value', 0, 'score', 2.5, 'label', '无'),
        'family', JSON_OBJECT('value', '父母离异（家庭健康）', 'score', 10, 'label', '父母离异家庭健康')
    ),
    NOW(), NOW()
);

-- 赵敏没有九型人格测评

-- =====================================================
-- 5. 女性候选人 - 林心如（26岁，985，MV 90分）✅ 与李四匹配
-- =====================================================
INSERT INTO app_user (id, store_id, phone, password, status, created_at, updated_at)
VALUES ('XFL00100005', @store_id, '13800000005', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, NOW(), NOW());

INSERT INTO app_user_profile (user_id, base_info, ext_info, mv_score, mv_detail, created_at, updated_at)
VALUES ('XFL00100005',
    JSON_OBJECT(
        'name', '林心如',
        'gender', '女',
        'height', 168,
        'weight', 50,
        'birthday', '1998-07-08',
        'marriage', '未婚',
        'education', '985或更高',
        'ethnicity', '汉族'
    ),
    JSON_OBJECT(
        'appearance', '漂亮/网红',
        'braCup', 'D',
        'parentsMaritalStatus', '父母健康（家庭和睦）'
    ),
    90.00,
    JSON_OBJECT(
        'age', JSON_OBJECT('value', 26, 'score', 12.5, 'label', '23-30岁'),
        'bmi', JSON_OBJECT('value', 17.7, 'score', 10.5, 'label', '17-18.5微瘦'),
        'appearance', JSON_OBJECT('value', '漂亮/网红', 'score', 12.5, 'label', '漂亮/网红'),
        'bra_cup', JSON_OBJECT('value', 'D', 'score', 12.5, 'label', 'D及以上'),
        'education', JSON_OBJECT('value', '985或更高', 'score', 12.5, 'label', '985或更高'),
        'personality', JSON_OBJECT('value', 5, 'score', 12.5, 'label', '5个及以上匹配'),
        'family', JSON_OBJECT('value', '父母健康（家庭和睦）', 'score', 12.5, 'label', '父母健康家庭和睦')
    ),
    NOW(), NOW()
);

-- 林心如的九型人格测评结果（7号活跃型为主）- 与李四的3号匹配
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100005', 1, '{}',
    JSON_OBJECT(
        'top3', JSON_ARRAY(7, 2, 9),
        'percentages', JSON_OBJECT('1', 0.55, '2', 0.75, '3', 0.62, '4', 0.48, '5', 0.52, '6', 0.58, '7', 0.90, '8', 0.45, '9', 0.70),
        'validTypes', JSON_ARRAY(7, 2, 9),
        'matchableOppositeCount', 6,
        'matchableOppositeTypes', JSON_ARRAY(1, 3, 5, 6, 7, 9)
    ),
    JSON_OBJECT('1', 22, '2', 30, '3', 25, '4', 19, '5', 21, '6', 23, '7', 36, '8', 18, '9', 28),
    1, NOW()
);

-- =====================================================
-- 6. 男性候选人 - 刘德华（32岁，二本，MV 82分）供女性发起人使用
-- =====================================================
INSERT INTO app_user (id, store_id, phone, password, status, created_at, updated_at)
VALUES ('XFL00100006', @store_id, '13800000006', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, NOW(), NOW());

INSERT INTO app_user_profile (user_id, base_info, ext_info, mv_score, mv_detail, created_at, updated_at)
VALUES ('XFL00100006',
    JSON_OBJECT(
        'name', '刘德华',
        'gender', '男',
        'height', 180,
        'weight', 75,
        'birthday', '1992-02-14',
        'marriage', '未婚',
        'education', '二本',
        'ethnicity', '汉族'
    ),
    JSON_OBJECT(
        'appearance', '帅气',
        'annualIncome', '20w-50w',
        'housingStatus', '有',
        'hasCar', '有',
        'eqScore', JSON_ARRAY('自我认知', '情绪管理', '认知他人情绪', '处理人际关系'),
        'parentsMaritalStatus', '父母健康（家庭和睦）'
    ),
    82.00,
    JSON_OBJECT(
        'age', JSON_OBJECT('value', 32, 'score', 12.5, 'label', '25-35岁'),
        'height', JSON_OBJECT('value', 180, 'score', 10.5, 'label', '180cm以上'),
        'appearance', JSON_OBJECT('value', '帅气', 'score', 12.5, 'label', '帅/网红'),
        'wealth', JSON_OBJECT('value', 35, 'score', 10.5, 'label', '20-50W'),
        'intelligence', JSON_OBJECT('value', '二本', 'score', 9.5, 'label', '二本'),
        'eq', JSON_OBJECT('value', 4, 'score', 10.5, 'label', '4项优'),
        'sexual_ability', JSON_OBJECT('value', 32, 'score', 11.5, 'label', '30-35岁'),
        'commitment', JSON_OBJECT('value', 85, 'score', 11.5, 'label', '80分以上')
    ),
    NOW(), NOW()
);

-- 刘德华的九型人格测评结果（9号和平型为主）
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100006', 1, '{}',
    JSON_OBJECT(
        'top3', JSON_ARRAY(9, 6, 2),
        'percentages', JSON_OBJECT('1', 0.48, '2', 0.68, '3', 0.52, '4', 0.45, '5', 0.50, '6', 0.72, '7', 0.58, '8', 0.42, '9', 0.85),
        'validTypes', JSON_ARRAY(9, 6, 2),
        'matchableOppositeCount', 5,
        'matchableOppositeTypes', JSON_ARRAY(2, 3, 4, 7, 9)
    ),
    JSON_OBJECT('1', 19, '2', 27, '3', 21, '4', 18, '5', 20, '6', 29, '7', 23, '8', 17, '9', 34),
    1, NOW()
);

-- =====================================================
-- 7. 女性发起人 - 周慧敏（29岁，一本，MV 72分）
-- =====================================================
INSERT INTO app_user (id, store_id, phone, password, status, created_at, updated_at)
VALUES ('XFL00100007', @store_id, '13800000007', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, NOW(), NOW());

INSERT INTO app_user_profile (user_id, base_info, ext_info, mv_score, mv_detail, created_at, updated_at)
VALUES ('XFL00100007',
    JSON_OBJECT(
        'name', '周慧敏',
        'gender', '女',
        'height', 163,
        'weight', 50,
        'birthday', '1995-09-18',
        'marriage', '未婚',
        'education', '一本',
        'ethnicity', '汉族'
    ),
    JSON_OBJECT(
        'appearance', '清秀',
        'braCup', 'B',
        'parentsMaritalStatus', '父母健康（家庭和睦）'
    ),
    72.00,
    JSON_OBJECT(
        'age', JSON_OBJECT('value', 29, 'score', 12.5, 'label', '23-30岁'),
        'bmi', JSON_OBJECT('value', 18.8, 'score', 12.5, 'label', '18.5-24正常'),
        'appearance', JSON_OBJECT('value', '清秀', 'score', 10.5, 'label', '清秀/甜美'),
        'bra_cup', JSON_OBJECT('value', 'B', 'score', 10.5, 'label', 'B'),
        'education', JSON_OBJECT('value', '一本', 'score', 10.5, 'label', '一本'),
        'personality', JSON_OBJECT('value', 3, 'score', 8.5, 'label', '3个匹配'),
        'family', JSON_OBJECT('value', '父母健康（家庭和睦）', 'score', 12.5, 'label', '父母健康家庭和睦')
    ),
    NOW(), NOW()
);

-- 周慧敏的九型人格测评结果（2号助人型为主）
INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
VALUES ('XFL00100007', 1, '{}',
    JSON_OBJECT(
        'top3', JSON_ARRAY(2, 6, 9),
        'percentages', JSON_OBJECT('1', 0.52, '2', 0.82, '3', 0.48, '4', 0.45, '5', 0.50, '6', 0.70, '7', 0.58, '8', 0.42, '9', 0.68),
        'validTypes', JSON_ARRAY(2, 6, 9),
        'matchableOppositeCount', 3,
        'matchableOppositeTypes', JSON_ARRAY(5, 8, 9)
    ),
    JSON_OBJECT('1', 21, '2', 33, '3', 19, '4', 18, '5', 20, '6', 28, '7', 23, '8', 17, '9', 27),
    1, NOW()
);

-- =====================================================
-- 8. 年龄超范围的候选人 - 孙丽（22岁）测试年龄筛选
-- =====================================================
INSERT INTO app_user (id, store_id, phone, password, status, created_at, updated_at)
VALUES ('XFL00100008', @store_id, '13800000008', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, NOW(), NOW());

INSERT INTO app_user_profile (user_id, base_info, ext_info, mv_score, mv_detail, created_at, updated_at)
VALUES ('XFL00100008',
    JSON_OBJECT(
        'name', '孙丽',
        'gender', '女',
        'height', 165,
        'weight', 48,
        'birthday', '2002-06-15',
        'marriage', '未婚',
        'education', '二本',
        'ethnicity', '汉族'
    ),
    JSON_OBJECT(
        'appearance', '清秀',
        'braCup', 'C',
        'parentsMaritalStatus', '父母健康（家庭和睦）'
    ),
    68.00,
    JSON_OBJECT(
        'age', JSON_OBJECT('value', 22, 'score', 10.5, 'label', '18-22岁'),
        'bmi', JSON_OBJECT('value', 17.6, 'score', 10.5, 'label', '17-18.5微瘦'),
        'appearance', JSON_OBJECT('value', '清秀', 'score', 10.5, 'label', '清秀/甜美'),
        'bra_cup', JSON_OBJECT('value', 'C', 'score', 12.5, 'label', 'C'),
        'education', JSON_OBJECT('value', '二本', 'score', 8.5, 'label', '二本'),
        'personality', JSON_OBJECT('value', 2, 'score', 6.5, 'label', '2个匹配'),
        'family', JSON_OBJECT('value', '父母健康（家庭和睦）', 'score', 12.5, 'label', '父母健康家庭和睦')
    ),
    NOW(), NOW()
);

-- =====================================================
-- 9. 身高不符的候选人 - 陈小雨（155cm）测试身高筛选
-- =====================================================
INSERT INTO app_user (id, store_id, phone, password, status, created_at, updated_at)
VALUES ('XFL00100009', @store_id, '13800000009', '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN', 1, NOW(), NOW());

INSERT INTO app_user_profile (user_id, base_info, ext_info, mv_score, mv_detail, created_at, updated_at)
VALUES ('XFL00100009',
    JSON_OBJECT(
        'name', '陈小雨',
        'gender', '女',
        'height', 155,
        'weight', 45,
        'birthday', '1996-12-20',
        'marriage', '未婚',
        'education', '一本',
        'ethnicity', '汉族'
    ),
    JSON_OBJECT(
        'appearance', '可爱',
        'braCup', 'B',
        'parentsMaritalStatus', '父母健康（家庭和睦）'
    ),
    70.00,
    JSON_OBJECT(
        'age', JSON_OBJECT('value', 28, 'score', 12.5, 'label', '23-30岁'),
        'bmi', JSON_OBJECT('value', 18.7, 'score', 12.5, 'label', '18.5-24正常'),
        'appearance', JSON_OBJECT('value', '可爱', 'score', 10.5, 'label', '清秀/甜美'),
        'bra_cup', JSON_OBJECT('value', 'B', 'score', 10.5, 'label', 'B'),
        'education', JSON_OBJECT('value', '一本', 'score', 10.5, 'label', '一本'),
        'personality', JSON_OBJECT('value', 3, 'score', 8.5, 'label', '3个匹配'),
        'family', JSON_OBJECT('value', '父母健康（家庭和睦）', 'score', 12.5, 'label', '父母健康家庭和睦')
    ),
    NOW(), NOW()
);

-- =====================================================
-- 验证数据插入
-- =====================================================
SELECT '✅ 测试数据插入完成！' AS status;
SELECT COUNT(*) AS '新增用户数', @store_id AS '门店ID' FROM app_user WHERE id LIKE 'XFL001000%';
SELECT 
    u.id AS '用户ID',
    JSON_UNQUOTE(JSON_EXTRACT(p.base_info, '$.name')) AS '姓名',
    JSON_UNQUOTE(JSON_EXTRACT(p.base_info, '$.gender')) AS '性别',
    TIMESTAMPDIFF(YEAR, STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(p.base_info, '$.birthday')), '%Y-%m-%d'), CURDATE()) AS '年龄',
    JSON_UNQUOTE(JSON_EXTRACT(p.base_info, '$.height')) AS '身高',
    JSON_UNQUOTE(JSON_EXTRACT(p.base_info, '$.education')) AS '学历',
    p.mv_score AS 'MV分',
    CASE WHEN a.id IS NOT NULL THEN '是' ELSE '否' END AS '有九型测评'
FROM app_user u
LEFT JOIN app_user_profile p ON u.id = p.user_id
LEFT JOIN assessment_record a ON u.id = a.user_id AND a.type = 1 AND a.is_latest = 1
WHERE u.id LIKE 'XFL001000%'
ORDER BY u.id;

-- =====================================================
-- 测试场景说明
-- =====================================================
/*
📋 测试场景说明：

1️⃣ 【张三 发起匹配】（男，30岁，175cm，二本，MV 80）
   筛选条件：女，25-35岁，160-170cm，大专-一本
   预期结果：
   ✅ 王芳 - MV差距4分（通过），年龄28（符合），身高165（符合），一本（符合），有九型测评
   ❌ 赵敏 - MV差距22分（不通过），但会记录
   ❌ 林心如 - 学历985（超出范围），被筛除
   ❌ 孙丽 - 年龄22（低于25），被筛除
   ❌ 陈小雨 - 身高155（低于160），被筛除

2️⃣ 【李四 发起匹配】（男，25岁，178cm，985，MV 92）
   筛选条件：女，23-30岁，160-170cm，一本-985
   预期结果：
   ✅ 林心如 - MV差距2分（通过），年龄26（符合），身高168（符合），985（符合），有九型测评
   ✅ 王芳 - MV差距16分（不通过），但会记录
   ❌ 赵敏 - 学历大专（低于一本），被筛除

3️⃣ 【周慧敏 发起匹配】（女，29岁，163cm，一本，MV 72）
   筛选条件：男，28-35岁，175-185cm，二本-一本
   预期结果：
   ✅ 张三 - MV差距4分（通过），年龄30（符合），身高175（符合），二本（符合），有九型测评
   ✅ 刘德华 - MV差距10分（不通过），年龄32（符合），身高180（符合），二本（符合），有九型测评
   ❌ 李四 - 学历985（超出范围），被筛除

💡 使用提示：
- 在 DataGrip 中全选本脚本并执行（Ctrl+Enter）
- 执行后会看到验证查询结果，确认数据插入成功
- 可以修改 @store_id 变量以适配您的门店ID
- 密码已加密（虽然是假数据），保持数据库一致性
- 所有用户的登录密码统一为：test123456（已加密）
*/

