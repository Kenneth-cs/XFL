/**
 * 九型人格匹配工具
 * 用于计算可匹配的异性人格数量（女性MV值"性格"维度计算）
 * 参考文档: 匹配相关/九型人格匹配规则说明.md
 */

// 九型人格匹配矩阵
// 行索引: 男性类型 (1-9), 列索引: 女性类型 (1-9)
// 返回值: +1 合适, 0 一般, -1 不合适
const MALE_TO_FEMALE_MATRIX: number[][] = [
  // 女1  女2  女3  女4  女5  女6  女7  女8  女9
  [0, 0, 1, 0, 1, 0, -1, 1, 1], // 男1
  [0, 0, 0, 1, 1, 1, 0, 1, 0], // 男2
  [1, 0, 0, 0, 0, -1, 1, 1, 1], // 男3
  [0, 1, 0, 0, 1, 1, 1, 0, 1], // 男4
  [1, 1, 0, 1, 1, 0, 0, 1, 0], // 男5
  [0, 1, 0, 1, 0, 1, 0, 0, 1], // 男6
  [0, 0, 0, 1, 0, 0, 0, 0, 1], // 男7
  [1, 1, 1, 0, 1, 0, 0, 0, 1], // 男8
  [1, 0, 1, 1, 0, 1, 1, 0, 0], // 男9
];

// 女性到男性的匹配矩阵 (MALE_TO_FEMALE_MATRIX的转置)
const FEMALE_TO_MALE_MATRIX: number[][] = [
  // 男1  男2  男3  男4  男5  男6  男7  男8  男9
  [0, 0, 1, 0, 1, 0, 0, 1, 1], // 女1
  [0, 0, 0, 1, 1, 1, 0, 1, 0], // 女2
  [1, 0, 0, 0, 0, 0, 0, 1, 1], // 女3
  [0, 1, 0, 0, 1, 1, 1, 0, 1], // 女4
  [1, 1, 0, 1, 1, 0, 0, 1, 0], // 女5
  [0, 1, -1, 1, 0, 1, 0, 0, 1], // 女6
  [-1, 0, 1, 1, 0, 0, 0, 0, 1], // 女7
  [1, 1, 1, 0, 1, 0, 0, 0, 1], // 女8
  [1, 0, 1, 1, 0, 1, 1, 1, 0], // 女9
];

/**
 * 计算可匹配的异性人格类型数量
 * @param userTypes - 用户的Top3人格类型 [9, 1, 2]
 * @param userGender - 用户性别 '男' | '女'
 * @returns 可匹配的异性人格数量（1-9）
 */
export function calculateMatchableOppositeCount(
  userTypes: number[],
  userGender: '男' | '女',
): number {
  const matrix = userGender === '男' ? MALE_TO_FEMALE_MATRIX : FEMALE_TO_MALE_MATRIX;

  // 统计每个异性类型的总分
  const oppositeScores: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  // 遍历用户的Top3人格
  userTypes.forEach((userType) => {
    if (userType < 1 || userType > 9) return;

    // 遍历9个异性类型
    for (let oppositeType = 1; oppositeType <= 9; oppositeType++) {
      const score = matrix[userType - 1][oppositeType - 1];
      oppositeScores[oppositeType] += score;
    }
  });

  // 统计得分 > 0 的异性类型数量（即有+1匹配的）
  let matchableCount = 0;
  for (let type = 1; type <= 9; type++) {
    if (oppositeScores[type] > 0) {
      matchableCount++;
    }
  }

  return matchableCount;
}

/**
 * 获取可匹配的异性人格类型列表（用于展示）
 * @param userTypes - 用户的Top3人格类型
 * @param userGender - 用户性别
 * @returns 可匹配的异性类型数组 [1, 3, 5, ...]
 */
export function getMatchableOppositeTypes(
  userTypes: number[],
  userGender: '男' | '女',
): number[] {
  const matrix = userGender === '男' ? MALE_TO_FEMALE_MATRIX : FEMALE_TO_MALE_MATRIX;

  const oppositeScores: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  userTypes.forEach((userType) => {
    if (userType < 1 || userType > 9) return;

    for (let oppositeType = 1; oppositeType <= 9; oppositeType++) {
      const score = matrix[userType - 1][oppositeType - 1];
      oppositeScores[oppositeType] += score;
    }
  });

  // 返回得分 > 0 的类型，并按得分降序排序
  return Object.entries(oppositeScores)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([type]) => parseInt(type));
}

