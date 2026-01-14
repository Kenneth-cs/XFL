<template>
  <div class="members-match">
    <a-page-header
      title="智能匹配"
      sub-title="发起匹配和查看匹配结果"
    />

    <a-result
      status="info"
      title="智能匹配功能"
      sub-title="该功能将在第三阶段开发"
    >
      <template #extra>
        <a-descriptions title="功能规划" bordered>
          <a-descriptions-item label="发起匹配">为用户筛选候选匹配对象（基于年龄、身高、学历等）</a-descriptions-item>
          <a-descriptions-item label="MV匹配">差值 ≤ 5分则通过</a-descriptions-item>
          <a-descriptions-item label="九型人格匹配">基于性格匹配矩阵，一票否决逻辑</a-descriptions-item>
          <a-descriptions-item label="批次管理">按匹配时间分批次展示结果</a-descriptions-item>
          <a-descriptions-item label="结果查询">支持按发起方/候选方搜索历史记录</a-descriptions-item>
        </a-descriptions>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.members-match {
  background: #fff;
  padding: 24px;
  min-height: 100%;
}
</style>

