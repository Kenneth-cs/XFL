USE xingfuli;

-- 插入测试门店（如果已存在则更新）
INSERT INTO sys_store (id, name, mv_template_id, status, created_at, updated_at) 
VALUES ('XFL001', '总部测试门店', 3, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 查看结果
SELECT id, name, mv_template_id, status FROM sys_store;

