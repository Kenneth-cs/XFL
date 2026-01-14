<template>
  <div class="staff-list">
    <a-page-header
      title="人员列表"
      sub-title="查看和管理所有后台人员"
    />

    <a-space style="margin-bottom: 16px">
      <a-select v-model:value="filterRole" placeholder="筛选角色" style="width: 150px" @change="fetchStaff" allow-clear>
        <a-select-option value="matchmaker">普通红娘</a-select-option>
        <a-select-option value="manager">门店负责人</a-select-option>
        <a-select-option value="admin">门店老板</a-select-option>
        <a-select-option value="super_admin">超级管理员</a-select-option>
      </a-select>
      
      <a-select v-model:value="filterStatus" placeholder="筛选状态" style="width: 150px" @change="fetchStaff" allow-clear>
        <a-select-option :value="1">正常</a-select-option>
        <a-select-option :value="0">待审核</a-select-option>
        <a-select-option :value="-1">禁用</a-select-option>
      </a-select>
    </a-space>

    <a-table 
      :columns="columns" 
      :data-source="staffList" 
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
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusName(record.status) }}
          </a-tag>
        </template>
        
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button 
              v-if="canEditRole(record)"
              type="link" 
              size="small" 
              @click="handleEditRole(record)"
            >
              修改角色
            </a-button>
            <a-button 
              v-if="canEditRole(record)"
              type="link" 
              size="small"
              :danger="record.status === 1"
              @click="handleToggleStatus(record)"
            >
              {{ record.status === 1 ? '禁用' : '启用' }}
            </a-button>
            <a-button 
              v-if="isSuperAdmin"
              type="link" 
              size="small" 
              @click="handleResetPassword(record)"
            >
              重置密码
            </a-button>
            <span v-if="!canEditRole(record) && !isSuperAdmin" style="color: #999;">
              无操作权限
            </span>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 修改角色弹窗 -->
    <a-modal
      v-model:open="roleModalVisible"
      title="修改角色"
      @ok="handleRoleSubmit"
      @cancel="roleModalVisible = false"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="当前角色">
          <a-tag :color="getRoleColor(selectedUser?.role || '')">
            {{ getRoleName(selectedUser?.role || '') }}
          </a-tag>
        </a-form-item>
        <a-form-item label="新角色">
          <a-select v-model:value="newRole" style="width: 100%">
            <a-select-option 
              v-for="role in getAvailableRoles()" 
              :key="role.value" 
              :value="role.value"
            >
              {{ role.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import axios from 'axios';

interface StaffUser {
  id: string;
  username: string;
  phone?: string;
  role: string;
  storeId?: string;
  status: number;
  createdAt: string;
}

const loading = ref(false);
const staffList = ref<StaffUser[]>([]);
const roleModalVisible = ref(false);
const selectedUser = ref<StaffUser | null>(null);
const newRole = ref('');
const filterRole = ref();
const filterStatus = ref();

// 获取当前登录用户信息
const currentUser = computed(() => {
  const userStr = localStorage.getItem('admin_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
});

// 判断当前用户是否为超级管理员
const isSuperAdmin = computed(() => currentUser.value?.role === 'super_admin');

// 判断是否可以修改目标用户的角色
const canEditRole = (targetUser: StaffUser) => {
  if (!currentUser.value) return false;
  
  // 不能修改自己
  if (targetUser.id === currentUser.value.id) return false;
  
  // 超级管理员可以修改任何人（除了自己）
  if (isSuperAdmin.value) return true;
  
  // 门店老板只能修改本门店的负责人和红娘
  if (currentUser.value.role === 'admin') {
    // 必须是同一门店
    if (targetUser.storeId !== currentUser.value.storeId) return false;
    
    // 不能修改超级管理员和其他门店老板
    if (targetUser.role === 'super_admin' || targetUser.role === 'admin') return false;
    
    return true;
  }
  
  // 负责人和红娘没有权限
  return false;
};

// 获取可选择的角色列表（根据当前用户权限）
const getAvailableRoles = () => {
  if (isSuperAdmin.value) {
    // 超级管理员可以设置门店老板、负责人、红娘（不包括超级管理员，超级管理员只有一个预设账号）
    return [
      { value: 'matchmaker', label: '普通红娘' },
      { value: 'manager', label: '门店负责人' },
      { value: 'admin', label: '门店老板' }
    ];
  } else if (currentUser.value?.role === 'admin') {
    // 门店老板只能设置负责人和红娘
    return [
      { value: 'matchmaker', label: '普通红娘' },
      { value: 'manager', label: '门店负责人' }
    ];
  }
  return [];
};

const columns = [
  { title: '用户ID', dataIndex: 'id', key: 'id', width: 150 },
  { title: '姓名', dataIndex: 'username', key: 'username' },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '角色', key: 'role', width: 120 },
  { title: '所属门店', dataIndex: 'storeId', key: 'storeId', width: 100 },
  { title: '状态', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '操作', key: 'actions', width: 280, fixed: 'right' }
];

const getRoleName = (role: string) => {
  const map: Record<string, string> = {
    super_admin: '超级管理员',
    admin: '门店老板',
    manager: '门店负责人',
    matchmaker: '普通红娘'
  };
  return map[role] || role;
};

const getRoleColor = (role: string) => {
  const map: Record<string, string> = {
    super_admin: 'red',
    admin: 'purple',
    manager: 'cyan',
    matchmaker: 'blue'
  };
  return map[role] || 'default';
};

const getStatusName = (status: number) => {
  const map: Record<number, string> = {
    1: '正常',
    0: '待审核',
    '-1': '禁用'
  };
  return map[status] || '未知';
};

const getStatusColor = (status: number) => {
  const map: Record<number, string> = {
    1: 'green',
    0: 'orange',
    '-1': 'red'
  };
  return map[status] || 'default';
};

const fetchStaff = async () => {
  loading.value = true;
  try {
    const params: any = {};
    if (filterRole.value) params.role = filterRole.value;
    if (filterStatus.value !== undefined) params.status = filterStatus.value;
    
    const res = await axios.get('/users/sys', { params });
    staffList.value = res.data || res || [];
  } catch (error: any) {
    message.error(error.response?.data?.message || '加载人员列表失败');
  } finally {
    loading.value = false;
  }
};

const handleEditRole = (record: StaffUser) => {
  selectedUser.value = record;
  newRole.value = record.role;
  roleModalVisible.value = true;
};

const handleRoleSubmit = async () => {
  if (!selectedUser.value) return;
  
  try {
    await axios.patch(`/users/sys/${selectedUser.value.id}/role`, { role: newRole.value });
    message.success('角色修改成功');
    roleModalVisible.value = false;
    fetchStaff();
  } catch (error: any) {
    message.error(error.response?.data?.message || '操作失败');
  }
};

const handleToggleStatus = async (record: StaffUser) => {
  const newStatus = record.status === 1 ? -1 : 1;
  try {
    await axios.patch(`/users/sys/${record.id}/status`, { status: newStatus });
    message.success(newStatus === 1 ? '启用成功' : '禁用成功');
    fetchStaff();
  } catch (error: any) {
    message.error(error.response?.data?.message || '操作失败');
  }
};

const handleResetPassword = (record: StaffUser) => {
  Modal.confirm({
    title: '重置密码',
    content: `确定要将 ${record.username} 的密码重置为默认密码 123456 吗？`,
    onOk: async () => {
      try {
        await axios.patch(`/users/sys/${record.id}/reset-password`);
        message.success('密码已重置为 123456');
      } catch (error: any) {
        message.error(error.response?.data?.message || '操作失败');
      }
    }
  });
};

onMounted(() => {
  fetchStaff();
});
</script>

<style scoped>
.staff-list {
  background: #fff;
  padding: 24px;
  min-height: 100%;
}
</style>

