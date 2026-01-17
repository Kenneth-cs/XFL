/**
 * 九型人格匹配计算工具
 * 参考文档: 九型人格匹配规则说明.md
 */

// 九型人格类型标签
export const ENNEAGRAM_LABELS: Record<number, string> = {
  1: '完美型',
  2: '助人型',
  3: '成就型',
  4: '艺术型',
  5: '智慧型',
  6: '忠诚型',
  7: '活跃型',
  8: '领袖型',
  9: '和平型',
}

// 导出别名，兼容其他模块调用
export const ENNEAGRAM_TYPE_NAMES = ENNEAGRAM_LABELS;

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
]

export interface EnneagramMatchResult {
  // 排序后的用户9个人格类型及百分比
  sortedTypes: Array<{ type: number; label: string; percentage: number }>
  // Top3 类型
  top3: number[]
  // 可匹配的异性类型 (排序后)
  matchedTypes: Array<{
    type: number
    label: string
    score: number
    priority: string // 优先级文案
  }>
  // 不匹配的异性类型
  unmatchedTypes: Array<{ type: number; label: string }>
  // 结论文案
  conclusion: string
}

/**
 * 计算九型人格匹配结果
 * @param percentages - 用户9个类型的百分比数组 (索引0-8对应1-9号)
 * @param gender - 用户性别 ('男' | '女')
 * @returns 匹配结果
 */
export function calculateEnneagramMatch(
  percentages: Record<number, number>,
  gender: '男' | '女'
): EnneagramMatchResult {
  // 1. 排序9个类型 (从高到低)
  const sortedTypes = Object.entries(percentages)
    .map(([type, percentage]) => ({
      type: Number(type),
      label: ENNEAGRAM_LABELS[Number(type)],
      percentage: percentage,
    }))
    .sort((a, b) => b.percentage - a.percentage)

  // 2. 获取Top3
  const top3 = sortedTypes.slice(0, 3).map((t) => t.type)

  // 3. 计算可匹配的异性类型
  const oppositeGender = gender === '男' ? '女' : '男'
  const matchScores: Record<number, number> = {}

  // 初始化所有异性类型得分为0
  for (let i = 1; i <= 9; i++) {
    matchScores[i] = 0
  }

  // 遍历用户的Top3类型,累加匹配得分
  top3.forEach((userType) => {
    for (let oppositeType = 1; oppositeType <= 9; oppositeType++) {
      let score = 0
      if (gender === '男') {
        // 查男对女矩阵
        score = MALE_TO_FEMALE_MATRIX[userType - 1][oppositeType - 1]
      } else {
        // 查女对男矩阵 (即男对女矩阵的转置)
        score = MALE_TO_FEMALE_MATRIX[oppositeType - 1][userType - 1]
      }
      matchScores[oppositeType] += score
    }
  })

  // 4. 分类:可匹配(>=0) vs 不匹配(<0)
  const matchedTypes: Array<{
    type: number
    label: string
    score: number
    priority: string
  }> = []
  const unmatchedTypes: Array<{ type: number; label: string }> = []

  Object.entries(matchScores).forEach(([type, score]) => {
    const typeNum = Number(type)
    const label = ENNEAGRAM_LABELS[typeNum]
    if (score < 0) {
      unmatchedTypes.push({ type: typeNum, label })
    } else {
      let priority = ''
      if (score >= 3) priority = '★★★ 最优'
      else if (score === 2) priority = '★★ 优先'
      else if (score === 1) priority = '★ 适合'
      else priority = '一般'
      matchedTypes.push({ type: typeNum, label, score, priority })
    }
  })

  // 5. 按得分从高到低排序
  matchedTypes.sort((a, b) => b.score - a.score)

  // 6. 生成结论文案
  const matchedLabels = matchedTypes.map((m) => `${oppositeGender}${m.type}号(${m.label})`).join('、')
  const unmatchedLabels = unmatchedTypes.map((m) => `${oppositeGender}${m.type}号(${m.label})`).join('、')

  let conclusion = `该用户适合的${oppositeGender}性性格包含: ${matchedLabels || '无'}。`
  if (unmatchedTypes.length > 0) {
    conclusion += `\n完全不适合的是: ${unmatchedLabels} (有减分项作为必要互斥项绝对不可匹配)。`
  }

  return {
    sortedTypes,
    top3,
    matchedTypes,
    unmatchedTypes,
    conclusion,
  }
}

