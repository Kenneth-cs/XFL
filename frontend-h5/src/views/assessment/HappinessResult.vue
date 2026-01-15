<template>
  <div class="happiness-result">
    <div class="result-header">
      <h2>婚恋幸福力测评报告</h2>
      <p>20维度全方位评估</p>
    </div>

    <div class="result-content" v-if="result">
      <!-- 总分卡片 -->
      <div class="summary-card">
        <div class="score-circle">
          <div class="score-num">{{ result.averageScore?.toFixed(1) || 0 }}</div>
          <div class="score-label">综合得分</div>
        </div>
        <p class="score-desc">{{ getOverallDesc(result.averageScore) }}</p>
      </div>

      <!-- 20维度得分列表 -->
      <div class="dimensions-card">
        <h3 class="section-title">20维度详细得分</h3>
        <div class="dimensions-list">
          <div 
            v-for="dim in result.dimensions" 
            :key="dim.dimensionId"
            class="dimension-item"
          >
            <div class="dim-header">
              <span class="dim-name">{{ dim.dimensionName || `维度${dim.dimensionId}` }}</span>
              <span class="dim-score">{{ dim.normalizedScore?.toFixed(1) || 0 }}/10</span>
            </div>
            <van-progress 
              :percentage="(dim.normalizedScore / 10) * 100" 
              stroke-width="6"
              :pivot-text="``"
              :color="getScoreColor(dim.normalizedScore)"
              class="dim-progress"
            />
          </div>
        </div>
      </div>

      <!-- 优势与待提升 -->
      <div class="insights-card">
        <h3 class="section-title">洞察分析</h3>
        
        <div class="insight-section">
          <div class="insight-title">
            <van-icon name="star" color="#ff9a9e" />
            <span>优势维度 (Top 5)</span>
          </div>
          <div class="insight-list">
            <div 
              v-for="dim in topDimensions" 
              :key="dim.dimensionId"
              class="insight-item strength"
            >
              <span class="item-name">{{ dim.dimensionName }}</span>
              <span class="item-score">{{ dim.normalizedScore?.toFixed(1) }}</span>
            </div>
          </div>
        </div>

        <div class="insight-section">
          <div class="insight-title">
            <van-icon name="warning" color="#ffa940" />
            <span>待提升维度 (Bottom 5)</span>
          </div>
          <div class="insight-list">
            <div 
              v-for="dim in bottomDimensions" 
              :key="dim.dimensionId"
              class="insight-item weakness"
            >
              <span class="item-name">{{ dim.dimensionName }}</span>
              <span class="item-score">{{ dim.normalizedScore?.toFixed(1) }}</span>
            </div>
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const result = ref<any>(null)

const getOverallDesc = (score: number) => {
  if (score >= 8) return '优秀！您的婚恋幸福力综合水平很高，拥有健康成熟的情感能力'
  if (score >= 6) return '良好！您的婚恋幸福力处于中上水平，部分维度可进一步提升'
  if (score >= 4) return '中等，您的婚恋幸福力还有较大提升空间，建议重点关注薄弱维度'
  return '需要努力提升，建议系统性地学习和成长，必要时寻求专业帮助'
}

const getScoreColor = (score: number) => {
  if (score >= 8) return '#52c41a'
  if (score >= 6) return '#84fab0'
  if (score >= 4) return '#ffa940'
  return '#ff4d4f'
}

// Top 5 和 Bottom 5 维度
const topDimensions = computed(() => {
  if (!result.value?.dimensions) return []
  return [...result.value.dimensions]
    .sort((a, b) => b.normalizedScore - a.normalizedScore)
    .slice(0, 5)
})

const bottomDimensions = computed(() => {
  if (!result.value?.dimensions) return []
  return [...result.value.dimensions]
    .sort((a, b) => a.normalizedScore - b.normalizedScore)
    .slice(0, 5)
})

const backToCenter = () => {
  router.push('/assessment')
}

const retakeTest = () => {
  router.push('/assessment/happiness')
}

onMounted(async () => {
  const state = history.state as any
  if (state?.result) {
    result.value = state.result
  } else {
    // 如果没有结果数据，从后端获取最新结果
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
      } else {
        console.warn('未找到婚恋幸福力测评记录')
        setTimeout(() => {
          router.push('/assessment')
        }, 1500)
      }
    } catch (error) {
      console.error('获取测评结果失败', error)
      setTimeout(() => {
        router.push('/assessment')
      }, 1500)
    }
  }
})
</script>

<style scoped>
.happiness-result {
  min-height: 100vh;
  background: linear-gradient(135deg, #fffcf5 0%, #fff0f0 100%);
  padding: 20px;
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
  opacity: 1;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.score-circle {
  margin-bottom: 16px;
}

.score-num {
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.score-label {
  font-size: 14px;
  color: #999;
  margin-top: 8px;
}

.score-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.dimensions-card,
.insights-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.dimensions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dimension-item {
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.dimension-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.dim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.dim-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.dim-score {
  font-size: 16px;
  font-weight: bold;
  color: #52c41a;
}

.dim-progress {
  margin-top: 8px;
}

.insight-section {
  margin-bottom: 24px;
}

.insight-section:last-child {
  margin-bottom: 0;
}

.insight-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.insight-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
}

.insight-item.strength {
  background: #f6ffed;
  border-left: 3px solid #52c41a;
}

.insight-item.weakness {
  background: #fff7e6;
  border-left: 3px solid #ffa940;
}

.item-name {
  font-size: 14px;
  color: #333;
}

.item-score {
  font-size: 14px;
  font-weight: bold;
  color: #666;
}

.action-buttons {
  margin-top: 12px;
}
</style>

