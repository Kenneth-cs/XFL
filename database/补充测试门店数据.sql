-- 补充测试门店数据
-- 如果注册页面的门店选择器没有显示选项，请执行此脚本

USE xingfuli;

-- 先检查是否已存在测试门店
SELECT '检查现有门店数据...' AS info;
SELECT id, name, status FROM sys_store;

-- 如果上面查询结果为空，则插入测试门店
-- 注意：如果门店已存在，这条语句会报错，可以忽略
INSERT INTO sys_store (id, name, mv_template_id, status, created_at, updated_at) 
VALUES ('XFL001', '总部测试门店', 3, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 再次查询确认
SELECT '插入后的门店数据：' AS info;
SELECT id, name, mv_template_id, status, created_at, updated_at FROM sys_store;

-- 如果需要添加更多测试门店，可以继续添加：
-- INSERT INTO sys_store (id, name, mv_template_id, status, created_at, updated_at) 
-- VALUES 
--   ('XFL002', '北京朝阳门店', 3, 1, NOW(), NOW()),
--   ('XFL003', '上海浦东门店', 3, 1, NOW(), NOW()),
--   ('XFL004', '广州天河门店', 3, 1, NOW(), NOW()),
--   ('XFL005', '深圳南山门店', 3, 1, NOW(), NOW())
-- ON DUPLICATE KEY UPDATE updated_at = NOW();

SELECT '✅ 门店数据补充完成！' AS result;

