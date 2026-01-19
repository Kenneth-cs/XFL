<template>
  <div class="members-list">
    <a-page-header
      title="用户列表"
      sub-title="查看和管理前台用户档案"
    />

    <!-- 搜索区域 -->
    <a-card style="margin-bottom: 16px">
      <a-form layout="inline">
        <a-form-item label="姓名">
          <a-input 
            v-model:value="searchForm.name" 
            placeholder="请输入姓名" 
            style="width: 200px"
            allow-clear
            @pressEnter="handleSearch"
          />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input 
            v-model:value="searchForm.phone" 
            placeholder="请输入手机号" 
            style="width: 200px"
            allow-clear
            @pressEnter="handleSearch"
          />
        </a-form-item>
        <a-form-item label="门店" v-if="isSuperAdmin">
          <a-select 
            v-model:value="searchForm.storeId" 
            placeholder="选择门店" 
            style="width: 200px" 
            allow-clear
          >
            <a-select-option value="">全部门店</a-select-option>
            <a-select-option v-for="store in stores" :key="store.id" :value="store.id">
              {{ store.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              搜索
            </a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-table 
      :columns="columns" 
      :data-source="members" 
      :loading="loading"
      row-key="id"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: 1200 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <span>{{ record.profile?.baseInfo?.name || '-' }}</span>
        </template>
        <template v-if="column.key === 'age'">
          <span>{{ calculateAge(record.profile?.baseInfo?.birthday) }}</span>
        </template>
        <template v-if="column.key === 'gender'">
          <a-tag :color="record.profile?.baseInfo?.gender === '男' ? 'blue' : 'pink'">
            {{ record.profile?.baseInfo?.gender || '-' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'marriage'">
          <span>{{ record.profile?.baseInfo?.marriage || '-' }}</span>
        </template>
        <template v-if="column.key === 'serviceStatus'">
          <a-tag :color="getServiceStatusColor(record)">
            {{ getServiceStatusText(record) }}
          </a-tag>
        </template>
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" size="small" @click="viewProfile(record)">查看档案</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const userInfo = JSON.parse(localStorage.getItem('admin_user') || '{}');
const isSuperAdmin = computed(() => userInfo.role === 'super_admin');

interface Member {
  id: string;
  phone: string;
  storeId: string;
  createdAt: string;
  profile?: {
    baseInfo?: {
      name?: string;
      birthday?: string;
      gender?: string;
      marriage?: string;
    };
    extInfo?: {
      serviceStartDate?: string;
      serviceEndDate?: string;
    };
  };
}

interface Store {
  id: string;
  name: string;
}

const loading = ref(false);
const members = ref<Member[]>([]);
const stores = ref<Store[]>([]);

const searchForm = reactive({
  name: '',
  phone: '',
  storeId: ''
});

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
});

const columns = [
  { title: '用户ID', dataIndex: 'id', key: 'id', width: 130 },
  { title: '姓名', key: 'name', width: 100 },
  { title: '岁数', key: 'age', width: 80 },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 120 },
  { title: '性别', key: 'gender', width: 80 },
  { title: '婚况', key: 'marriage', width: 100 },
  { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
  { title: '服务状态', key: 'serviceStatus', width: 120 },
  { title: '操作', key: 'actions', width: 120, fixed: 'right' }
];

const fetchStores = async () => {
  try {
    const res = await axios.get('/stores');
    stores.value = res.data || res || [];
  } catch (error: any) {
    console.error('加载门店列表失败', error);
  }
};

const fetchMembers = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: pagination.current,
      limit: pagination.pageSize
    };
    
    // 添加搜索条件
    if (searchForm.name) {
      params.name = searchForm.name;
    }
    if (searchForm.phone) {
      params.phone = searchForm.phone;
    }
    
    // 超管可以筛选门店
    if (isSuperAdmin.value && searchForm.storeId) {
      params.storeId = searchForm.storeId;
    }
    
    const res = await axios.get('/users/app', { params });
    const data = res.data || res;
    members.value = data.data || data || [];
    pagination.total = data.total || 0;
  } catch (error: any) {
    message.error(error.response?.data?.message || '加载用户列表失败');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchMembers();
};

const handleSearch = () => {
  pagination.current = 1; // 重置到第一页
  fetchMembers();
};

const handleReset = () => {
  searchForm.name = '';
  searchForm.phone = '';
  searchForm.storeId = '';
  pagination.current = 1;
  fetchMembers();
};

const viewProfile = (record: Member) => {
  router.push(`/members/detail/${record.id}`);
};

// 计算年龄
const calculateAge = (birthday: string | undefined) => {
  if (!birthday) return '-';
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? `${age}岁` : '-';
};

// 获取服务状态文本
const getServiceStatusText = (record: any) => {
  const extInfo = record.profile?.extInfo;
  if (!extInfo) return '未开始';
  
  const startDate = extInfo.serviceStartDate;
  const endDate = extInfo.serviceEndDate;
  
  if (!startDate) return '未开始';
  
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  if (end && now > end) return '已结束';
  if (now >= start && (!end || now <= end)) return '服务中';
  return '未开始';
};

// 获取服务状态颜色
const getServiceStatusColor = (record: any) => {
  const status = getServiceStatusText(record);
  if (status === '服务中') return 'green';
  if (status === '已结束') return 'default';
  return 'orange';
};

onMounted(() => {
  if (isSuperAdmin.value) {
    fetchStores();
  }
  fetchMembers();
});
</script>

<style scoped>
.members-list {
  background: #fff;
  padding: 24px;
  min-height: 100%;
}
</style>

