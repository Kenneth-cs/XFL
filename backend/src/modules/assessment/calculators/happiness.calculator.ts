import { Injectable } from '@nestjs/common';
import { HAPPINESS_DIMENSIONS } from '../../../constants/questions/happiness';

/**
 * 幸福力单个维度得分
 */
export interface HappinessDimensionScore {
  dimensionId: number;
  dimensionName: string;
  shortName: string;
  rawScore: number; // 原始得分
  maxScore: number; // 该维度最高分
  targetScore: number; // 换算目标分（通常是10分）
  normalizedScore: number; // 归一化得分（0-10分）
  percentage: number; // 百分比（0-1）
}

/**
 * 幸福力计算结果
 */
export interface HappinessResult {
  dimensions: HappinessDimensionScore[]; // 20个维度的得分
  averageScore: number; // 平均得分（0-10分）
  totalRawScore: number; // 总原始得分
  totalMaxScore: number; // 总最高分
}

/**
 * 幸福力计算器
 */
@Injectable()
export class HappinessCalculator {
  /**
   * 计算幸福力测评结果
   * @param answers 用户答案数组 [{questionId: 'D1-Q1', score: 4}, ...]
   */
  calculate(answers: Array<{ questionId: string; score: number }>): HappinessResult {
    // 1. 按维度分组统计得分
    const dimensionScores: Record<number, number> = {};
    
    answers.forEach((answer) => {
      // 从 questionId 提取维度ID (如 'D1-Q1' -> 1, 'D12-Q5' -> 12)
      const match = answer.questionId.match(/^D(\d+)-Q\d+$/);
      if (match) {
        const dimensionId = parseInt(match[1]);
        if (!dimensionScores[dimensionId]) {
          dimensionScores[dimensionId] = 0;
        }
        dimensionScores[dimensionId] += answer.score;
      }
    });

    // 2. 计算每个维度的归一化得分
    const dimensions: HappinessDimensionScore[] = HAPPINESS_DIMENSIONS.map((dimension) => {
      const rawScore = dimensionScores[dimension.id] || 0;
      const normalizedScore = (rawScore / dimension.maxScore) * dimension.targetScore;
      const percentage = rawScore / dimension.maxScore;

      return {
        dimensionId: dimension.id,
        dimensionName: dimension.name,
        shortName: dimension.shortName,
        rawScore,
        maxScore: dimension.maxScore,
        targetScore: dimension.targetScore,
        normalizedScore: parseFloat(normalizedScore.toFixed(2)),
        percentage: parseFloat(percentage.toFixed(4)),
      };
    });

    // 3. 计算总分和平均分
    const totalRawScore = dimensions.reduce((sum, d) => sum + d.rawScore, 0);
    const totalMaxScore = dimensions.reduce((sum, d) => sum + d.maxScore, 0);
    const averageScore = dimensions.reduce((sum, d) => sum + d.normalizedScore, 0) / dimensions.length;

    return {
      dimensions,
      averageScore: parseFloat(averageScore.toFixed(2)),
      totalRawScore,
      totalMaxScore,
    };
  }
}

