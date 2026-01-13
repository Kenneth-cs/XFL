<template>
  <div class="assessment-center">
    <div class="header">
      <div class="header-content">
        <div class="header-text">
          <h2>测评中心</h2>
          <p>探索自我，遇见更好的幸福</p>
        </div>
        <div class="header-action">
          <van-button 
            plain 
            type="primary" 
            size="small" 
            icon="user-o"
            @click="goToProfile"
          >
            个人中心
          </van-button>
        </div>
      </div>
    </div>

    <div class="assessment-list">
      <!-- 九型人格 -->
      <div class="assessment-card" @click="handleCardClick('enneagram')">
        <div class="card-icon enneagram-icon">9</div>
        <div class="card-content">
          <h3>九型人格测试</h3>
          <p>探索你的性格密码，了解真实的自己</p>
          <div class="status-badge" :class="getStatusClass(1)">
            {{ getStatusText(1) }}
          </div>
        </div>
        <div class="card-action">
          <van-icon name="arrow" />
        </div>
      </div>

      <!-- 依恋关系 -->
      <div class="assessment-card" @click="handleCardClick('attachment')">
        <div class="card-icon attachment-icon">♥</div>
        <div class="card-content">
          <h3>依恋关系测试</h3>
          <p>了解你的亲密关系模式，建立安全感</p>
          <div class="status-badge" :class="getStatusClass(2)">
            {{ getStatusText(2) }}
          </div>
        </div>
        <div class="card-action">
          <van-icon name="arrow" />
        </div>
      </div>

      <!-- 婚恋幸福力 -->
      <div class="assessment-card" @click="handleCardClick('happiness')">
        <div class="card-icon happiness-icon">☀</div>
        <div class="card-content">
          <h3>婚恋幸福力测试</h3>
          <p>全方位评估婚恋价值，提升幸福能力</p>
          <div class="status-badge" :class="getStatusClass(3)">
            {{ getStatusText(3) }}
          </div>
        </div>
        <div class="card-action">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getLatestResults } from '@/api/assessment'
import { showToast } from '@/utils/toast'

const router = useRouter()
const userStore = useUserStore()

const latestResults = ref<any>({
  enneagram: null,
  attachment: null,
  happiness: null
})

// 加载测评状态
const loadStatus = async () => {
  if (!userStore.userInfo?.id) return
  
  try {
    const res = await getLatestResults(userStore.userInfo.id)
    // 响应拦截器已经返回了 response.data
    if (res) {
      latestResults.value = res
    }
  } catch (error) {
    console.error('获取测评状态失败', error)
  }
}

// 获取状态文本
const getStatusText = (type: number) => {
  const map: Record<string, any> = {
    1: latestResults.value.enneagram,
    2: latestResults.value.attachment,
    3: latestResults.value.happiness
  }
  return map[type] ? '已完成 · 查看结果' : '未测试'
}

// 获取状态样式类
const getStatusClass = (type: number) => {
  const map: Record<string, any> = {
    1: latestResults.value.enneagram,
    2: latestResults.value.attachment,
    3: latestResults.value.happiness
  }
  return map[type] ? 'completed' : 'pending'
}

const handleCardClick = (type: string) => {
  // 如果已完成，跳转到结果页（暂未实现，先跳转到答题页的预览模式或直接重新测试）
  // 这里逻辑简化：统一跳转到对应页面，内部判断是答题还是看结果
  
  // 目前先假设跳转去答题
  router.push(`/assessment/${type}`)
}

const goToProfile = () => {
  router.push('/profile')
}

onMounted(() => {
  loadStatus()
})
</script>

<style scoped>
.assessment-center {
  min-height: 100vh;
  background-color: #fff9fb;
  padding: 20px;
}

.header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.header-text {
  flex: 1;
}

.header-text h2 {
  font-size: 24px;
  color: #5d4037;
  margin-bottom: 8px;
}

.header-text p {
  font-size: 14px;
  color: #999;
}

.header-action {
  flex-shrink: 0;
  padding-top: 4px;
}

.header-action :deep(.van-button--plain.van-button--primary) {
  border-color: #ffb7c5;
  color: #5d4037;
  background: white;
}

.header-action :deep(.van-button--plain.van-button--primary:active) {
  background: #fff0f5;
}

.assessment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assessment-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s;
}

.assessment-card:active {
  transform: scale(0.98);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-right: 16px;
  flex-shrink: 0;
}

.enneagram-icon {
  background: linear-gradient(135deg, #ffc3a0 0%, #ffafbd 100%);
}

.attachment-icon {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
}

.happiness-icon {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  font-weight: 600;
}

.card-content p {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.status-badge {
  display: inline-block;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
}

.status-badge.pending {
  background-color: #f0f0f0;
  color: #999;
}

.status-badge.completed {
  background-color: #fff0f5;
  color: #ff8fa3;
}

.card-action {
  color: #ccc;
  font-size: 16px;
}
</style>

