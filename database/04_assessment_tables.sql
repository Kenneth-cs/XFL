-- ============================================
-- 第二阶段：心理测评系统数据表
-- 创建时间：2026-01-12
-- 说明：包含三大测评（九型人格、依恋关系、婚恋幸福力）的题库、配置和记录表
-- ============================================

USE xingfuli;

-- ============================================
-- 1. 测评题库表 (assessment_question)
-- ============================================
DROP TABLE IF EXISTS assessment_question;
CREATE TABLE assessment_question (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '题目ID',
  type TINYINT NOT NULL COMMENT '测评类型: 1-九型人格, 2-依恋关系, 3-婚恋幸福力',
  question_no INT NOT NULL COMMENT '题号（同类型内）',
  content TEXT NOT NULL COMMENT '题目内容',
  sub_type VARCHAR(20) DEFAULT NULL COMMENT '子类型（依恋测试用: anxiety/avoidance/security）',
  dimension_id TINYINT DEFAULT NULL COMMENT '所属维度ID（幸福力测评用，1-20）',
  options JSON NOT NULL COMMENT '选项数组: [{text: "选项A", score: {...}}]',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态: 1-启用, 0-禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type, status),
  INDEX idx_sort (type, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='测评题库表';

-- ============================================
-- 2. 九型人格配置表 (enneagram_config)
-- ============================================
DROP TABLE IF EXISTS enneagram_config;
CREATE TABLE enneagram_config (
  id TINYINT PRIMARY KEY COMMENT '人格编号 1-9',
  name VARCHAR(50) NOT NULL COMMENT '人格名称（如：完美主义者）',
  title VARCHAR(100) NOT NULL COMMENT '副标题',
  description TEXT COMMENT '详细描述',
  traits JSON COMMENT '核心特质列表',
  standard_score INT NOT NULL COMMENT '标准满分',
  color VARCHAR(20) DEFAULT NULL COMMENT '展示颜色',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='九型人格配置表';

-- ============================================
-- 3. 九型人格匹配矩阵 (enneagram_match_matrix)
-- ============================================
DROP TABLE IF EXISTS enneagram_match_matrix;
CREATE TABLE enneagram_match_matrix (
  id INT AUTO_INCREMENT PRIMARY KEY,
  male_type TINYINT NOT NULL COMMENT '男方人格类型 1-9',
  female_type TINYINT NOT NULL COMMENT '女方人格类型 1-9',
  score TINYINT NOT NULL COMMENT '匹配得分: 1-适合, 0-中性, -1-互斥',
  description VARCHAR(200) DEFAULT NULL COMMENT '匹配说明',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_match (male_type, female_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='九型人格匹配矩阵（9x9）';

-- ============================================
-- 4. 依恋类型配置表 (attachment_config)
-- ============================================
DROP TABLE IF EXISTS attachment_config;
CREATE TABLE attachment_config (
  id TINYINT PRIMARY KEY COMMENT '类型编号: 1-安全型, 2-焦虑型, 3-回避型, 4-紊乱型',
  name VARCHAR(50) NOT NULL COMMENT '类型名称',
  description TEXT COMMENT '类型描述',
  traits JSON COMMENT '核心特质',
  typical_behaviors JSON COMMENT '典型行为表现',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='依恋类型配置表';

-- ============================================
-- 5. 幸福力维度配置表 (happiness_dimension)
-- ============================================
DROP TABLE IF EXISTS happiness_dimension;
CREATE TABLE happiness_dimension (
  id TINYINT PRIMARY KEY COMMENT '维度ID 1-20',
  name VARCHAR(50) NOT NULL COMMENT '维度名称（如：积极性格）',
  description TEXT COMMENT '维度说明',
  color VARCHAR(20) NOT NULL COMMENT '展示颜色（HEX）',
  sort_order TINYINT NOT NULL COMMENT '圆环中的排序位置',
  max_score DECIMAL(4,2) DEFAULT 10.00 COMMENT '满分（默认10分）',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='婚恋幸福力20维度配置表';

-- ============================================
-- 6. 测评记录表 (assessment_record) - 完善版
-- ============================================
-- 如果已存在则删除后重建
DROP TABLE IF EXISTS assessment_record;
CREATE TABLE assessment_record (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(20) NOT NULL COMMENT '用户ID',
  type TINYINT NOT NULL COMMENT '测评类型: 1-九型, 2-依恋, 3-幸福力',
  answers JSON NOT NULL COMMENT '原始答卷: [{question_id: 1, option_index: 0}, ...]',
  result_data JSON NOT NULL COMMENT '计算结果 (结构化JSON)',
  raw_scores JSON DEFAULT NULL COMMENT '原始分数明细（调试用）',
  is_latest TINYINT DEFAULT 1 COMMENT '是否最新记录: 1-是, 0-否（支持重测）',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id, type),
  INDEX idx_latest (user_id, type, is_latest),
  CONSTRAINT fk_assessment_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='测评记录表';

-- ============================================
-- 初始化基础配置数据
-- ============================================

-- 插入依恋类型配置
INSERT INTO attachment_config (id, name, description, traits, typical_behaviors) VALUES
(1, '安全型依恋', '能够建立稳定、信任的亲密关系', 
 '["信任他人", "情绪稳定", "善于沟通", "独立自主"]',
 '["愿意分享感受", "不过度依赖", "能给予对方空间", "冲突时能理性沟通"]'),
(2, '焦虑型依恋', '过度担心被抛弃，需要不断的确认', 
 '["敏感多疑", "情绪波动大", "需要被认可", "害怕被抛弃"]',
 '["频繁查看消息", "需要持续关注", "容易吃醋", "对分离高度焦虑"]'),
(3, '回避型依恋', '逃避亲密关系，保持情感距离', 
 '["独立性强", "不愿依赖他人", "压抑情感", "逃避承诺"]',
 '["不主动表达爱意", "需要大量个人空间", "避免深入交流", "关系紧张时选择逃避"]'),
(4, '紊乱型依恋', '矛盾的依恋模式，既渴望又恐惧亲密', 
 '["矛盾心理", "情绪不稳定", "自我价值感低", "关系模式混乱"]',
 '["忽冷忽热", "主动接近又突然疏远", "难以信任他人", "冲突处理能力差"]');

-- 插入九型人格基础配置（示例，后续可补充完整描述）
INSERT INTO enneagram_config (id, name, title, description, standard_score, color) VALUES
(1, '完美主义者', '改革者·理想主义', '追求完美，有强烈的是非观念，注重原则和纪律', 100, '#E74C3C'),
(2, '助人者', '给予者·博爱主义', '热心助人，渴望被需要，关注他人需求', 100, '#3498DB'),
(3, '成就者', '实干家·目标导向', '追求成功，注重效率，善于展示自己', 100, '#2ECC71'),
(4, '浪漫主义者', '艺术家·个性独特', '情感丰富，追求独特性，艺术气质浓厚', 100, '#9B59B6'),
(5, '观察者', '思考者·理性分析', '喜欢思考，注重知识，保持客观冷静', 100, '#1ABC9C'),
(6, '忠诚者', '怀疑论者·安全第一', '忠诚可靠，注重安全感，有责任心', 100, '#F39C12'),
(7, '享乐主义者', '冒险家·乐观派', '乐观开朗，追求快乐，喜欢新鲜体验', 100, '#E67E22'),
(8, '挑战者', '领导者·保护者', '意志坚定，保护弱者，掌控力强', 100, '#34495E'),
(9, '和平主义者', '调停者·和谐至上', '随和平静，追求和谐，避免冲突', 100, '#95A5A6');

-- 插入幸福力20维度配置（按照PRD要求的20个维度）
INSERT INTO happiness_dimension (id, name, description, color, sort_order, max_score) VALUES
(1, '积极性格', '乐观、开朗、自信的性格特质', '#FF6B6B', 1, 10.00),
(2, '积极情绪', '体验和表达正面情绪的能力', '#4ECDC4', 2, 10.00),
(3, '积极沟通', '有效表达和倾听的沟通能力', '#45B7D1', 3, 10.00),
(4, '积极关系', '建立和维护良好人际关系的能力', '#96CEB4', 4, 10.00),
(5, '情绪调节', '识别和管理自己情绪的能力', '#FFEAA7', 5, 10.00),
(6, '同理心', '理解和感受他人情绪的能力', '#DFE6E9', 6, 10.00),
(7, '自我认知', '了解自己优缺点和价值观', '#A29BFE', 7, 10.00),
(8, '自我接纳', '接受真实自我的能力', '#FD79A8', 8, 10.00),
(9, '目标设定', '设定合理目标并执行的能力', '#FDCB6E', 9, 10.00),
(10, '问题解决', '面对困难时的应对和解决能力', '#6C5CE7', 10, 10.00),
(11, '责任感', '对自己和他人负责的意识', '#00B894', 11, 10.00),
(12, '忠诚度', '对关系的忠诚和承诺', '#E17055', 12, 10.00),
(13, '包容力', '接纳差异、理解多样性的能力', '#74B9FF', 13, 10.00),
(14, '感恩心', '珍惜和感激拥有的能力', '#A29BFE', 14, 10.00),
(15, '幽默感', '用幽默化解紧张的能力', '#FFEAA7', 15, 10.00),
(16, '浪漫情怀', '创造和享受浪漫的能力', '#FF7675', 16, 10.00),
(17, '性吸引力', '身心健康和魅力的综合体现', '#FD79A8', 17, 10.00),
(18, '财务智商', '理财和经济规划的能力', '#00B894', 18, 10.00),
(19, '家庭观念', '对家庭责任和价值的认同', '#FDCB6E', 19, 10.00),
(20, '成长意愿', '持续学习和自我提升的动力', '#6C5CE7', 20, 10.00);

-- ============================================
-- 索引优化建议
-- ============================================
-- 说明：以上表结构已包含基础索引，后续根据实际查询性能可进一步优化

SELECT '✅ 第二阶段测评系统数据表创建完成！' AS result;

