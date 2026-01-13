<template>
  <div class="home-landing">
    <!-- 顶部 Logo 和 标题 -->
    <div class="header">
      <div class="logo">
        <span class="logo-icon">❤</span>
        <span class="logo-text">幸福力</span>
      </div>
      <!-- 如果已登录，显示"退出登录"按钮（方便测试） -->
      <div v-if="userStore.isLoggedIn" class="logout-btn">
        <van-button size="small" plain type="primary" @click="handleLogout">
          退出登录
        </van-button>
      </div>
    </div>

    <!-- 核心 Slogan 区域 -->
    <div class="hero-section">
      <h1 class="main-title">幸福力</h1>
      <h2 class="sub-title">让幸福婚姻代代相传</h2>
      <div class="hero-image-placeholder">
        <!-- 这里的图片可以后续替换 -->
        <div class="placeholder-content">
          <span>开启幸福之旅</span>
        </div>
      </div>
    </div>

    <!-- 立即进入按钮 -->
    <div class="cta-section">
      <van-button 
        round 
        block 
        type="primary" 
        size="large" 
        class="enter-btn"
        @click="handleEnter"
      >
        立即进入
      </van-button>
    </div>

    <!-- 简介内容区域 -->
    <div class="intro-section">
      <div class="intro-card">
        <h3>构建“幸福力”，巧解“千千结”</h3>
        <p class="author">— 佛山幸福力婚恋文化交流中心</p>
        <div class="divider"></div>
        <p class="desc">
          人一生中最重要的投资并不是买入哪种股票，而是选择跟谁结婚 -- 股神巴菲特
        </p>
      </div>

      <div class="intro-card">
        <p class="desc-text">
          佛山幸福力婚恋文化交流中心是在王薇华博士指导下，由其弟子刘宝莹女士创办，以“幸福力教育赋能婚恋全周期”为核心使命，给出了科学化解婚恋难题的系统方案。
        </p>
      </div>

      <div class="intro-card">
        <h3>幸福力婚恋文化 体系聚焦三大关键能力培育</h3>
        <div class="feature-list">
          <div class="feature-item">
            <span class="num">1</span>
            <span>深度自我认知与情绪管理</span>
          </div>
          <div class="feature-item">
            <span class="num">2</span>
            <span>积极沟通与深度共情</span>
          </div>
          <div class="feature-item">
            <span class="num">3</span>
            <span>冲突预防与关系调适智慧</span>
          </div>
        </div>
      </div>
      
      <div class="intro-card">
        <p class="desc-text">
          区别于传统婚介，幸福力婚恋文化创新“幸福力教育 + 场景化社交”融合模式，在专业红娘引导下，通过贴近生活的家庭场景互动，让男女双方在实践中运用沟通、共情技巧，高效建立真诚连接。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from '@/utils/toast'

const router = useRouter()
const userStore = useUserStore()

const handleEnter = () => {
  if (userStore.isLoggedIn) {
    // 已登录，直接去测评中心
    router.push('/assessment')
  } else {
    // 未登录，去登录页
    router.push('/login')
  }
}

const handleLogout = () => {
  userStore.logout()
  showToast('已退出登录')
  // 不需要跳转，留在首页即可
}
</script>

<style scoped>
.home-landing {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff 0%, #fff9fb 100%);
  padding-bottom: 80px;
  overflow-x: hidden;
}

.header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
  color: #ff8fa3;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #5d4037;
}

.logout-btn {
  flex-shrink: 0;
}

.hero-section {
  text-align: center;
  padding: 40px 20px 20px;
}

.main-title {
  font-size: 48px;
  color: #ff8fa3; /* 主色调粉 */
  margin-bottom: 10px;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(255, 143, 163, 0.2);
}

.sub-title {
  font-size: 20px;
  color: #5d4037;
  margin-bottom: 30px;
  font-weight: 500;
  background: linear-gradient(90deg, #ff8fa3, #ffb7c5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  background-color: #fff0f5;
}

.hero-image-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(255, 183, 197, 0.3);
}

.placeholder-content {
  color: white;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
}

.cta-section {
  padding: 0 40px;
  margin-bottom: 40px;
}

.enter-btn {
  height: 50px;
  font-size: 18px;
  letter-spacing: 2px;
  box-shadow: 0 4px 15px rgba(255, 183, 197, 0.4);
}

.intro-section {
  padding: 20px;
}

.intro-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.intro-card h3 {
  font-size: 18px;
  color: #5d4037;
  margin-bottom: 12px;
  text-align: center;
  line-height: 1.4;
}

.author {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-bottom: 16px;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #ffb7c5, transparent);
  margin: 16px 0;
}

.desc {
  color: #ff8fa3;
  text-align: center;
  font-weight: 500;
  font-style: italic;
  line-height: 1.6;
}

.desc-text {
  color: #666;
  line-height: 1.8;
  font-size: 15px;
  text-align: justify;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff9fb;
  padding: 12px;
  border-radius: 10px;
}

.num {
  width: 24px;
  height: 24px;
  background: #ffb7c5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

/* 覆盖Vant按钮样式 */
:deep(.van-button--primary) {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  border: none;
  color: #5d4037;
  font-weight: 600;
}
</style>