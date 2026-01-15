<template>
  <div class="members-list">
    <a-page-header
      title="用户列表"
      sub-title="查看和管理前台用户档案"
    />

    <a-space style="margin-bottom: 16px" v-if="isSuperAdmin">
      <span>门店筛选：</span>
      <a-select v-model:value="filterStoreId" placeholder="选择门店" style="width: 200px" @change="fetchMembers" allow-clear>
        <a-select-option value="">全部门店</a-select-option>
        <a-select-option v-for="store in stores" :key="store.id" :value="store.id">
          {{ store.name }}
        </a-select-option>
      </a-select>
    </a-space>

    <a-table 
      :columns="columns" 
      :data-source="members" 
      :loading="loading"
      row-key="id"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
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
}

interface Store {
  id: string;
  name: string;
}

const loading = ref(false);
const members = ref<Member[]>([]);
const stores = ref<Store[]>([]);
const filterStoreId = ref('');

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
});

const columns = [
  { title: '用户ID', dataIndex: 'id', key: 'id', width: 150 },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '所属门店', dataIndex: 'storeId', key: 'storeId', width: 100 },
  { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '操作', key: 'actions', width: 150, fixed: 'right' }
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
    
    // 超管可以筛选门店
    if (isSuperAdmin.value && filterStoreId.value) {
      params.storeId = filterStoreId.value;
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

const viewProfile = (record: Member) => {
  router.push(`/members/detail/${record.id}`);
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

