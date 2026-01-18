<template>
  <div class="match-detail-page">
    <a-page-header
      title="匹配详情"
      @back="() => router.back()"
      class="site-page-header"
    >
      <template #tags>
        <a-tag :color="detail?.resultStatus ? 'success' : 'error'">
          {{ detail?.resultStatus ? '匹配通过' : '匹配未通过' }}
        </a-tag>
      </template>
    </a-page-header>

    <div class="detail-content">
      <a-spin :spinning="loading">
        <!-- 匹配分析卡片 -->
        <a-card title="匹配分析报告" class="mb-4">
          <a-descriptions bordered :column="2">
            <a-descriptions-item label="MV值分差">
              <span :class="{'success-text': detail?.isMvPass, 'error-text': !detail?.isMvPass}">
                {{ detail?.mvDiff }}分 
                <span class="status-badge">{{ detail?.isMvPass ? '合格' : '不合格' }}</span>
              </span>
              <div class="desc-text">要求: |分差| ≤ 5</div>
            </a-descriptions-item>
            
            <a-descriptions-item label="性格匹配度">
               <span :class="{'success-text': detail?.isPersonalityPass, 'error-text': !detail?.isPersonalityPass}">
                <span class="status-badge">{{ detail?.isPersonalityPass ? '合格' : '不合格' }}</span>
              </span>
              <div class="desc-text" v-if="detail?.matchData?.overlapCount !== undefined">
                适合的性格重合项: <strong>{{ detail?.matchData?.overlapCount }}</strong> 项
              </div>
              <div class="desc-text" v-else>
                暂无详细数据
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- 双人对比 -->
        <a-row :gutter="24">
          <!-- 发起方 -->
          <a-col :span="12">
            <a-card class="user-card initiator-card" :bordered="false">
              <template #title>
                <span style="color: #1890ff; font-weight: bold;">发起方</span>
              </template>
              <div v-if="detail?.batch?.initiator">
                <user-profile-view :user="detail.batch.initiator" />
              </div>
              <div v-else class="empty-data">
                暂无发起人数据
              </div>
            </a-card>
          </a-col>
          
          <!-- 候选方 -->
          <a-col :span="12">
            <a-card class="user-card candidate-card" :bordered="false">
              <template #title>
                <span style="color: #722ed1; font-weight: bold;">候选方</span>
              </template>
              <div v-if="detail?.candidate">
                 <user-profile-view :user="detail.candidate" />
              </div>
              <div v-else class="empty-data">
                暂无候选人数据
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { message } from 'ant-design-vue';
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
    // 兼容处理：检查是否被拦截器解包
    detail.value = res.data || res;
    console.log('🔍 [MatchDetail] 详情数据:', detail.value);
    console.log('🔍 [MatchDetail] 发起方:', detail.value?.batch?.initiator);
    console.log('🔍 [MatchDetail] 候选方:', detail.value?.candidate);
  } catch (error) {
    console.error(error);
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
  padding: 24px;
}
.site-page-header {
  background: #fff;
  padding: 16px 24px;
  margin-bottom: 24px;
}
.success-text {
  color: #52c41a;
  font-weight: bold;
  font-size: 16px;
}
.error-text {
  color: #f5222d;
  font-weight: bold;
  font-size: 16px;
}
.desc-text {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
.status-badge {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  background-color: rgba(0,0,0,0.05);
}
.success-text .status-badge {
  color: #52c41a;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
}
.error-text .status-badge {
  color: #f5222d;
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
}

.user-card {
  height: 100%;
  border-top: 4px solid transparent;
}
.initiator-card {
  border-top-color: #1890ff;
}
.candidate-card {
  border-top-color: #722ed1;
}
.empty-data {
  padding: 20px;
  text-align: center;
  color: #999;
}
</style>