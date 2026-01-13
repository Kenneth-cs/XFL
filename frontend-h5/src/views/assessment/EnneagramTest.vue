<template>
  <div class="enneagram-test">
    <!-- 顶部进度条 -->
    <div class="progress-header">
      <div class="progress-info">
        <span class="current-num">{{ currentIndex + 1 }}</span>
        <span class="total-num">/ {{ totalQuestions }}</span>
      </div>
      <van-progress 
        :percentage="progressPercentage" 
        stroke-width="4" 
        color="#1989fa"
        class="progress-bar"
      />
    </div>

    <!-- 题目内容 -->
    <div class="question-container" v-if="currentQuestion">
      <div class="question-title">
        <span class="question-label">第 {{ currentIndex + 1 }} 题</span>
        <p>{{ currentQuestion.content }}</p>
      </div>

      <div class="options-container">
        <div 
          v-for="(option, index) in currentQuestion.options" 
          :key="index"
          class="option-item"
          :class="{ 'selected': isSelected(option.type) }"
          @click="selectOption(option.type)"
        >
          <div class="option-badge">{{ String.fromCharCode(65 + index) }}</div>
          <div class="option-text">{{ option.text }}</div>
          <van-icon 
            v-if="isSelected(option.type)" 
            name="success" 
            class="check-icon"
          />
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="navigation-footer">
      <van-button 
        v-if="currentIndex > 0"
        plain 
        type="primary" 
        size="large"
        @click="prevQuestion"
        class="nav-btn"
      >
        上一题
      </van-button>
      <van-button 
        v-if="currentIndex < totalQuestions - 1"
        type="primary" 
        size="large"
        :disabled="!currentAnswer"
        @click="nextQuestion"
        class="nav-btn"
      >
        下一题
      </van-button>
      <van-button 
        v-if="currentIndex === totalQuestions - 1"
        type="primary" 
        size="large"
        :disabled="!isAllAnswered"
        @click="submitTest"
        class="nav-btn submit-btn"
      >
        提交测评
      </van-button>
    </div>

    <!-- 题目导航弹窗 -->
    <van-action-sheet 
      v-model:show="showNavSheet" 
      title="题目导航"
      close-on-click-action
    >
      <div class="nav-grid">
        <div 
          v-for="(q, idx) in questions" 
          :key="idx"
          class="nav-item"
          :class="{ 
            'answered': answers[idx] !== undefined,
            'current': idx === currentIndex 
          }"
          @click="jumpToQuestion(idx)"
        >
          {{ idx + 1 }}
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getEnneagramQuestions, submitEnneagram } from '@/api/assessment'
import { showToast } from '@/utils/toast'

interface EnneagramOption {
  text: string
  type: number
}

interface EnneagramQuestion {
  questionId: number
  content: string
  options: EnneagramOption[]
}

const router = useRouter()
const userStore = useUserStore()

const questions = ref<EnneagramQuestion[]>([])
const currentIndex = ref(0)
const answers = ref<Record<number, number>>({}) // questionId => selectedType
const loading = ref(false)
const showNavSheet = ref(false)

// 计算属性
const totalQuestions = computed(() => questions.value.length)
const progressPercentage = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round(((currentIndex.value + 1) / totalQuestions.value) * 100)
})

const currentQuestion = computed(() => questions.value[currentIndex.value])
const currentAnswer = computed(() => {
  if (!currentQuestion.value) return undefined
  return answers.value[currentQuestion.value.questionId]
})

const isAllAnswered = computed(() => {
  return questions.value.every(q => answers.value[q.questionId] !== undefined)
})

// 方法
const isSelected = (type: number) => {
  return currentAnswer.value === type
}

const selectOption = (type: number) => {
  if (!currentQuestion.value) return
  answers.value[currentQuestion.value.questionId] = type
}

const nextQuestion = () => {
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const jumpToQuestion = (index: number) => {
  currentIndex.value = index
  showNavSheet.value = false
}

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
    // 转换答案格式
    const formattedAnswers = questions.value.map(q => ({
      questionId: q.questionId,
      selectedType: answers.value[q.questionId]
    }))

    const res = await submitEnneagram({
      userId: userStore.userInfo.id,
      answers: formattedAnswers
    })

    showToast('测评提交成功')
    
    // 跳转到结果页（携带结果数据）
    // 后端返回格式: { recordId: "...", result: {...} }
    // 响应拦截器已经返回了 response.data
    setTimeout(() => {
      router.push({
        name: 'enneagram-result',
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
    const res = await getEnneagramQuestions()
    // 后端返回格式: { total: 144, questions: [...] }
    // 注意：响应拦截器已经返回了 response.data，所以直接访问 res.questions
    questions.value = res.questions || []
    
    if (questions.value.length === 0) {
      showToast('题目加载失败')
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
.enneagram-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff0f5 0%, #fff9fb 100%);
  display: flex;
  flex-direction: column;
}

.progress-header {
  background: white;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-info {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.current-num {
  font-size: 24px;
  font-weight: bold;
  color: #ffb7c5;
}

.total-num {
  font-size: 14px;
  color: #999;
  margin-left: 4px;
}

.progress-bar {
  margin-top: 8px;
}

.question-container {
  flex: 1;
  padding: 24px 20px;
  overflow-y: auto;
}

.question-title {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-label {
  display: inline-block;
  font-size: 12px;
  color: #ff8fa3;
  background: #fff0f5;
  padding: 4px 12px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.question-title p {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  margin-top: 12px;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.option-item:active {
  transform: scale(0.98);
}

.option-item.selected {
  background: linear-gradient(135deg, #ffb7c5 0%, #ffdde1 100%);
  color: #5d4037;
  box-shadow: 0 4px 16px rgba(255, 183, 197, 0.4);
}

.option-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  margin-right: 12px;
  flex-shrink: 0;
}

.option-item.selected .option-badge {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.option-text {
  flex: 1;
  font-size: 15px;
  line-height: 1.5;
}

.check-icon {
  color: white;
  font-size: 20px;
  margin-left: 8px;
}

.navigation-footer {
  background: white;
  padding: 16px 20px;
  display: flex;
  gap: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.nav-btn {
  flex: 1;
}

.submit-btn {
  background: linear-gradient(135deg, #ffb7c5 0%, #ffdde1 100%);
  border: none;
  color: #5d4037;
}

/* 导航弹窗 */
.nav-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.nav-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f0f0f0;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item.answered {
  background: #fff0f5;
  color: #ff8fa3;
}

.nav-item.current {
  background: linear-gradient(135deg, #ffb7c5 0%, #ffdde1 100%);
  color: #5d4037;
}

.nav-item:active {
  transform: scale(0.95);
}
</style>

