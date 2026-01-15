<template>
  <div class="attachment-result">
    <div class="result-header">
      <h2>专业依恋关系测评结果</h2>
      <p>基于36题深度测评</p>
    </div>

    <div class="result-content" v-if="result">
      <!-- 依恋类型卡片 -->
      <div v-if="result.type === '得分不足'" class="type-card type-insufficient">
        <p class="intro-text">您在《幸福力婚恋关系测试》中显示是：</p>
        <div class="insufficient-notice">
          <van-icon name="info-o" size="24" color="#fa8c16" />
          <h3 class="insufficient-title">得分不足</h3>
          <p class="insufficient-desc">三个维度得分都低于5分，无法给出具体的依恋类型</p>
          <p class="insufficient-tip">请查看下方三维度得分详情，或联系您的专属红娘老师进行深入沟通</p>
        </div>
      </div>
      <div v-else class="type-card" :class="`type-${getTypeClass(result.type)}`">
        <p class="intro-text">您在《幸福力婚恋关系测试》中显示是：</p>
        <div v-if="result.type && !result.type.includes('待进一步沟通')" class="type-badge">{{ result.type }}</div>
        <h3 v-if="getTypeLabel(result.type)" class="type-label">{{ getTypeLabel(result.type) }}</h3>
        <div class="dimension-combo">
          <span class="combo-text">{{ getDimensionCombo(result) }}</span>
        </div>
        <p v-if="getTypeDescription(result.type)" class="type-desc">{{ getTypeDescription(result.type) }}</p>
      </div>

      <!-- 三维度得分 -->
      <div class="scores-card">
        <h3 class="section-title">三维度得分详情</h3>
        
        <div class="score-item anxiety">
          <div class="score-label">
            <span class="score-icon">A</span>
            <span class="score-name">焦虑维度（Anxiety）</span>
          </div>
          <div class="score-bar">
            <van-progress 
              :percentage="(result.anxietyScore / 12) * 100" 
              stroke-width="10"
              :pivot-text="`${result.anxietyScore}/12`"
              color="#ff9a9e"
            />
          </div>
          <p class="score-desc">{{ getScoreDesc('A', result.anxietyScore) }}</p>
        </div>

        <div class="score-item avoidance">
          <div class="score-label">
            <span class="score-icon">B</span>
            <span class="score-name">回避维度（Avoidance）</span>
          </div>
          <div class="score-bar">
            <van-progress 
              :percentage="(result.avoidanceScore / 12) * 100" 
              stroke-width="10"
              :pivot-text="`${result.avoidanceScore}/12`"
              color="#667eea"
            />
          </div>
          <p class="score-desc">{{ getScoreDesc('B', result.avoidanceScore) }}</p>
        </div>

        <div class="score-item security">
          <div class="score-label">
            <span class="score-icon">C</span>
            <span class="score-name">安全感维度（Security）</span>
          </div>
          <div class="score-bar">
            <van-progress 
              :percentage="(result.securityScore / 12) * 100" 
              stroke-width="10"
              :pivot-text="`${result.securityScore}/12`"
              color="#84fab0"
            />
          </div>
          <p class="score-desc">{{ getScoreDesc('C', result.securityScore) }}</p>
        </div>
      </div>

      <!-- 建议与解读 -->
      <div class="advice-card">
        <h3 class="section-title">专业关系建议</h3>
        <div class="advice-content">
          <p class="advice-text">更详细的测试结果解读与改善方案，请联系您的专属红娘老师</p>
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
import { useUserStore } from '@/stores/user'

const router = useRouter()
const result = ref<any>(null)

// 类型映射（用于样式类名）
const getTypeClass = (type: string) => {
  const classMap: Record<string, string> = {
    '安全型': 'security',
    '焦虑型': 'anxiety',
    '回避型': 'avoidance',
    '紊乱型': 'disorder'
  }
  return classMap[type] || 'default'
}

// 类型标签（如"健康核心型"）
const getTypeLabel = (type: string) => {
  // 过滤掉"待进一步沟通"类型
  if (type && type.includes('待进一步沟通')) {
    return ''
  }
  
  const labelMap: Record<string, string> = {
    '安全型': '健康核心型',
    '焦虑型': '渴求亲密型',
    '回避型': '疏离独立型',
    '紊乱型': '矛盾纠结型'
  }
  return labelMap[type] || ''
}

// 维度组合说明
const getDimensionCombo = (resultData: any) => {
  const a = resultData.anxietyScore || 0
  const b = resultData.avoidanceScore || 0
  
  const anxietyLevel = a >= 5 ? '高焦虑' : '低焦虑'
  const avoidanceLevel = b >= 5 ? '高回避' : '低回避'
  
  return `${anxietyLevel} + ${avoidanceLevel}`
}

// 核心特质描述
const getTypeDescription = (type: string) => {
  const descMap: Record<string, string> = {
    '安全型': '安全感充足，既信任伴侣、愿意亲密，又能保持自我独立',
    '焦虑型': '极度渴望亲密与认可，害怕被抛弃，对关系的安全感极低',
    '回避型': '极度重视个人独立，排斥情感亲密与依赖，习惯用疏离保护自己',
    '紊乱型': '既极度渴望亲密、害怕被抛弃，又极度抗拒亲密、害怕被伤害'
  }
  return descMap[type] || ''
}

// 维度得分解读
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

const backToCenter = () => {
  router.push('/assessment')
}

const retakeTest = () => {
  router.push('/assessment/attachment')
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
      
      if (res?.attachment?.result) {
        result.value = res.attachment.result
      } else {
        console.warn('未找到依恋关系测评记录')
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

.type-card.type-insufficient {
  border-top: 4px solid #fa8c16;
}

.insufficient-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.insufficient-title {
  font-size: 20px;
  font-weight: 600;
  color: #fa8c16;
  margin: 0;
}

.insufficient-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

.insufficient-tip {
  font-size: 13px;
  color: #999;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  padding: 12px;
  background: #fff7e6;
  border-radius: 8px;
  width: 100%;
}

.intro-text {
  font-size: 15px;
  color: #666;
  margin-bottom: 16px;
  text-align: center;
  line-height: 1.6;
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
  font-size: 20px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.dimension-combo {
  margin-bottom: 16px;
}

.combo-text {
  display: inline-block;
  background: rgba(255, 154, 158, 0.15);
  color: #ff6b6b;
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.type-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
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
  text-align: center;
}

.advice-text {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.action-buttons {
  margin-top: 12px;
}
</style>

