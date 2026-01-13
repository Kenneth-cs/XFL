<template>
  <div class="login">
    <div class="header">
      <h1>用户登录</h1>
      <p>欢迎回来</p>
    </div>

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请输入手机号' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
      </van-cell-group>

      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          登录
        </van-button>
      </div>
    </van-form>

    <div class="footer">
      <van-button type="default" size="small" @click="goToRegister">
        还没有账号？立即注册
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const form = ref({
  phone: '',
  password: ''
})

async function onSubmit() {
  loading.value = true
  try {
    await userStore.loginUser(form.value)
    showToast('登录成功')
    
    // 立即跳转到之前的页面或测评中心
    const redirect = route.query.redirect as string
    router.push(redirect || '/assessment')
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || '登录失败'
    showToast(errorMsg)
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  router.push('/register')
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #fff0f5 0%, #fff9fb 100%); /* 极浅粉背景 */
}

.header h1, .header p {
  color: #5d4037; /* 深暖色文字 */
}

/* 按钮样式需要在全局或深度选择器中覆盖 */
:deep(.van-button--primary) {
  background: linear-gradient(135deg, #ffb7c5 0%, #ffdde1 100%);
  border: none;
  color: #5d4037;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.header p {
  font-size: 16px;
  opacity: 0.8;
}

.submit-btn {
  margin: 16px;
}

.footer {
  text-align: center;
  margin-top: 20px;
}
</style>

