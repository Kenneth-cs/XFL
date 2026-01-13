<template>
  <div class="happiness-test">
    <!-- 顶部进度 -->
    <div class="test-header">
      <h2>婚恋幸福力测试</h2>
      <div class="progress-info">
        <span class="answered-count">{{ answeredCount }}</span>
        <span class="divider">/</span>
        <span class="total-count">{{ totalQuestions }} 题</span>
      </div>
      <van-progress 
        :percentage="progressPercentage" 
        stroke-width="4" 
        color="#84fab0"
      />
    </div>

    <!-- 维度列表 -->
    <div class="dimensions-container">
      <van-collapse v-model="activeDimension" accordion>
        <van-collapse-item 
          v-for="dim in dimensions" 
          :key="dim.id"
          :name="dim.id"
        >
          <template #title>
            <div class="dimension-title">
              <span class="dim-name">{{ dim.name }}</span>
              <span class="dim-progress">{{ getDimensionProgress(dim.id) }}</span>
            </div>
          </template>
          <template #value>
            <van-tag 
              :type="getDimensionStatus(dim.id) === 'done' ? 'success' : 'default'" 
              size="medium"
            >
              {{ getDimensionStatus(dim.id) === 'done' ? '已完成' : '未完成' }}
            </van-tag>
          </template>

          <!-- 维度内的题目 -->
          <div class="questions-list">
            <div 
              v-for="q in getQuestionsByDimension(dim.id)" 
              :key="q.questionId"
              class="question-item"
            >
              <div class="question-content">
                <span v-if="q.subLabel" class="question-tag">{{ q.subLabel }}</span>
                <p class="question-text">{{ q.content }}</p>
              </div>
              <van-radio-group 
                v-model="answers[q.questionId]" 
                direction="vertical"
                class="options-group"
              >
                <van-radio 
                  v-for="opt in q.options" 
                  :key="opt.value"
                  :name="opt.value"
                  icon-size="18px"
                  class="option-radio"
                >
                  {{ opt.label }}
                </van-radio>
              </van-radio-group>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>

    <!-- 底部提交 -->
    <div class="submit-footer">
      <van-button 
        type="primary" 
        size="large"
        block
        :disabled="!isAllAnswered"
        :loading="loading"
        @click="submitTest"
      >
        {{ isAllAnswered ? '提交测评' : `还有 ${totalQuestions - answeredCount} 题未作答` }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getHappinessQuestions, submitHappiness } from '@/api/assessment'
import { showToast } from '@/utils/toast'

interface HappinessOption {
  value: number
  label: string
}

interface HappinessQuestion {
  questionId: string
  dimensionId: number
  content: string
  options: HappinessOption[]
  isIgnored?: boolean
  subLabel?: string
}

interface HappinessDimension {
  id: number
  name: string
  shortName: string
  description: string
  totalQuestions: number
  maxScore: number
  targetScore: number
}

const router = useRouter()
const userStore = useUserStore()

const questions = ref<HappinessQuestion[]>([])
const dimensions = ref<HappinessDimension[]>([])
const answers = ref<Record<string, number>>({})
const loading = ref(false)
const activeDimension = ref<number>(1) // 默认展开第一个维度

// 计算属性
const totalQuestions = computed(() => questions.value.length)
const answeredCount = computed(() => Object.keys(answers.value).length)
const progressPercentage = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((answeredCount.value / totalQuestions.value) * 100)
})

const isAllAnswered = computed(() => {
  return questions.value.every(q => answers.value[q.questionId] !== undefined)
})

// 方法
const getQuestionsByDimension = (dimId: number) => {
  return questions.value.filter(q => q.dimensionId === dimId)
}

const getDimensionProgress = (dimId: number) => {
  const dimQuestions = getQuestionsByDimension(dimId)
  const answeredInDim = dimQuestions.filter(q => answers.value[q.questionId] !== undefined).length
  return `${answeredInDim}/${dimQuestions.length}`
}

const getDimensionStatus = (dimId: number) => {
  const dimQuestions = getQuestionsByDimension(dimId)
  const answeredInDim = dimQuestions.filter(q => answers.value[q.questionId] !== undefined).length
  return answeredInDim === dimQuestions.length ? 'done' : 'pending'
}

// 提交测评
const submitTest = async () => {
  if (!isAllAnswered.value) {
    showToast('请完成所有题目后再提交')
    return
  }

  if (!userStore.userInfo?.id) {
    showToast('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
  
  try {
    const formattedAnswers = questions.value.map(q => ({
      questionId: q.questionId,
      score: answers.value[q.questionId]
    }))

    const res = await submitHappiness({
      userId: userStore.userInfo.id,
      answers: formattedAnswers
    })

    showToast('测评提交成功')
    
    // 响应拦截器已经返回了 response.data
    setTimeout(() => {
      router.push({
        name: 'happiness-result',
        state: { result: res.result || res }
      })
    }, 1000)
  } catch (error: any) {
    console.error('提交失败', error)
    showToast(error.response?.data?.message || '提交失败，请重试')
  } finally {
    loading.value = false
  }
}

// 加载题目
const loadQuestions = async () => {
  loading.value = true
  try {
    const res = await getHappinessQuestions()
    // 响应拦截器已经返回了 response.data，所以直接访问 res
    // 后端返回格式: { total: 155, questions: [...], dimensions: [...] }
    
    if (res.questions) {
      questions.value = res.questions
    }
    
    if (res.dimensions) {
      dimensions.value = res.dimensions
    }
    
    if (questions.value.length === 0) {
      showToast('题目加载失败')
    }
    
    // 如果没有dimensions数据，从questions中提取
    if (dimensions.value.length === 0) {
      const dimSet = new Set(questions.value.map(q => q.dimensionId))
      dimensions.value = Array.from(dimSet).map(id => ({
        id,
        name: `维度${id}`,
        shortName: `D${id}`,
        description: '',
        totalQuestions: getQuestionsByDimension(id).length,
        maxScore: 0,
        targetScore: 10
      }))
    }
  } catch (error) {
    console.error('加载题目失败', error)
    showToast('加载题目失败，请重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.happiness-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #fffcf5 0%, #fff0f0 100%);
  padding-bottom: 100px;
}

.test-header {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.test-header h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.answered-count {
  font-size: 24px;
  font-weight: bold;
  color: #ffb7c5;
}

.divider {
  color: #ccc;
}

.total-count {
  font-size: 14px;
  color: #999;
}

.dimensions-container {
  padding: 16px;
}

.dimension-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dim-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.dim-progress {
  font-size: 12px;
  color: #999;
}

.questions-list {
  padding: 16px 0;
}

.question-item {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.question-content {
  margin-bottom: 16px;
}

.question-tag {
  display: inline-block;
  background: #e6f7ff;
  color: #1989fa;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  margin-bottom: 8px;
}

.question-text {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  margin-top: 8px;
}

.options-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-radio {
  font-size: 14px;
}

.submit-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}
</style>

