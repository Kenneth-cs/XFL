<template>
  <div class="attachment-result">
    <div class="result-header">
      <h2>依恋关系测评报告</h2>
      <p>基于36题深度测评</p>
    </div>

    <div class="result-content" v-if="result">
      <!-- 依恋类型卡片 -->
      <div class="type-card" :class="`type-${getTypeClass(result.type)}`">
        <div class="type-badge">{{ result.type }}</div>
        <h3 class="type-label">{{ result.typeDetails?.typeLabel || '关系模式' }}</h3>
        <p class="type-desc">{{ result.typeDetails?.coreTraits || '暂无描述' }}</p>
      </div>

      <!-- 三维度得分 -->
      <div class="scores-card">
        <h3 class="section-title">三维度得分</h3>
        
        <div class="score-item anxiety">
          <div class="score-label">
            <span class="score-icon">A</span>
            <span class="score-name">焦虑维度</span>
          </div>
          <div class="score-bar">
            <van-progress 
              :percentage="(result.anxietyScore / 12) * 100" 
              stroke-width="8"
              :pivot-text="`${result.anxietyScore}/12`"
              color="#ff9a9e"
            />
          </div>
          <p class="score-desc">{{ getScoreDesc('A', result.anxietyScore) }}</p>
        </div>

        <div class="score-item avoidance">
          <div class="score-label">
            <span class="score-icon">B</span>
            <span class="score-name">回避维度</span>
          </div>
          <div class="score-bar">
            <van-progress 
              :percentage="(result.avoidanceScore / 12) * 100" 
              stroke-width="8"
              :pivot-text="`${result.avoidanceScore}/12`"
              color="#667eea"
            />
          </div>
          <p class="score-desc">{{ getScoreDesc('B', result.avoidanceScore) }}</p>
        </div>

        <div class="score-item security">
          <div class="score-label">
            <span class="score-icon">C</span>
            <span class="score-name">安全感维度</span>
          </div>
          <div class="score-bar">
            <van-progress 
              :percentage="(result.securityScore / 12) * 100" 
              stroke-width="8"
              :pivot-text="`${result.securityScore}/12`"
              color="#84fab0"
            />
          </div>
          <p class="score-desc">{{ getScoreDesc('C', result.securityScore) }}</p>
        </div>
      </div>

      <!-- 建议与解读 -->
      <div class="advice-card">
        <h3 class="section-title">关系建议</h3>
        <div class="advice-content">
          <p>{{ getAdvice(result.type) }}</p>
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

const getTypeClass = (type: string) => {
  const classMap: Record<string, string> = {
    '安全型': 'security',
    '焦虑型': 'anxiety',
    '回避型': 'avoidance',
    '紊乱型': 'disorder'
  }
  return classMap[type] || 'default'
}

const getScoreDesc = (dimension: string, score: number) => {
  const descMap: Record<string, Record<string, string>> = {
    A: {
      low: '焦虑程度较低，对关系较有安全感',
      high: '焦虑程度较高，容易担心被抛弃'
    },
    B: {
      low: '回避程度较低，愿意建立亲密关系',
      high: '回避程度较高，倾向保持距离'
    },
    C: {
      low: '安全感较低，需要建立信任',
      high: '安全感较高，关系稳定健康'
    }
  }
  
  const level = score >= 5 ? 'high' : 'low'
  return descMap[dimension]?.[level] || ''
}

const getAdvice = (type: string) => {
  const adviceMap: Record<string, string> = {
    '安全型': '你拥有健康的依恋模式，既能享受亲密又能保持独立。继续保持真诚沟通和相互信任，这是关系长久的基石。',
    '焦虑型': '你渴望亲密但容易缺乏安全感。建议培养自我价值感，学会独立，与伴侣建立稳定的沟通模式，表达需求而非期待对方猜测。',
    '回避型': '你重视独立但可能排斥过度亲密。尝试逐步打开心扉，接纳伴侣的关心，允许自己表达脆弱和需求，这不会削弱你的独立性。',
    '紊乱型': '你既渴望亲密又害怕受伤，内心矛盾纠结。建议寻求专业心理咨询，疗愈过往创伤，学习健康的情感表达和边界设定。'
  }
  return adviceMap[type] || '请保持自我觉察，必要时寻求专业帮助。'
}

const backToCenter = () => {
  router.push('/assessment')
}

const retakeTest = () => {
  router.push('/assessment/attachment')
}

onMounted(() => {
  const state = history.state as any
  if (state?.result) {
    result.value = state.result
  } else {
    console.warn('未找到测评结果数据')
    setTimeout(() => {
      router.push('/assessment')
    }, 2000)
  }
})
</script>

<style scoped>
.attachment-result {
  min-height: 100vh;
  background: linear-gradient(135deg, #fef6fa 0%, #f3f0ff 100%);
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

.type-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.type-card.type-security {
  border-top: 4px solid #84fab0;
}

.type-card.type-anxiety {
  border-top: 4px solid #ff9a9e;
}

.type-card.type-avoidance {
  border-top: 4px solid #667eea;
}

.type-card.type-disorder {
  border-top: 4px solid #fa8c84;
}

.type-badge {
  display: inline-block;
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
  color: #5d4037;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.type-label {
  font-size: 24px;
  color: #333;
  margin-bottom: 12px;
}

.type-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.scores-card,
.advice-card {
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

.score-item {
  margin-bottom: 24px;
}

.score-item:last-child {
  margin-bottom: 0;
}

.score-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.score-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
}

.score-item.anxiety .score-icon {
  background: #ff9a9e;
}

.score-item.avoidance .score-icon {
  background: #667eea;
}

.score-item.security .score-icon {
  background: #84fab0;
}

.score-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.score-bar {
  margin-bottom: 8px;
}

.score-desc {
  font-size: 13px;
  color: #666;
  margin-top: 8px;
}

.advice-content {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.action-buttons {
  margin-top: 12px;
}
</style>

