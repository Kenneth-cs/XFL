/**
 * 幸福力维度配置
 * 参考文档: 需求开发功能确定文档.md (105-114), PRD_幸福力项目_v1.0.md (94-101)
 * 20个维度，严格按照文档顺序和颜色配置
 */

export interface HappinessDimension {
  id: number
  name: string      // 内圈名称，如"积极性格"
  outer: string     // 外圈标签，如"乐商"
  color: string     // 主色（填充色）
  light: string     // 浅色（外圈背景色）
}

/**
 * 20个幸福力维度配置
 * 严格按照文档定义的顺序和颜色
 */
export const HAPPINESS_DIMENSIONS: HappinessDimension[] = [
  { id: 1, name: '积极性格', outer: '乐商', color: '#00BFFF', light: '#CCF2FF' },   // 鲜蓝色
  { id: 2, name: '积极情绪', outer: '情商', color: '#9370DB', light: '#E6E6FA' },   // 紫色
  { id: 3, name: '积极心态', outer: '心商', color: '#FF4500', light: '#FFD1C1' },   // 橙红色
  { id: 4, name: '积极力量', outer: '施融', color: '#32CD32', light: '#D6F5D6' },   // 绿色
  { id: 5, name: '积极语言', outer: '语商', color: '#87CEEB', light: '#E7F7FF' },   // 天蓝色
  { id: 6, name: '积极沟通', outer: '施语', color: '#20B2AA', light: '#D2F0EE' },   // 蓝绿色
  { id: 7, name: '积极教育', outer: '素质', color: '#9370DB', light: '#E6E6FA' },   // 紫色
  { id: 8, name: '积极教养', outer: '管教', color: '#228B22', light: '#D3E8D3' },   // 深绿色
  { id: 9, name: '积极习惯', outer: '自律', color: '#00BFFF', light: '#CCF2FF' },   // 鲜蓝色
  { id: 10, name: '积极天赋', outer: '优势', color: '#DAA520', light: '#F7ECD2' },  // 土黄色
  { id: 11, name: '积极自尊', outer: '修养', color: '#FF4500', light: '#FFD1C1' },  // 橙红色
  { id: 12, name: '积极关系', outer: '爱商', color: '#32CD32', light: '#D6F5D6' },  // 绿色
  { id: 13, name: '积极改变', outer: '勇气', color: '#FF1493', light: '#FFD0E9' },  // 玫红色
  { id: 14, name: '积极信念', outer: '希望', color: '#7B68EE', light: '#E5E0FA' },  // 灰紫色
  { id: 15, name: '积极体验', outer: '福流', color: '#9370DB', light: '#E6E6FA' },  // 紫色
  { id: 16, name: '积极品质', outer: '福商', color: '#228B22', light: '#D3E8D3' },  // 深绿色
  { id: 17, name: '积极投入', outer: '志商', color: '#FF1493', light: '#FFD0E9' },  // 玫红色
  { id: 18, name: '积极自我', outer: '德商', color: '#DAA520', light: '#F7ECD2' },  // 土黄色
  { id: 19, name: '积极目标', outer: '财商', color: '#FFA500', light: '#FFEDCC' },  // 橙色
  { id: 20, name: '积极意义', outer: '健商', color: '#228B22', light: '#D3E8D3' },  // 深绿色
]

/**
 * 生成文字分析
 * @param dimensions - 维度得分数据 [{dimensionId, normalizedScore}, ...]
 * @returns 分析文本对象
 */
export interface HappinessAnalysis {
  highScoreText: string  // 6-10分模块的文字
  lowScoreText: string   // <=6分模块的文字
}

export function generateHappinessAnalysis(dimensions: any[]): HappinessAnalysis {
  // 构建得分映射
  const scoreMap = new Map<number, number>()
  dimensions.forEach((d: any) => {
    scoreMap.set(d.dimensionId, d.normalizedScore || 0)
  })

  // 匹配维度名称
  const highScores: string[] = []
  const lowScores: string[] = []

  HAPPINESS_DIMENSIONS.forEach(dim => {
    const score = scoreMap.get(dim.id) || 0
    if (score > 6 && score < 10) {
      highScores.push(dim.name)
    } else if (score <= 6) {
      lowScores.push(dim.name)
    }
  })

  const highScoreText = highScores.length > 0
    ? `您在（${highScores.join('、')}）等幸福力模块分值高于6分但低于10分，学习相关的婚恋幸福力课程能让你的幸福感拉满！详细可咨询服务红娘！`
    : ''

  const lowScoreText = lowScores.length > 0
    ? `您在（${lowScores.join('、')}）等幸福力模块分值低于6分，建议进行相关的婚恋幸福力课程学习！详细可咨询服务红娘！`
    : ''

  return { highScoreText, lowScoreText }
}

/**
 * 获取ECharts极坐标图配置选项
 * @param dimensions - 维度得分数据
 * @param isFull - 是否为满分图例
 * @returns ECharts option
 */
export function getHappinessChartOption(dimensions: any[], isFull: boolean = false) {
  // 构建得分映射
  const scoreMap = new Map<number, number>()
  dimensions.forEach((d: any) => {
    scoreMap.set(d.dimensionId, d.normalizedScore || 0)
  })

  // 构建图表数据
  const data = HAPPINESS_DIMENSIONS.map(dim => {
    const score = isFull ? 10 : (scoreMap.get(dim.id) || 0)
    return {
      value: score,
      name: dim.name,
      itemStyle: { color: dim.color },
      outerColor: dim.light,
      outerLabel: dim.outer
    }
  })

  return {
    title: {
      text: '幸福力',
      left: 'center',
      top: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
      },
      backgroundColor: '#f56c6c', // 红色中心圆
      borderRadius: 40,
      padding: [20, 20]
    },
    polar: {
      radius: ['22%', '85%'] // 内半径留空给标题，外半径限制
    },
    angleAxis: {
      type: 'category',
      data: data.map(d => d.name),
      startAngle: 90,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false }
    },
    radiusAxis: {
      min: 0,
      max: 12.5, // 10分 + 2.5分外圈
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    series: [
      // 1. 用户得分 (内圈 1-4 格)
      {
        type: 'bar',
        data: data.map(d => ({
          value: d.value,
          itemStyle: { color: d.itemStyle.color }
        })),
        coordinateSystem: 'polar',
        stack: 'a',
        z: 2,
        barGap: '0%'
      },
      // 2. 空白填充 (填满到 10 分)
      {
        type: 'bar',
        data: data.map(d => ({
          value: 10 - d.value,
          itemStyle: { color: 'transparent' }
        })),
        coordinateSystem: 'polar',
        stack: 'a',
        z: 1,
        barGap: '0%'
      },
      // 3. 外圈 (第 5 格)
      {
        type: 'bar',
        data: data.map(d => ({
          value: 2.5, // 固定宽度
          itemStyle: { color: d.outerColor },
          label: {
            show: true,
            position: 'middle',
            formatter: d.outerLabel,
            fontSize: 11,
            color: '#333',
            fontWeight: 'bold'
          }
        })),
        coordinateSystem: 'polar',
        stack: 'a',
        z: 3,
        barGap: '0%'
      }
    ]
  }
}

