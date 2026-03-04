<template>
  <div class="happiness-result">
    <div class="result-header">
      <h2>婚恋幸福力评测结果</h2>
      <p>20维度全方位评估</p>
    </div>

    <div class="result-content" v-if="result">
      <!-- 图表区域 -->
      <div class="charts-container">
        <!-- 用户得分图 -->
        <div class="chart-wrapper">
          <h3 class="chart-title">我的测试结果</h3>
          <div ref="userChartRef" class="chart-box"></div>
        </div>
        
        <!-- 满分图例 -->
        <div class="chart-wrapper">
          <h3 class="chart-title">满分图例参考</h3>
          <div ref="fullChartRef" class="chart-box"></div>
        </div>
      </div>

      <!-- 文字分析 -->
      <div class="analysis-card">
        <h3 class="section-title">详细分析</h3>
        
        <div v-if="highScoreText" class="analysis-section">
          <div class="analysis-icon good">👍</div>
          <p class="analysis-text">{{ highScoreText }}</p>
        </div>
        
        <div v-if="lowScoreText" class="analysis-section">
          <div class="analysis-icon improve">💪</div>
          <p class="analysis-text">{{ lowScoreText }}</p>
        </div>

        <div v-if="!highScoreText && !lowScoreText" class="analysis-section">
          <p class="analysis-text">您的各项指标比较均衡，继续保持！</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button 
          type="primary" 
          size="large" 
          block
          @click="backToCenter"
        >
          返回测评中心
        </van-button>
        <van-button 
          plain 
          type="primary" 
          size="large" 
          block
          @click="retakeTest"
          style="margin-top: 12px;"
        >
          重新测评
        </van-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <van-loading v-else size="32" vertical>加载中...</van-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'

const router = useRouter()
const result = ref<any>(null)
const userChartRef = ref<HTMLElement | null>(null)
const fullChartRef = ref<HTMLElement | null>(null)
let userChart: echarts.ECharts | null = null
let fullChart: echarts.ECharts | null = null

const highScoreText = ref('')
const lowScoreText = ref('')

// 维度配置 (严格按照文档顺序和颜色)
const DIMENSIONS = [
  { id: 1, name: '积极性格', outer: '乐商', color: '#00BFFF', light: '#CCF2FF' }, // 鲜蓝色
  { id: 2, name: '积极情绪', outer: '情商', color: '#9370DB', light: '#E6E6FA' }, // 紫色
  { id: 3, name: '积极心态', outer: '心商', color: '#FF4500', light: '#FFD1C1' }, // 橙红色
  { id: 4, name: '积极力量', outer: '施融', color: '#32CD32', light: '#D6F5D6' }, // 绿色
  { id: 5, name: '积极语言', outer: '语商', color: '#87CEEB', light: '#E7F7FF' }, // 天蓝色
  { id: 6, name: '积极沟通', outer: '施语', color: '#20B2AA', light: '#D2F0EE' }, // 蓝绿色
  { id: 7, name: '积极教育', outer: '素质', color: '#9370DB', light: '#E6E6FA' }, // 紫色
  { id: 8, name: '积极教养', outer: '管教', color: '#228B22', light: '#D3E8D3' }, // 深绿色
  { id: 9, name: '积极习惯', outer: '自律', color: '#00BFFF', light: '#CCF2FF' }, // 鲜蓝色
  { id: 10, name: '积极天赋', outer: '优势', color: '#DAA520', light: '#F7ECD2' }, // 土黄色
  { id: 11, name: '积极自尊', outer: '修养', color: '#FF4500', light: '#FFD1C1' }, // 橙红色
  { id: 12, name: '积极关系', outer: '爱商', color: '#32CD32', light: '#D6F5D6' }, // 绿色
  { id: 13, name: '积极改变', outer: '勇气', color: '#FF1493', light: '#FFD0E9' }, // 玫红色
  { id: 14, name: '积极信念', outer: '希望', color: '#7B68EE', light: '#E5E0FA' }, // 灰紫色
  { id: 15, name: '积极体验', outer: '福流', color: '#9370DB', light: '#E6E6FA' }, // 紫色
  { id: 16, name: '积极品质', outer: '福商', color: '#228B22', light: '#D3E8D3' }, // 深绿色
  { id: 17, name: '积极投入', outer: '志商', color: '#FF1493', light: '#FFD0E9' }, // 玫红色
  { id: 18, name: '积极自我', outer: '德商', color: '#DAA520', light: '#F7ECD2' }, // 土黄色
  { id: 19, name: '积极目标', outer: '财商', color: '#FFA500', light: '#FFEDCC' }, // 橙色
  { id: 20, name: '积极意义', outer: '健商', color: '#228B22', light: '#D3E8D3' }, // 深绿色
]

const initCharts = () => {
  if (!result.value || !userChartRef.value || !fullChartRef.value) return

  // 准备数据
  // 映射后端返回的维度数据到配置顺序
  const scoreMap = new Map()
  result.value.dimensions.forEach((d: any) => {
    // 尝试通过 ID 或 名称匹配 (这里假设 dimensionId 对应 1-20)
    scoreMap.set(d.dimensionId, d.normalizedScore || 0)
  })

  // 构建图表数据
  const data = DIMENSIONS.map(dim => {
    const score = scoreMap.get(dim.id) || 0
    return {
      value: score,
      name: dim.name,
      itemStyle: { color: dim.color },
      outerColor: dim.light,
      outerLabel: dim.outer
    }
  })

  // 生成文字分析
  generateAnalysis(data)

  // 渲染用户图表
  renderChart(userChartRef.value, data, false)
  
  // 渲染满分图表
  const fullData = data.map(d => ({ ...d, value: 10 }))
  renderChart(fullChartRef.value, fullData, true)
}

