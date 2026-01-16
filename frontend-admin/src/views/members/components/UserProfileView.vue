<template>
  <div class="user-profile-view" v-if="user">
    <div class="header">
      <a-avatar :size="64" :src="user.avatar || '/default-avatar.png'" />
      <div class="info">
        <div class="name">{{ getName() }}</div>
        <div class="meta">
          ID: {{ user.id }} | {{ getGender() }} | {{ getAge() }}岁
        </div>
      </div>
    </div>

    <a-divider style="margin: 12px 0" />

    <div class="section">
      <h4>基本信息</h4>
      <p>身高: {{ getHeight() }}cm</p>
      <p>学历: {{ getEducation() }}</p>
      <p>婚况: {{ getMarriage() }}</p>
    </div>

    <a-divider style="margin: 12px 0" />

    <div class="section">
      <h4>MV值</h4>
      <p class="score">{{ getMvScore() }}分</p>
    </div>

    <a-divider style="margin: 12px 0" />

    <div class="section">
      <h4>九型人格</h4>
      <div v-if="user.profile?.mvDetail?.personality?.label">
        {{ user.profile.mvDetail.personality.label }}
      </div>
      <!-- 如果没有 mvDetail，尝试从 assessment record 显示? 暂时只读 mvDetail 或者 profile 中的字段 -->
      <div v-else class="text-gray">暂无数据</div>
    </div>
  </div>
  <div v-else class="loading">
    <a-spin />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  user: any
}>();

const getName = () => props.user?.profile?.baseInfo?.name || props.user?.username || '-';
const getGender = () => props.user?.profile?.baseInfo?.gender || '-';
const getAge = () => props.user?.profile?.baseInfo?.age || props.user?.profile?.mvDetail?.age?.value || '-';
const getHeight = () => props.user?.profile?.baseInfo?.height || '-';
const getEducation = () => props.user?.profile?.baseInfo?.education || '-';
const getMarriage = () => props.user?.profile?.baseInfo?.marriage || '-';
const getMvScore = () => props.user?.profile?.mvScore ? Number(props.user.profile.mvScore).toFixed(1) : '未计算';
</script>

<style scoped>
.user-profile-view {
  padding: 12px;
}
.header {
  display: flex;
  gap: 16px;
  align-items: center;
}
.name {
  font-size: 18px;
  font-weight: bold;
}
.meta {
  color: #666;
  font-size: 13px;
}
.section h4 {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  border-left: 3px solid #1890ff;
  padding-left: 8px;
}
.score {
  font-size: 20px;
  color: #f5222d;
  font-weight: bold;
}
.text-gray {
  color: #999;
}
</style>

