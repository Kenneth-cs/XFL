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
            <van-tag type="warning">待完成</van-tag>
          </template>
        </van-cell>
        <van-cell title="依恋关系测试" is-link @click="goToTest('attachment')">
          <template #right-icon>
            <van-tag type="warning">待完成</van-tag>
          </template>
        </van-cell>
        <van-cell title="婚恋幸福力测试" is-link @click="goToTest('happiness')">
          <template #right-icon>
            <van-tag type="warning">待完成</van-tag>
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
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const userInfo = ref<any>(null)
const profile = ref<any>(null)

onMounted(async () => {
  try {
    userInfo.value = userStore.userInfo
    if (userInfo.value?.id) {
      profile.value = await getUserProfile(userInfo.value.id)
    }
  } catch (error) {
    showToast.fail('加载用户信息失败')
  }
})

function goToTest(type: string) {
  showToast('测评功能将在第二阶段开发')
}

async function handleLogout() {
  await showConfirmDialog({
    title: '提示',
    message: '确定要退出登录吗？',
  })
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 20px;
}

.user-info {
  margin-bottom: 20px;
}

.actions {
  padding: 16px;
}
</style>

