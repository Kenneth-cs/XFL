<template>
  <div class="home">
    <div class="banner">
      <h1>幸福力婚恋系统</h1>
      <p>科学匹配，幸福相遇</p>
    </div>

    <div class="intro">
      <van-cell-group title="系统介绍">
        <van-cell>
          <p>基于多维度心理学模型的专业婚恋服务系统</p>
          <ul>
            <li>九型人格测试</li>
            <li>依恋关系测试</li>
            <li>婚恋幸福力评测</li>
            <li>智能科学匹配</li>
          </ul>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="actions">
      <van-button type="primary" size="large" @click="goToProfile">
        进入个人中心
      </van-button>
      <van-button type="default" size="large" @click="logout" v-if="isLoggedIn">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const isLoggedIn = userStore.isLoggedIn

function goToProfile() {
  router.push('/profile')
}

async function logout() {
  await showConfirmDialog({
    title: '提示',
    message: '确定要退出登录吗？',
  })
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  padding: 20px;
}

.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
}

.banner h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.banner p {
  font-size: 16px;
  opacity: 0.9;
}

.intro {
  margin-bottom: 20px;
}

.intro ul {
  list-style: none;
  padding-left: 0;
  margin-top: 10px;
}

.intro li {
  padding: 5px 0;
  padding-left: 20px;
  position: relative;
}

.intro li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #07c160;
  font-weight: bold;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>