const renderChart = (dom: HTMLElement, data: any[], isFull: boolean) => {
  const chart = echarts.init(dom)
  if (isFull) fullChart = chart
  else userChart = chart

  const option = {
    title: {
      text: '幸福力',
      left: 'center',
      top: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
      },
      backgroundColor: '#FF7D40', // 橙色中心圆
      borderRadius: 30,
      padding: [15, 15] // 调整内圆大小
    },
    polar: {
      radius: ['20%', '90%'] // 内半径留空给标题，外半径限制
    },
    angleAxis: {
      type: 'category',
      data: data.map(d => d.name),
      startAngle: 90,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false } // 不显示角度轴标签，太拥挤
    },
    radiusAxis: {
      min: 0,
      max: 12.5, // 10分 + 2.5分外圈
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false } // 不显示分隔线，为了模拟实线分割效果，我们用 bar gap
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
        z: 2
      },
      // 2. 空白填充 (填满到 10 分)
      {
        type: 'bar',
        data: data.map(d => ({
          value: 10 - d.value,
          itemStyle: { 
            color: '#f9f9f9', // 淡灰色背景，显示未得分区域
            borderColor: '#e8e8e8', // 边界线
            borderWidth: 1
          } 
        })),
        coordinateSystem: 'polar',
        stack: 'a',
        z: 1
      },
      // 3. 外圈 (第 5 格)
      {
        type: 'bar',
        data: data.map(d => ({
          value: 2.5, // 固定宽度
          itemStyle: { color: d.outerColor },
          label: {
            show: true,
            position: 'middle', // 尝试显示在外圈中间
            formatter: d.outerLabel,
            fontSize: 10,
            color: '#333',
            rotate: 0 // 不旋转文字
          }
        })),
        coordinateSystem: 'polar',
        stack: 'a',
        z: 3,
        barGap: '0%' // 紧贴
      }
    ]
  }

  // 调整外圈文字显示（ECharts Polar Bar label 旋转很难控制，这里简化处理，尽量显示）
  // 为了更好的分割线效果，可以添加 separate series
  
  chart.setOption(option)
}

const generateAnalysis = (data: any[]) => {
  const highScores = data.filter(d => d.value > 6 && d.value < 10).map(d => d.name)
  const lowScores = data.filter(d => d.value <= 6).map(d => d.name)

  if (highScores.length > 0) {
    highScoreText.value = `您在（${highScores.join('、')}）等幸福力模块分值高于6分但低于10分，学习相关的婚恋幸福力课程能让你的幸福感拉满！详细可咨询服务红娘！`
  }
  
  if (lowScores.length > 0) {
    lowScoreText.value = `您在（${lowScores.join('、')}）等幸福力模块分值低于6分，建议进行相关的婚恋幸福力课程学习！详细可咨询服务红娘！`
  }
}

const backToCenter = () => {
  router.push('/assessment')
}

const retakeTest = () => {
  router.push('/assessment/happiness')
}

// 响应式调整
window.addEventListener('resize', () => {
  userChart?.resize()
  fullChart?.resize()
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    userChart?.resize()
    fullChart?.resize()
  })
})

onMounted(async () => {
  const state = history.state as any
  if (state?.result) {
    result.value = state.result
    nextTick(() => initCharts())
  } else {
    // 从后端获取
    try {
      const userStore = useUserStore()
      if (!userStore.userInfo?.id) {
        router.push('/assessment')
        return
      }
      const { getLatestResults } = await import('@/api/assessment')
      const res: any = await getLatestResults(userStore.userInfo.id)
      if (res?.happiness?.result) {
        result.value = res.happiness.result
        nextTick(() => initCharts())
      } else {
        setTimeout(() => router.push('/assessment'), 1500)
      }
    } catch (error) {
      console.error(error)
      setTimeout(() => router.push('/assessment'), 1500)
    }
  }
})
</script>

<style scoped>
.happiness-result {
  min-height: 100vh;
  background: #FFF7E6;
  padding: 20px;
  padding-bottom: 40px;
}

.result-header {
  text-align: center;
  color: #5d4037;
  margin-bottom: 24px;
}

.result-header h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.result-header p {
  font-size: 14px;
  color: #888;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 24px;
}

/* 大屏适配：并排显示 */
@media (min-width: 768px) {
  .charts-container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .chart-wrapper {
    width: 45%;
    max-width: 400px;
  }
}

.chart-wrapper {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.chart-box {
  width: 600px;
  height: 600px;
  max-width: 100%; /* 确保在小屏幕上不溢出 */
}

/* 移动端适配：小屏幕时适当缩小 */
@media (max-width: 768px) {
  .chart-box {
    width: 450px;
    height: 450px;
  }
}

@media (max-width: 480px) {
  .chart-box {
    width: 350px;
    height: 350px;
  }
}

.analysis-card {
  background: #fdfdfd;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #eee;
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.analysis-section {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.analysis-section:last-child {
  margin-bottom: 0;
}

.analysis-icon {
  font-size: 20px;
  line-height: 1.5;
}

.analysis-text {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  text-align: justify;
}

.action-buttons {
  margin-top: 12px;
}
</style>

