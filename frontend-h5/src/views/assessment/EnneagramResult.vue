<template>
  <div class="enneagram-result">
    <div class="result-header">
      <h2>专业九型性格测试结果</h2>
      <p>基于144题深度测评</p>
    </div>

    <div class="result-content" v-if="result">
      <!-- 柱状图 -->
      <div class="chart-container">
        <div class="chart-bars">
          <div 
            v-for="item in sortedTypes" 
            :key="item.type"
            class="bar-item"
          >
            <div class="bar-wrapper">
              <div 
                class="bar" 
                :style="{ height: `${item.percentage}%` }"
                :class="{ 'highlight': isTop3(item.type) }"
              >
                <div class="bar-value">{{ item.percentage }}%</div>
              </div>
            </div>
            <div class="bar-label">
              {{ item.type }}号<br/>（{{ getTypeName(item.type) }}）
            </div>
          </div>
        </div>
      </div>

      <!-- 说明文本 -->
      <div class="description-section">
        <p class="desc-line">测试结果，选取三个最高值</p>
        <p class="desc-line">数值越高，说明你这个号码的特征相对越多。数值越低，说明你这个号码的特征相对较少。</p>
        <p class="desc-line">这三个高分值的性格型号介绍，都看看，试试看你更像哪个，最像的那个可能就是你的性格类型</p>
      </div>

      <!-- Top3人格详细介绍 -->
      <div class="top3-details">
        <div 
          v-for="(typeNum, index) in result.top3" 
          :key="typeNum"
          class="type-card"
        >
          <div class="card-header">
            <span class="type-badge">{{ Number(index) + 1 }}号人格</span>
            <span class="type-title">{{ typeNum }}号 - {{ getTypeName(Number(typeNum)) }}</span>
            <span class="type-percentage">{{ formatPercentage(result.percentages[typeNum]) }}%</span>
          </div>
          <p class="type-description">{{ getTypeDescription(Number(typeNum)) }}</p>
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

// 按百分比降序排列所有人格类型（相同百分比按人格编号升序）
const sortedTypes = computed(() => {
  if (!result.value || !result.value.percentages) return []
  
  const types = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(type => {
    // 后端返回的是小数形式（0.6364），需要转换为百分比（63.64）
    const rawPercentage = result.value.percentages[type] || 0
    const percentage = rawPercentage < 1 ? rawPercentage * 100 : rawPercentage
    
    return {
      type,
      percentage: Number(percentage.toFixed(2))  // 保留两位小数
    }
  })
  
  // 排序规则：先按百分比降序，相同百分比按人格编号升序
  types.sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage
    }
    return a.type - b.type
  })
  
  return types
})

const getTypeName = (type: number) => {
  return typeNames[type] || '未知'
}

const getTypeDescription = (type: number) => {
  return typeDescriptions[type] || '暂无描述'
}

// 格式化百分比显示（后端返回的可能是小数形式）
const formatPercentage = (value: number) => {
  if (!value) return '0'
  // 如果是小数形式（< 1），转换为百分比
  const percentage = value < 1 ? value * 100 : value
  return percentage.toFixed(2)
}

// 判断是否在Top3中（兼容数字和字符串类型）
const isTop3 = (type: number) => {
  if (!result.value?.top3) return false
  return result.value.top3.some((t: any) => Number(t) === type)
}

const backToCenter = () => {
  router.push('/assessment')
}

const retakeTest = () => {
  router.push('/assessment/enneagram')
}

onMounted(async () => {
  // 从路由 state 获取结果数据
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
      
      if (res?.enneagram?.result) {
        result.value = res.enneagram.result
      } else {
        // 没有测评记录，返回测评中心
        console.warn('未找到九型人格测评记录')
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
.enneagram-result {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff0f5 0%, #fff9fb 100%);
  padding: 20px;
  padding-bottom: 40px;
}

.result-header {
  text-align: center;
  color: #5d4037;
  margin-bottom: 24px;
}

.result-header h2 {
  font-size: 22px;
  margin-bottom: 8px;
  font-weight: 600;
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

/* 柱状图容器 */
.chart-container {
  background: white;
  border-radius: 16px;
  padding: 24px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.chart-bars {
  display: flex;
  align-items: stretch; /* 关键修复：让所有柱子项高度填满父容器 */
  justify-content: space-between;
  height: 240px;
  gap: 8px;
  padding: 0 4px;
  min-width: 100%;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 36px;
  height: 100%; /* 确保填满父容器 */
}

.bar-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
}

.bar {
  width: 100%;
  max-width: 32px;
  background: linear-gradient(to top, #ffb7c5, #ffdde1);
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s;
  min-height: 4%;
  opacity: 0.7;
}

.bar.highlight {
  background: linear-gradient(to top, #ff8fa3, #ffb7c5);
  opacity: 1;
  box-shadow: 0 2px 8px rgba(255, 143, 163, 0.4);
}

.bar-value {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: bold;
  color: #ff8fa3;
  white-space: nowrap;
}

.bar-label {
  font-size: 10px;
  color: #666;
  text-align: center;
  line-height: 1.3;
  margin-top: 8px;
  word-break: keep-all;
  white-space: nowrap;
}

/* 说明文本 */
.description-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.desc-line {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 12px;
}

.desc-line:last-child {
  margin-bottom: 0;
}

.desc-line:first-child {
  font-weight: 600;
  color: #333;
}

/* Top3人格详细介绍 */
.top3-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.type-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #ffb7c5;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.type-badge {
  display: inline-block;
  background: linear-gradient(135deg, #ffb7c5 0%, #ffdde1 100%);
  color: #5d4037;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.type-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.type-percentage {
  font-size: 18px;
  font-weight: bold;
  color: #ff8fa3;
}

.type-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 操作按钮 */
.action-buttons {
  margin-top: 12px;
}
</style>

