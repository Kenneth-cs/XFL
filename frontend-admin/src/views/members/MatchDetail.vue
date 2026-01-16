<template>
  <div class="match-detail-page">
    <a-page-header
      title="匹配详情"
      @back="() => router.back()"
    >
      <template #tags>
        <a-tag :color="detail?.resultStatus ? 'success' : 'error'">
          {{ detail?.resultStatus ? '匹配通过' : '匹配未通过' }}
        </a-tag>
      </template>
    </a-page-header>

    <div class="detail-content" v-loading="loading">
      <a-row :gutter="24">
        <!-- 发起方 -->
        <a-col :span="12">
          <a-card title="发起方" class="user-card initiator-card">
            <template #extra>
              <a-tag color="blue">发起方</a-tag>
            </template>
            <user-profile-view :user="detail?.batch?.initiator" />
          </a-card>
        </a-col>
        
        <!-- 候选方 -->
        <a-col :span="12">
          <a-card title="候选方" class="user-card candidate-card">
            <template #extra>
              <a-tag color="purple">候选方</a-tag>
            </template>
            <user-profile-view :user="detail?.candidate" />
          </a-card>
        </a-col>
      </a-row>

      <!-- 匹配分析 -->
      <a-card title="匹配分析" class="mt-4">
        <a-descriptions bordered>
          <a-descriptions-item label="MV分差" :span="3">
            <span :class="{'success-text': detail?.isMvPass, 'error-text': !detail?.isMvPass}">
              {{ detail?.mvDiff }}分 ({{ detail?.isMvPass ? '合格' : '不合格' }})
            </span>
            <div class="desc">要求 |分差| ≤ 5</div>
          </a-descriptions-item>
          
          <a-descriptions-item label="性格匹配" :span="3">
             <span :class="{'success-text': detail?.isPersonalityPass, 'error-text': !detail?.isPersonalityPass}">
              {{ detail?.isPersonalityPass ? '合格' : '不合格' }}
            </span>
            <div class="desc" v-if="detail?.matchData?.overlapCount !== undefined">
              适合的性格重合度: {{ detail?.matchData?.overlapCount }} 项
            </div>
            <div class="desc" v-else>
              暂无详细数据
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { message } from 'ant-design-vue';
// 假设我们会抽离一个展示用户档案的组件，或者在这里简单展示
// 为了快速实现，我先定义一个局部组件 UserProfileView
import UserProfileView from './components/UserProfileView.vue';

const route = useRoute();
const router = useRouter();
const detailId = route.params.id as string;

const loading = ref(false);
const detail = ref<any>(null);

const fetchDetail = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`/matches/detail/${detailId}`);
    detail.value = res.data;
  } catch (error) {
    message.error('获取详情失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (detailId) {
    fetchDetail();
  }
});
</script>

<style scoped>
.match-detail-page {
  background: #f0f2f5;
  min-height: 100%;
  padding: 16px;
}
.mt-4 {
  margin-top: 16px;
}
.success-text {
  color: #52c41a;
  font-weight: bold;
}
.error-text {
  color: #ff4d4f;
  font-weight: bold;
}
.desc {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}
</style>

