import { Injectable } from '@nestjs/common';

/**
 * 依恋关系计算结果
 */
export interface AttachmentResult {
  anxietyScore: number; // 焦虑得分 (A)
  avoidanceScore: number; // 回避得分 (B)
  securityScore: number; // 安全感得分 (C)
  type: '安全型' | '焦虑型' | '回避型' | '紊乱型' | '待进一步沟通';
  typeLabel: string;
  description: string;
}

/**
 * 依恋类型配置
 */
const ATTACHMENT_TYPE_CONFIG = {
  安全型: {
    typeLabel: '健康核心型',
    description: '安全感充足，既信任伴侣、愿意亲密，又能保持自我独立',
  },
  焦虑型: {
    typeLabel: '渴求亲密型',
    description: '极度渴望亲密与认可，害怕被抛弃，对关系的安全感极低',
  },
  回避型: {
    typeLabel: '疏离独立型',
    description: '极度重视个人独立，排斥情感亲密与依赖，习惯用疏离保护自己',
  },
  紊乱型: {
    typeLabel: '矛盾纠结型',
    description: '既极度渴望亲密、害怕被抛弃，又极度抗拒亲密、害怕被伤害',
  },
};

/**
 * 依恋关系计算器
 */
@Injectable()
export class AttachmentCalculator {
  /**
   * 计算依恋关系测评结果
   * @param selectedQuestions 用户选中的题目ID数组 ['A1', 'A5', 'B3', 'C10']
   */
  calculate(selectedQuestions: string[]): AttachmentResult {
    // 1. 统计各维度得分
    let anxietyScore = 0; // A维度
    let avoidanceScore = 0; // B维度
    let securityScore = 0; // C维度

    selectedQuestions.forEach((questionId) => {
      if (questionId.startsWith('A')) {
        anxietyScore += 1;
      } else if (questionId.startsWith('B')) {
        avoidanceScore += 1;
      } else if (questionId.startsWith('C')) {
        securityScore += 1;
      }
    });

    // 2. 判定依恋类型（优先级：紊乱型 > 焦虑型 > 回避型 > 安全型）
    let type: AttachmentResult['type'];

    if (anxietyScore >= 5 && avoidanceScore >= 5) {
      type = '紊乱型';
    } else if (anxietyScore >= 5) {
      type = '焦虑型';
    } else if (avoidanceScore >= 5) {
      type = '回避型';
    } else if (securityScore >= 5) {
      type = '安全型';
    } else {
      type = '待进一步沟通';
    }

    // 3. 获取类型配置
    const config = ATTACHMENT_TYPE_CONFIG[type] || {
      typeLabel: '待评估',
      description: '未达到任何类型判定阈值，请联系红娘老师进行进一步沟通',
    };

    return {
      anxietyScore,
      avoidanceScore,
      securityScore,
      type,
      typeLabel: config.typeLabel,
      description: config.description,
    };
  }
}

