<template>
  <div class="stores-list">
    <a-page-header
      title="门店列表"
      sub-title="管理所有门店信息"
    >
      <template #extra>
        <a-button type="primary" @click="showCreateModal">
          <template #icon><plus-outlined /></template>
          新增门店
        </a-button>
      </template>
    </a-page-header>

    <a-table 
      :columns="columns" 
      :data-source="stores" 
      :loading="loading"
      row-key="id"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '正常' : '禁用' }}
          </a-tag>
        </template>
        
        <template v-if="column.key === 'mvTemplateId'">
          {{ getMvTemplateName(record.mvTemplateId) }}
        </template>
        
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button 
              type="link" 
              size="small"
              :danger="record.status === 1"
              @click="handleToggleStatus(record)"
            >
              {{ record.status === 1 ? '禁用' : '启用' }}
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 新增/编辑门店弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑门店' : '新增门店'"
      @ok="handleSubmit"
      @cancel="handleCancel"
      width="600px"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="门店名称" name="name" :rules="[{ required: true, message: '请输入门店名称' }]">
          <a-input v-model:value="formState.name" placeholder="请输入门店名称" />
        </a-form-item>
        
        <a-form-item label="MV计算方案" name="mvTemplateId">
          <a-select v-model:value="formState.mvTemplateId" placeholder="请选择MV计算方案">
            <a-select-option :value="1">广东周边</a-select-option>
            <a-select-option :value="2">江浙周边</a-select-option>
            <a-select-option :value="3">全国普适</a-select-option>
            <a-select-option :value="4">京沪</a-select-option>
            <a-select-option :value="5">东北新疆</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="联系人" name="contactPerson">
          <a-input v-model:value="formState.contactPerson" placeholder="请输入联系人姓名" />
        </a-form-item>
        
        <a-form-item label="联系电话" name="contactPhone">
          <a-input v-model:value="formState.contactPhone" placeholder="请输入联系电话" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import axios from 'axios';

interface Store {
  id: string;
  name: string;
  mvTemplateId: number;
  contactPerson?: string;
  contactPhone?: string;
  status: number;
  createdAt: string;
}

const loading = ref(false);
const stores = ref<Store[]>([]);
const modalVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();

const formState = reactive({
  id: '',
  name: '',
  mvTemplateId: 3,
  contactPerson: '',
  contactPhone: ''
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

const columns = [
  { title: '门店ID', dataIndex: 'id', key: 'id', width: 120 },
  { title: '门店名称', dataIndex: 'name', key: 'name' },
  { title: 'MV方案', key: 'mvTemplateId', width: 120 },
  { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson', width: 100 },
  { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 130 },
  { title: '状态', key: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '操作', key: 'actions', width: 150, fixed: 'right' }
];

const getMvTemplateName = (id: number) => {
  const map: Record<number, string> = {
    1: '广东周边',
    2: '江浙周边',
    3: '全国普适',
    4: '京沪',
    5: '东北新疆'
  };
  return map[id] || '未知';
};

const fetchStores = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/stores');
    stores.value = res.data || res || [];
  } catch (error: any) {
    message.error(error.response?.data?.message || '加载门店列表失败');
  } finally {
    loading.value = false;
  }
};

const showCreateModal = () => {
  isEdit.value = false;
  Object.assign(formState, {
    id: '',
    name: '',
    mvTemplateId: 3,
    contactPerson: '',
    contactPhone: ''
  });
  modalVisible.value = true;
};

const handleEdit = (record: Store) => {
  isEdit.value = true;
  Object.assign(formState, record);
  modalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;
    
    if (isEdit.value) {
      await axios.patch(`/stores/${formState.id}`, formState);
      message.success('更新成功');
    } else {
      await axios.post('/stores', formState);
      message.success('创建成功');
    }
    
    modalVisible.value = false;
    fetchStores();
  } catch (error: any) {
    message.error(error.response?.data?.message || '操作失败');
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  modalVisible.value = false;
  formRef.value.resetFields();
};

const handleToggleStatus = async (record: Store) => {
  try {
    await axios.patch(`/stores/${record.id}/toggle-status`);
    message.success(record.status === 1 ? '禁用成功' : '启用成功');
    fetchStores();
  } catch (error: any) {
    message.error(error.response?.data?.message || '操作失败');
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};

onMounted(() => {
  fetchStores();
});
</script>

<style scoped>
.stores-list {
  background: #fff;
  padding: 24px;
  min-height: 100%;
}
</style>

