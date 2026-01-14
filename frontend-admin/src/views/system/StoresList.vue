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
            <a-button 
              type="link" 
              size="small"
              danger
              @click="handleDelete(record)"
            >
              删除
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
      width="800px"
      :body-style="{ maxHeight: '70vh', overflowY: 'auto' }"
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
        
        <a-form-item 
          label="MV计算方案" 
          name="mvTemplateId" 
          :rules="[{ required: true, message: '请选择MV计算方案' }]"
        >
          <a-select 
            v-model:value="formState.mvTemplateId" 
            placeholder="请选择MV计算方案"
          >
            <a-select-option v-for="template in mvTemplates" :key="template.id" :value="template.id">
              <div>
                <div>{{ template.name }}</div>
                <div style="font-size: 12px; color: #999;">{{ template.description }}</div>
              </div>
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="营业执照名称" name="businessLicenseName">
          <a-input v-model:value="formState.businessLicenseName" placeholder="请输入营业执照名称" />
        </a-form-item>

        <a-form-item label="统一社会信用代码" name="creditCode">
          <a-input v-model:value="formState.creditCode" placeholder="请输入统一社会信用代码（18位）" maxlength="18" />
        </a-form-item>

        <a-form-item label="省份" name="province">
          <a-input v-model:value="formState.province" placeholder="请输入省份" />
        </a-form-item>

        <a-form-item label="市" name="city">
          <a-input v-model:value="formState.city" placeholder="请输入市" />
        </a-form-item>

        <a-form-item label="区" name="district">
          <a-input v-model:value="formState.district" placeholder="请输入区" />
        </a-form-item>

        <a-form-item label="详细地址" name="address">
          <a-input v-model:value="formState.address" placeholder="请输入详细地址" />
        </a-form-item>
        
        <a-form-item label="联系人" name="contactPerson">
          <a-input v-model:value="formState.contactPerson" placeholder="请输入联系人姓名" />
        </a-form-item>
        
        <a-form-item label="联系方式" name="contactPhone">
          <a-input v-model:value="formState.contactPhone" placeholder="请输入联系电话" />
        </a-form-item>

        <a-form-item label="合同号" name="contractNumber">
          <a-input v-model:value="formState.contractNumber" placeholder="请输入合同号" />
        </a-form-item>

        <a-form-item label="签约时间" name="contractStartDate">
          <a-date-picker 
            v-model:value="formState.contractStartDate" 
            placeholder="请选择签约时间"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </a-form-item>

        <a-form-item label="到期时间" name="contractEndDate">
          <a-date-picker 
            v-model:value="formState.contractEndDate" 
            placeholder="请选择到期时间"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import axios from 'axios';

interface Store {
  id: string;
  name: string;
  mvTemplateId: number;
  businessLicenseName?: string;
  creditCode?: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  contactPerson?: string;
  contactPhone?: string;
  contractNumber?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  status: number;
  createdAt: string;
}

interface MvTemplate {
  id: number;
  code: string;
  name: string;
  description: string;
  region: string;
}

const loading = ref(false);
const stores = ref<Store[]>([]);
const mvTemplates = ref<MvTemplate[]>([]);
const modalVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();

const formState = reactive({
  id: '',
  name: '',
  mvTemplateId: undefined as number | undefined,
  businessLicenseName: '',
  creditCode: '',
  province: '',
  city: '',
  district: '',
  address: '',
  contactPerson: '',
  contactPhone: '',
  contractNumber: '',
  contractStartDate: '',
  contractEndDate: ''
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

const columns = [
  { title: '门店ID', dataIndex: 'id', key: 'id', width: 120 },
  { title: '门店名称', dataIndex: 'name', key: 'name' },
  { title: 'MV计算方案', key: 'mvTemplateId', width: 180 },
  { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson', width: 100 },
  { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 130 },
  { title: '状态', key: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '操作', key: 'actions', width: 200, fixed: 'right' }
];

const getMvTemplateName = (id: number) => {
  const template = mvTemplates.value.find(t => t.id === id);
  return template ? template.name : `未知方案(${id})`;
};

// 获取MV方案列表
const fetchMvTemplates = async () => {
  try {
    const res = await axios.get('/stores/mv-templates/list');
    mvTemplates.value = res;
  } catch (error: any) {
    console.error('获取MV方案列表失败:', error);
  }
};

const fetchStores = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/stores');
    stores.value = res;
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
    mvTemplateId: undefined,
    businessLicenseName: '',
    creditCode: '',
    province: '',
    city: '',
    district: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
    contractNumber: '',
    contractStartDate: '',
    contractEndDate: ''
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
    
    // 过滤掉空字符串和undefined的字段，只保留有值的字段
    const submitData: any = {
      name: formState.name,
      mvTemplateId: formState.mvTemplateId,
    };
    
    // 只添加非空字段
    if (formState.businessLicenseName) submitData.businessLicenseName = formState.businessLicenseName;
    if (formState.creditCode) submitData.creditCode = formState.creditCode;
    if (formState.province) submitData.province = formState.province;
    if (formState.city) submitData.city = formState.city;
    if (formState.district) submitData.district = formState.district;
    if (formState.address) submitData.address = formState.address;
    if (formState.contactPerson) submitData.contactPerson = formState.contactPerson;
    if (formState.contactPhone) submitData.contactPhone = formState.contactPhone;
    if (formState.contractNumber) submitData.contractNumber = formState.contractNumber;
    if (formState.contractStartDate) submitData.contractStartDate = formState.contractStartDate;
    if (formState.contractEndDate) submitData.contractEndDate = formState.contractEndDate;
    
    if (isEdit.value) {
      await axios.patch(`/stores/${formState.id}`, submitData);
      message.success('更新成功');
    } else {
      await axios.post('/stores', submitData);
      message.success('创建成功');
    }
    
    modalVisible.value = false;
    fetchStores();
  } catch (error: any) {
    console.error('提交失败:', error);
    const errorMsg = error.response?.data?.message || error.message || '操作失败';
    message.error(errorMsg);
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

const handleDelete = (record: Store) => {
  Modal.confirm({
    title: '确认删除',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确定要删除门店"${record.name}"吗？删除后可能影响该门店下的所有用户数据。`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        await axios.delete(`/stores/${record.id}`);
        message.success('删除成功');
        fetchStores();
      } catch (error: any) {
        message.error(error.response?.data?.message || '删除失败');
      }
    },
  });
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};

onMounted(() => {
  fetchMvTemplates();
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

