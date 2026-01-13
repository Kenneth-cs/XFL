<template>
  <div class="attachment-test">
    <!-- 顶部说明 -->
    <div class="test-header">
      <h2>依恋关系测试</h2>
      <p class="instruction">请勾选符合你在亲密关系中表现的选项（可多选）</p>
      <div class="progress-info">
        <span class="selected-count">已选 {{ selectedCount }}</span>
        <span class="divider">/</span>
        <span class="total-count">共 {{ totalQuestions }} 题</span>
      </div>
    </div>

    <!-- 题目列表（按维度分组） -->
    <div class="questions-container" v-if="groupedQuestions">
      <!-- 焦虑维度 -->
      <div class="dimension-section">
        <div class="dimension-header anxiety">
          <span class="dimension-icon">A</span>
          <span class="dimension-title">焦虑测试</span>
          <span class="dimension-desc">对关系被抛弃的担忧</span>
        </div>
        <van-checkbox-group v-model="selectedQuestions">
          <div 
            v-for="q in groupedQuestions.A" 
            :key="q.questionId"
            class="question-item"
          >
            <van-checkbox 
              :name="q.questionId"
              icon-size="20px"
            >
              <span class="question-text">{{ q.content }}</span>
            </van-checkbox>
          </div>
        </van-checkbox-group>
      </div>

      <!-- 回避维度 -->
      <div class="dimension-section">
        <div class="dimension-header avoidance">
          <span class="dimension-icon">B</span>
          <span class="dimension-title">回避测试</span>
          <span class="dimension-desc">对情感亲密的抗拒程度</span>
        </div>
        <van-checkbox-group v-model="selectedQuestions">
          <div 
            v-for="q in groupedQuestions.B" 
            :key="q.questionId"
            class="question-item"
          >
            <van-checkbox 
              :name="q.questionId"
              icon-size="20px"
            >
              <span class="question-text">{{ q.content }}</span>
            </van-checkbox>
          </div>
        </van-checkbox-group>
      </div>

      <!-- 安全感维度 -->
      <div class="dimension-section">
        <div class="dimension-header security">
          <span class="dimension-icon">C</span>
          <span class="dimension-title">安全感测试</span>
          <span class="dimension-desc">健康关系的正向特质</span>
        </div>
        <van-checkbox-group v-model="selectedQuestions">
          <div 
            v-for="q in groupedQuestions.C" 
            :key="q.questionId"
            class="question-item"
          >
            <van-checkbox 
              :name="q.questionId"
              icon-size="20px"
            >
              <span class="question-text">{{ q.content }}</span>
            </van-checkbox>
          </div>
        </van-checkbox-group>
      </div>
    </div>

    <!-- 底部提交按钮 -->
    <div class="submit-footer">
      <van-button 
        type="primary" 
        size="large"
        block
        :disabled="selectedCount === 0"
        :loading="loading"
        @click="submitTest"
      >
        提交测评 ({{ selectedCount }}/{{ totalQuestions }})
      </van-button>
      <p class="tip">建议如实勾选，至少选择5项以获得准确结果</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getAttachmentQuestions, submitAttachment } from '@/api/assessment'
import { showToast } from '@/utils/toast'

interface AttachmentQuestion {
  questionId: string
  content: string
  dimension: 'A' | 'B' | 'C'
}

const router = useRouter()
const userStore = useUserStore()

const questions = ref<AttachmentQuestion[]>([])
const selectedQuestions = ref<string[]>([])
const loading = ref(false)

// 计算属性
const totalQuestions = computed(() => questions.value.length)
const selectedCount = computed(() => selectedQuestions.value.length)

// 按维度分组题目
const groupedQuestions = computed(() => {
  if (questions.value.length === 0) return null
  
  return {
    A: questions.value.filter(q => q.dimension === 'A'),
    B: questions.value.filter(q => q.dimension === 'B'),
    C: questions.value.filter(q => q.dimension === 'C'),
  }
})

// 提交测评
const submitTest = async () => {
  if (selectedCount.value === 0) {
    showToast('请至少勾选一项')
    return
  }

  if (!userStore.userInfo?.id) {
    showToast('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
  
  try {
    const res = await submitAttachment({
      userId: userStore.userInfo.id,
      selectedQuestions: selectedQuestions.value
    })

    showToast('测评提交成功')
    
    // 跳转到结果页
    // 响应拦截器已经返回了 response.data
    setTimeout(() => {
      router.push({
        name: 'attachment-result',
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
    const res = await getAttachmentQuestions()
    // 响应拦截器已经返回了 response.data，所以直接访问 res.questions
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
.attachment-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #fef6fa 0%, #f3f0ff 100%);
  padding-bottom: 120px;
}

.test-header {
  background: white;
  padding: 24px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.test-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.instruction {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.selected-count {
  font-size: 20px;
  font-weight: bold;
  color: #b39ddb; /* 柔和紫 */
}

.divider {
  color: #ccc;
}

.total-count {
  font-size: 14px;
  color: #999;
}

.questions-container {
  padding: 20px;
}

.dimension-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dimension-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.dimension-header.anxiety {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.dimension-header.avoidance {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dimension-header.security {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.dimension-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 18px;
}

.dimension-title {
  font-size: 16px;
  font-weight: bold;
  color: white;
  flex: 1;
}

.dimension-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.question-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.question-item:last-child {
  border-bottom: none;
}

.question-text {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  display: inline-block;
  margin-left: 8px;
}

.submit-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.tip {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 8px;
}
</style>

