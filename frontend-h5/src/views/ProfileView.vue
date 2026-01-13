<template>
  <div class="profile">
    <van-nav-bar title="个人中心" left-arrow @click-left="router.back()" />

    <div class="user-info" v-if="userInfo">
      <van-cell-group title="基本信息">
        <van-cell title="用户ID" :value="userInfo.id" />
        <van-cell title="手机号" :value="userInfo.phone" />
        <van-cell title="归属门店" :value="userInfo.storeId" />
      </van-cell-group>

      <van-cell-group title="档案信息" v-if="profile">
        <van-cell title="姓名" :value="profile.baseInfo?.name" />
        <van-cell title="性别" :value="profile.baseInfo?.gender" />
        <van-cell title="出生日期" :value="profile.baseInfo?.birthday" />
        <van-cell title="身高" :value="profile.baseInfo?.height + ' cm'" />
        <van-cell title="体重" :value="profile.baseInfo?.weight + ' kg'" />
        <van-cell title="学历" :value="profile.baseInfo?.education" />
        <van-cell title="婚况" :value="profile.baseInfo?.marriage" />
        <van-cell title="民族" :value="profile.baseInfo?.ethnicity" />
      </van-cell-group>

      <van-cell-group title="测评记录">
        <van-cell title="九型人格测试" is-link @click="goToTest('enneagram')">
          <template #right-icon>
            <van-tag :type="assessmentStatus.enneagram ? 'success' : 'warning'">
              {{ assessmentStatus.enneagram ? '已完成' : '未测试' }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell title="依恋关系测试" is-link @click="goToTest('attachment')">
          <template #right-icon>
            <van-tag :type="assessmentStatus.attachment ? 'success' : 'warning'">
              {{ assessmentStatus.attachment ? '已完成' : '未测试' }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell title="婚恋幸福力测试" is-link @click="goToTest('happiness')">
          <template #right-icon>
            <van-tag :type="assessmentStatus.happiness ? 'success' : 'warning'">
              {{ assessmentStatus.happiness ? '已完成' : '未测试' }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="actions">
      <van-button type="danger" size="large" @click="handleLogout">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserProfile } from '@/api/user'
import { getLatestResults } from '@/api/assessment'
import { showToast } from '@/utils/toast'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const userInfo = ref<any>(null)
const profile = ref<any>(null)
const assessmentStatus = ref({
  enneagram: false,
  attachment: false,
  happiness: false
})

onMounted(async () => {
  try {
    userInfo.value = userStore.userInfo
    if (userInfo.value?.id) {
      // 加载用户档案
      profile.value = await getUserProfile(userInfo.value.id)
      
      // 加载测评状态
      const res = await getLatestResults(userInfo.value.id)
      // 响应拦截器已经返回了 response.data
      if (res) {
        assessmentStatus.value = {
          enneagram: !!res.enneagram,
          attachment: !!res.attachment,
          happiness: !!res.happiness
        }
      }
    }
  } catch (error) {
    showToast('加载用户信息失败')
  }
})

function goToTest(type: string) {
  router.push(`/assessment/${type}`)
}

async function handleLogout() {
  await showConfirmDialog({
    title: '提示',
    message: '确定要退出登录吗？',
  })
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background-color: #fff9fb;
  padding-bottom: 20px;
}

.user-info {
  margin-bottom: 20px;
}

.actions {
  padding: 16px;
}

/* 自定义按钮样式 */
:deep(.van-button--danger) {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  border: none;
  color: #5d4037;
  font-weight: 500;
}

/* 自定义 NavBar 样式 */
:deep(.van-nav-bar) {
  background: linear-gradient(135deg, #ffb7c5 0%, #ffdde1 100%);
}

:deep(.van-nav-bar__title) {
  color: #5d4037;
  font-weight: 600;
}

:deep(.van-nav-bar .van-icon) {
  color: #5d4037;
}
</style>

