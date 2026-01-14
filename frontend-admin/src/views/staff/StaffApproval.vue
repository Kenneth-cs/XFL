<template>
  <div class="staff-approval">
    <a-page-header
      title="人员审核"
      sub-title="审核待审核的后台人员注册申请"
    />

    <a-table 
      :columns="columns" 
      :data-source="pendingUsers" 
      :loading="loading"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'role'">
          <a-tag :color="getRoleColor(record.role)">
            {{ getRoleName(record.role) }}
          </a-tag>
        </template>
        
        <template v-if="column.key === 'status'">
          <a-tag color="orange">待审核</a-tag>
        </template>
        
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button type="primary" size="small" @click="handleApprove(record, true)">
              通过
            </a-button>
            <a-button danger size="small" @click="handleApprove(record, false)">
              拒绝
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import axios from 'axios';

interface PendingUser {
  id: string;
  username: string;
  phone?: string;
  role: string;
  storeId: string;
  status: number;
  createdAt: string;
}

const loading = ref(false);
const pendingUsers = ref<PendingUser[]>([]);

const columns = [
  { title: '用户ID', dataIndex: 'id', key: 'id', width: 150 },
  { title: '姓名', dataIndex: 'username', key: 'username' },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '申请角色', key: 'role', width: 120 },
  { title: '所属门店', dataIndex: 'storeId', key: 'storeId', width: 100 },
  { title: '状态', key: 'status', width: 100 },
  { title: '申请时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '操作', key: 'actions', width: 180, fixed: 'right' }
];

const getRoleName = (role: string) => {
  const map: Record<string, string> = {
    matchmaker: '普通红娘',
    manager: '门店负责人',
    admin: '门店老板'
  };
  return map[role] || role;
};

const getRoleColor = (role: string) => {
  const map: Record<string, string> = {
    matchmaker: 'blue',
    manager: 'cyan',
    admin: 'purple'
  };
  return map[role] || 'default';
};

const fetchPendingUsers = async () => {
  loading.value = true;
  try {
    // 获取状态为 0 (待审核) 的用户
    const res = await axios.get('/users/sys', {
      params: { status: 0 }
    });
    pendingUsers.value = res.data || res || [];
  } catch (error: any) {
    message.error(error.response?.data?.message || '加载待审核人员失败');
  } finally {
    loading.value = false;
  }
};

const handleApprove = async (record: PendingUser, approve: boolean) => {
  try {
    await axios.patch(`/users/sys/${record.id}/approve`, { approve });
    message.success(approve ? '审核通过' : '已拒绝');
    fetchPendingUsers();
  } catch (error: any) {
    message.error(error.response?.data?.message || '操作失败');
  }
};

onMounted(() => {
  fetchPendingUsers();
});
</script>

<style scoped>
.staff-approval {
  background: #fff;
  padding: 24px;
  min-height: 100%;
}
</style>

