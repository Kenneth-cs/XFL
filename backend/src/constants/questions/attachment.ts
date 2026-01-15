/**
 * 依恋关系测评题库
 * 总计36题，分为三个测试维度：焦虑测试(A)、回避测试(B)、安全感测试(C)
 * 题型：多选题，选中计1分，未选中计0分
 */

export interface AttachmentQuestion {
  questionId: string;
  content: string;
  dimension: 'A' | 'B' | 'C'; // A=焦虑维度, B=回避维度, C=安全感维度
}

/**
 * 依恋关系计算结果
 */
export interface AttachmentResult {
  anxietyScore: number;  // 焦虑得分 (A)
  avoidanceScore: number; // 回避得分 (B)
  securityScore: number;  // 安全感得分 (C)
  type: '安全型' | '焦虑型' | '回避型' | '紊乱型' | '得分不足，待进一步沟通';
  typeLabel: string;
  description: string;
}

/**
 * 测试一：焦虑测试（对应焦虑型维度计分）
 * 衡量对「关系被抛弃、不被爱」的担忧程度
 */
export const ANXIETY_QUESTIONS: AttachmentQuestion[] = [
  { questionId: 'A1', content: '在恋爱中特别渴望亲密', dimension: 'A' },
  { questionId: 'A2', content: '在亲密关系中，害怕被抛弃，极度的不安全感', dimension: 'A' },
  { questionId: 'A3', content: '渴望爱人时时刻刻在身边', dimension: 'A' },
  { questionId: 'A4', content: '不会表达心意，想要爱人去猜', dimension: 'A' },
  { questionId: 'A5', content: '在恋爱中特别敏感，容易伤心、生气', dimension: 'A' },
  { questionId: 'A6', content: '在每一段感情中都会过分投入', dimension: 'A' },
  { questionId: 'A7', content: '努力维系感情，过度讨好，害怕被抛弃', dimension: 'A' },
  { questionId: 'A8', content: '会常常怀疑伴侣的忠诚', dimension: 'A' },
  { questionId: 'A9', content: '很难告诉对方自己的诉求和困扰，有什么话不愿意说出来', dimension: 'A' },
  { questionId: 'A10', content: '特别渴望得到伴侣的安抚与爱', dimension: 'A' },
  { questionId: 'A11', content: '特别想清楚地了解双方关系进展的程度', dimension: 'A' },
  { questionId: 'A12', content: '特别想知道自己在对方心目中的位置', dimension: 'A' },
];

/**
 * 测试二：回避测试（对应回避型维度计分）
 * 衡量对「情感亲密、过度依赖」的抗拒程度
 */
export const AVOIDANCE_QUESTIONS: AttachmentQuestion[] = [
  { questionId: 'B1', content: '重视自我独立，不愿意过度投入感情', dimension: 'B' },
  { questionId: 'B2', content: '强调关系中的界限，不愿意过度亲近', dimension: 'B' },
  { questionId: 'B3', content: '会贬损伴侣或者说前任的坏话', dimension: 'B' },
  { questionId: 'B4', content: '对未来伴侣有很多不切实际的幻想', dimension: 'B' },
  { questionId: 'B5', content: '有时候会害怕恋人利用自己', dimension: 'B' },
  { questionId: 'B6', content: '和伴侣发生争执的时候，要么逃避，要么爆发大怒', dimension: 'B' },
  { questionId: 'B7', content: '不愿清晰表达自己的需求', dimension: 'B' },
  { questionId: 'B8', content: '不愿意和伴侣谈论感情中的问题', dimension: 'B' },
  { questionId: 'B9', content: '无论从生理还是心理上都和对方保持一定的距离', dimension: 'B' },
  { questionId: 'B10', content: '时时刻刻准备，想要逃离伴侣', dimension: 'B' },
  { questionId: 'B11', content: '不善于解读对方的暗示', dimension: 'B' },
  { questionId: 'B12', content: '发生冲突以后会渴望分离，选择消失一段时间', dimension: 'B' },
];

/**
 * 测试三：安全感测试（对应安全型依恋判定辅助）
 */
export const SECURITY_QUESTIONS: AttachmentQuestion[] = [
  { questionId: 'C1', content: '言行一致，值得信赖', dimension: 'C' },
  { questionId: 'C2', content: '有什么事会和伴侣商量，会和伴侣一起去做决定，愿意听从伴侣的意见', dimension: 'C' },
  { questionId: 'C3', content: '愿意和伴侣共同商量感情的事情', dimension: 'C' },
  { questionId: 'C4', content: '和伴侣面对冲突时愿意妥协', dimension: 'C' },
  { questionId: 'C5', content: '不惧怕承诺，可以分离，也可以亲密', dimension: 'C' },
  { questionId: 'C6', content: '恋爱失败，下一次开始也很容易', dimension: 'C' },
  { questionId: 'C7', content: '恋爱时很快介绍伴侣和朋友认识', dimension: 'C' },
  { questionId: 'C8', content: '自然而然地流露内在的感情', dimension: 'C' },
  { questionId: 'C9', content: '内心的渴望、恐惧、期待……情感部分会告诉伴侣', dimension: 'C' },
  { questionId: 'C10', content: '对亲密关系的态度很随和，愿一起探讨情感中的问题，形成良性循环', dimension: 'C' },
  { questionId: 'C11', content: '不玩感情的小把戏，能适度的依赖，也不怕被人依赖', dimension: 'C' },
  { questionId: 'C12', content: '不过度亲密也会保持恰当的距离，能给别人空间，也能与人亲密', dimension: 'C' },
];

/**
 * 完整题库（按测试顺序组合）
 */
export const ATTACHMENT_QUESTIONS: AttachmentQuestion[] = [
  ...ANXIETY_QUESTIONS,
  ...AVOIDANCE_QUESTIONS,
  ...SECURITY_QUESTIONS,
];

/**
 * 依恋类型配置（用于结果展示）
 */
export const ATTACHMENT_TYPE_CONFIG = {
  安全型: {
    dimensionCombination: '低焦虑+低回避',
    typeLabel: '健康核心型',
    coreTraits: '安全感充足，既信任伴侣、愿意亲密，又能保持自我独立',
  },
  焦虑型: {
    dimensionCombination: '高焦虑+低回避',
    typeLabel: '渴求亲密型',
    coreTraits: '极度渴望亲密与认可，害怕被抛弃，对关系的安全感极低',
  },
  回避型: {
    dimensionCombination: '低焦虑+高回避',
    typeLabel: '疏离独立型',
    coreTraits: '极度重视个人独立，排斥情感亲密与依赖，习惯用疏离保护自己',
  },
  紊乱型: {
    dimensionCombination: '高焦虑+高回避',
    typeLabel: '矛盾纠结型',
    coreTraits: '既极度渴望亲密、害怕被抛弃，又极度抗拒亲密、害怕被伤害',
  },
};

