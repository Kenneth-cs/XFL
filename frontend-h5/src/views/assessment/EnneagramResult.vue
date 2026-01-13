<template>
  <div class="enneagram-result">
    <div class="result-header">
      <h2>九型人格测评报告</h2>
      <p>基于144题深度测评</p>
    </div>

    <div class="result-content" v-if="result">
      <!-- 主人格卡片 -->
      <div class="primary-type-card">
        <div class="type-badge">{{ result.primaryType }}号人格</div>
        <h3 class="type-name">{{ getTypeName(result.primaryType) }}</h3>
        <p class="type-desc">{{ getTypeDescription(result.primaryType) }}</p>
        <div class="score-info">
          <span>匹配度：{{ (result.percentages[result.primaryType] || 0).toFixed(1) }}%</span>
        </div>
      </div>

      <!-- Top3人格 -->
      <div class="top3-section">
        <h3 class="section-title">你的核心人格特质 (Top 3)</h3>
        <div class="top3-list">
          <div 
            v-for="(typeNum, index) in result.top3" 
            :key="typeNum"
            class="top3-item"
          >
            <div class="rank">{{ index + 1 }}</div>
            <div class="type-info">
              <div class="type-label">{{ typeNum }}号 - {{ getTypeName(typeNum) }}</div>
              <van-progress 
                :percentage="result.percentages[typeNum] || 0" 
                stroke-width="6"
                :pivot-text="`${(result.percentages[typeNum] || 0).toFixed(1)}%`"
                color="linear-gradient(to right, #667eea, #764ba2)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 九型人格雷达图（文字版或简化版） -->
      <div class="all-scores-section">
        <h3 class="section-title">完整人格得分</h3>
        <div class="score-grid">
          <div 
            v-for="typeNum in [1,2,3,4,5,6,7,8,9]" 
            :key="typeNum"
            class="score-item"
            :class="{ 'highlight': result.top3.includes(typeNum) }"
          >
            <div class="score-type">{{ typeNum }}号</div>
            <div class="score-name">{{ getTypeName(typeNum) }}</div>
            <div class="score-value">{{ (result.percentages[typeNum] || 0).toFixed(1) }}%</div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const result = ref<any>(null)

// 九型人格名称映射
const typeNames: Record<number, string> = {
  1: '完美型',
  2: '助人型',
  3: '成就型',
  4: '艺术型',
  5: '智慧型',
  6: '忠诚型',
  7: '活跃型',
  8: '领袖型',
  9: '和平型'
}

// 人格描述（简化版）
const typeDescriptions: Record<number, string> = {
  1: '追求完美，有原则，自律性强，注重细节和标准',
  2: '热心助人，善解人意，重视人际关系和他人需求',
  3: '目标导向，高效务实，追求成功和他人认可',
  4: '感性浪漫，追求独特，重视内心体验和自我表达',
  5: '理性客观，善于观察，喜欢独处和深度思考',
  6: '忠诚可靠，谨慎负责，重视安全感和团队归属',
  7: '乐观开朗，追求新鲜，喜欢冒险和多样体验',
  8: '果断自信，保护他人，具有领导力和行动力',
  9: '平和包容，善于调和，追求和谐与内心平静'
}

const getTypeName = (type: number) => {
  return typeNames[type] || '未知'
}

const getTypeDescription = (type: number) => {
  return typeDescriptions[type] || '暂无描述'
}

const backToCenter = () => {
  router.push('/assessment')
}

const retakeTest = () => {
  router.push('/assessment/enneagram')
}

onMounted(() => {
  // 从路由 state 获取结果数据
  const state = history.state as any
  if (state?.result) {
    result.value = state.result
  } else {
    // 如果没有结果数据，可能是刷新页面或直接访问
    // 可以从后端重新获取最新结果，或提示用户重新测评
    console.warn('未找到测评结果数据')
    // 这里简化处理，返回测评中心
    setTimeout(() => {
      router.push('/assessment')
    }, 2000)
  }
})
</script>

<style scoped>
.enneagram-result {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff0f5 0%, #fff9fb 100%);
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

.primary-type-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.type-badge {
  display: inline-block;
  background: linear-gradient(135deg, #ffb7c5 0%, #ffdde1 100%);
  color: #5d4037;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.type-name {
  font-size: 28px;
  color: #333;
  margin-bottom: 12px;
}

.type-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.score-info {
  font-size: 14px;
  color: #ff8fa3;
  font-weight: bold;
}

.top3-section,
.all-scores-section {
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

.top3-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top3-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rank {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ffb7c5 0%, #ffdde1 100%);
  color: #5d4037;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.type-info {
  flex: 1;
}

.type-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.score-item {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  transition: all 0.3s;
}

.score-item.highlight {
  background: linear-gradient(135deg, rgba(255, 183, 197, 0.1) 0%, rgba(255, 221, 225, 0.1) 100%);
  border: 2px solid #ffb7c5;
}

.score-type {
  font-size: 20px;
  font-weight: bold;
  color: #ff8fa3;
  margin-bottom: 4px;
}

.score-name {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.score-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.action-buttons {
  margin-top: 12px;
}
</style>

