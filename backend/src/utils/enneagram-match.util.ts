/**
 * 九型人格匹配工具
 * 用于计算可匹配的异性人格数量（女性MV值"性格"维度计算）
 * 参考文档: 匹配相关/九型人格匹配规则说明.md
 */

// 九型人格匹配矩阵
// 行索引: 男性类型 (1-9), 列索引: 女性类型 (1-9)
// 返回值: +1 合适, 0 一般, -1 不合适
// 参考: 图片中列出的14组不匹配组合（男女同理）
const MALE_TO_FEMALE_MATRIX: number[][] = [
  // 女1  女2  女3  女4  女5  女6  女7  女8  女9
  [0, 0, 1, 0, 1, 0, -1, 1, 1], // 男1  -> 1-7不匹配
  [0, 0, 0, 1, 1, 1, 0, 1, -1], // 男2  -> 2-9不匹配
  [1, 0, 0, 0, 0, -1, 1, 1, 1], // 男3  -> 3-6不匹配
  [0, 1, 0, -1, 1, 1, 1, -1, 1], // 男4  -> 4-4不匹配, 4-8不匹配
  [1, 1, 0, 1, 1, 0, 0, 1, -1], // 男5  -> 5-9不匹配
  [0, 1, -1, 1, 0, 1, 0, -1, 1], // 男6  -> 6-3不匹配, 6-8不匹配
  [-1, 0, 0, 1, 0, 0, 0, 0, 1], // 男7  -> 7-1不匹配
  [1, 1, 1, -1, 1, -1, 0, -1, 1], // 男8  -> 8-4不匹配, 8-6不匹配, 8-8不匹配
  [1, -1, 1, 1, -1, 1, 1, 0, 0], // 男9  -> 9-2不匹配, 9-5不匹配
];

// 女性到男性的匹配矩阵 (MALE_TO_FEMALE_MATRIX的转置)
const FEMALE_TO_MALE_MATRIX: number[][] = [
  // 男1  男2  男3  男4  男5  男6  男7  男8  男9
  [0, 0, 1, 0, 1, 0, -1, 1, 1], // 女1  -> 1-7不匹配
  [0, 0, 0, 1, 1, 1, 0, 1, -1], // 女2  -> 2-9不匹配
  [1, 0, 0, 0, 0, -1, 0, 1, 1], // 女3  -> 3-6不匹配
  [0, 1, 0, -1, 1, 1, 1, -1, 1], // 女4  -> 4-4不匹配, 4-8不匹配
  [1, 1, 0, 1, 1, 0, 0, 1, -1], // 女5  -> 5-9不匹配
  [0, 1, -1, 1, 0, 1, 0, -1, 1], // 女6  -> 6-3不匹配, 6-8不匹配
  [-1, 0, 1, 1, 0, 0, 0, 0, 1], // 女7  -> 7-1不匹配
  [1, 1, 1, -1, 1, -1, 0, -1, 0], // 女8  -> 8-4不匹配, 8-6不匹配, 8-8不匹配
  [1, -1, 1, 1, -1, 1, 1, 1, 0], // 女9  -> 9-2不匹配, 9-5不匹配
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

/**
 * 检查两个用户的九型人格是否匹配
 * @param initiatorTypes - 发起方Top3人格
 * @param initiatorGender - 发起方性别
 * @param candidateTypes - 候选方Top3人格
 * @returns { isPass: boolean, overlapCount: number }
 */
export function checkEnneagramMatch(
  initiatorTypes: number[],
  initiatorGender: '男' | '女',
  candidateTypes: number[],
): { isPass: boolean; overlapCount: number } {
  // 确定使用的矩阵：行是发起方，列是候选方
  // 如果发起方是男，用 MALE_TO_FEMALE_MATRIX (行男列女)
  // 如果发起方是女，用 FEMALE_TO_MALE_MATRIX (行女列男)
  const matrix = initiatorGender === '男' ? MALE_TO_FEMALE_MATRIX : FEMALE_TO_MALE_MATRIX;

  let isPass = true;
  let overlapCount = 0;

  // 遍历发起方的 Top3
  for (const iType of initiatorTypes) {
    if (iType < 1 || iType > 9) continue;

    // 遍历候选方的 Top3
    for (const cType of candidateTypes) {
      if (cType < 1 || cType > 9) continue;

      const score = matrix[iType - 1][cType - 1];

      // 一票否决：如果有 -1 分，直接不匹配
      if (score === -1) {
        isPass = false;
        break;
      }

      // 统计重合度：如果有 +1 分，计数加1
      if (score === 1) {
        overlapCount++;
      }
    }
    if (!isPass) break;
  }

  return { isPass, overlapCount };
}

