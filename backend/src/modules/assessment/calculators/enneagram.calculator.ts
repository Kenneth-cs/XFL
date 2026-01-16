import { Injectable } from '@nestjs/common';
import { ENNEAGRAM_QUESTIONS } from '../../../constants/questions/enneagram';
import {
  calculateMatchableOppositeCount,
  getMatchableOppositeTypes,
} from '../../../utils/enneagram-match.util';

/**
 * 九型人格计算结果
 */
export interface EnneagramResult {
  top3: number[]; // Top 3 人格类型
  percentages: Record<number, number>; // 各人格类型百分比 {1: 0.85, 2: 0.72, ...}
  rawScores: Record<number, number>; // 各人格类型原始得分
  primaryType: number; // 主导人格类型
  matchableOppositeTypes?: number[]; // 可匹配的异性类型列表 (用于展示)
  matchableOppositeCount?: number; // 可匹配的异性类型数量 (用于女性MV值计算)
}

/**
 * 九型人格计算器
 */
@Injectable()
export class EnneagramCalculator {
  /**
   * 计算九型人格测评结果
   * @param answers 用户答案数组 [{questionId: 1, selectedType: 5}, ...]
   * @param userGender 用户性别 ('男' | '女') - 可选，用于计算可匹配异性数量
   */
  calculate(
    answers: Array<{ questionId: number; selectedType: number }>,
    userGender?: '男' | '女',
  ): EnneagramResult {
    // 1. 统计每个人格类型的实际得分
    const rawScores: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
    };

    answers.forEach((answer) => {
      const { selectedType } = answer;
      if (selectedType >= 1 && selectedType <= 9) {
        rawScores[selectedType] += 1;
      }
    });

    // 2. 计算每个人格类型的标准满分（每个类型出现的最大次数）
    const maxScores: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
    };

    ENNEAGRAM_QUESTIONS.forEach((question) => {
      question.options.forEach((option) => {
        if (option.type >= 1 && option.type <= 9) {
          maxScores[option.type] += 1;
        }
      });
    });

    // 3. 计算百分比 = 实际得分 / 标准满分
    const percentages: Record<number, number> = {};
    for (let type = 1; type <= 9; type++) {
      if (maxScores[type] > 0) {
        percentages[type] = parseFloat((rawScores[type] / maxScores[type]).toFixed(4));
      } else {
        percentages[type] = 0;
      }
    }

    // 4. 按百分比降序排序，获取 Top 3
    const sortedTypes = Object.entries(percentages)
      .sort(([, a], [, b]) => b - a)
      .map(([type]) => parseInt(type));

    // 5. 有效阈值筛选：(最高分 - 15%) 作为阈值
    const highestPercentage = percentages[sortedTypes[0]];
    const threshold = highestPercentage - 0.15;

    // 过滤出高于阈值的人格类型，但至少保留 3 个
    const qualifiedTypes = sortedTypes.filter((type) => percentages[type] >= threshold);
    const top3 = qualifiedTypes.length >= 3 ? qualifiedTypes.slice(0, 3) : sortedTypes.slice(0, 3);

    // 6. 如果提供了性别，计算可匹配的异性类型数量（用于女性MV值计算）
    let matchableOppositeTypes: number[] | undefined;
    let matchableOppositeCount: number | undefined;

    if (userGender) {
      matchableOppositeTypes = getMatchableOppositeTypes(top3, userGender);
      matchableOppositeCount = matchableOppositeTypes.length;
    }

    return {
      top3,
      percentages,
      rawScores,
      primaryType: top3[0],
      matchableOppositeTypes,
      matchableOppositeCount,
    };
  }
}

