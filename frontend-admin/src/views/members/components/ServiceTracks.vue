<template>
  <div class="service-tracks">
    <div class="header-actions mb-4">
      <a-button type="primary" @click="showAddModal">新增记录</a-button>
    </div>

    <a-table 
      :columns="columns" 
      :data-source="data" 
      :loading="loading" 
      :pagination="pagination"
      @change="handleTableChange"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'target'">
          <span>{{ record.targetName || record.targetId }}</span>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
        </template>
      </template>
    </a-table>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      @ok="handleModalOk"
      :confirmLoading="modalLoading"
      width="600px"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item label="关联用户" required v-if="type !== 3">
          <a-select 
            v-model:value="formState.targetId" 
            show-search 
            placeholder="请输入ID或姓名搜索"
            :filter-option="false"
            @search="handleSearchUser"
            :loading="searchingUser"
          >
            <a-select-option v-for="user in searchResults" :key="user.id" :value="user.id">
              {{ user.name }} ({{ user.id }})
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="时间" required>
          <a-date-picker v-model:value="formState.eventTime" show-time style="width: 100%" />
        </a-form-item>

        <a-form-item label="状态/结果" required>
          <a-select v-model:value="formState.status">
            <a-select-option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- 动态表单项基于类型 -->
        <template v-if="type === 1"> <!-- 匹配轨迹 -->
           <a-form-item label="本方结果">
             <a-textarea v-model:value="formState.feedbackContent.myResult" :rows="2" />
           </a-form-item>
           <a-form-item label="对方结果 (只读/对方填写)">
             <div class="readonly-text">{{ formState.feedbackContent.peerResult || '暂无' }}</div>
           </a-form-item>
        </template>

        <template v-if="type === 2"> <!-- 约见轨迹 -->
           <a-form-item label="约见反馈">
             <a-textarea v-model:value="formState.feedbackContent.feedback" :rows="3" />
           </a-form-item>
           <a-form-item label="对方反馈 (只读)">
             <div class="readonly-text">{{ formState.feedbackContent.peerFeedback || '暂无' }}</div>
           </a-form-item>
        </template>

        <template v-if="type === 3"> <!-- 治疗轨迹 -->
           <a-form-item label="用户需求">
             <a-textarea v-model:value="formState.feedbackContent.demand" :rows="2" />
           </a-form-item>
           <a-form-item label="服务方案">
             <a-textarea v-model:value="formState.feedbackContent.plan" :rows="2" />
           </a-form-item>
           <a-form-item label="服务效果">
             <a-textarea v-model:value="formState.feedbackContent.effect" :rows="2" />
           </a-form-item>
           <a-form-item label="预约下次时间">
             <a-date-picker v-model:value="formState.feedbackContent.nextTime" show-time style="width: 100%" />
           </a-form-item>
        </template>

      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import dayjs from 'dayjs';

const props = defineProps<{
  userId: string;
  userName: string;
  type: number; // 1: 匹配, 2: 约见, 3: 治疗
}>();

const loading = ref(false);
const data = ref([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// Modal state
const modalVisible = ref(false);
const modalLoading = ref(false);
const isEdit = ref(false);
const currentId = ref('');
const searchingUser = ref(false);
const searchResults = ref<any[]>([]);

const modalTitle = computed(() => {
  const action = isEdit.value ? '编辑' : '新增';
  const typeMap: Record<number, string> = { 1: '匹配轨迹', 2: '约见轨迹', 3: '治疗轨迹' };
  return `${action}${typeMap[props.type] || '记录'}`;
});

const formState = reactive({
  targetId: undefined,
  eventTime: undefined,
  status: undefined,
  feedbackContent: {} as any
});

const columns = computed(() => {
  const base = [
    { title: '时间', dataIndex: 'eventTime', key: 'eventTime', width: 180 },
    { title: '记录人', dataIndex: 'createdBy', key: 'createdBy', width: 120 },
  ];
  
  if (props.type === 1) {
    return [
      ...base,
      { title: '匹配方', key: 'target', width: 150 },
      { title: '结果', key: 'status', width: 100 },
      { title: '操作', key: 'action', width: 100 }
    ];
  } else if (props.type === 2) {
    return [
      ...base,
      { title: '约见方', key: 'target', width: 150 },
      { title: '状态', key: 'status', width: 100 },
      { title: '操作', key: 'action', width: 100 }
    ];
  } else {
    return [
      ...base,
      { title: '服务内容', key: 'content', ellipsis: true },
      { title: '操作', key: 'action', width: 100 }
    ];
  }
});

const statusOptions = computed(() => {
  if (props.type === 1) {
    return [
      { label: '看中', value: 1 },
      { label: '未看中', value: 0 },
      { label: '待反馈', value: 2 }
    ];
  } else if (props.type === 2) {
    return [
      { label: '已约见', value: 1 },
      { label: '未约见', value: 0 },
      { label: '取消', value: 2 }
    ];
  }
  return [];
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/service-tracks', {
      params: {
        initiatorId: props.userId,
        type: props.type,
        page: pagination.current,
        limit: pagination.pageSize
      }
    });
    data.value = res.items || [];
    pagination.total = res.total || 0;
  } catch (error) {
    message.error('加载记录失败');
  } finally {
    loading.value = false;
  }
};

const handleSearchUser = async (value: string) => {
  if (!value) return;
  searchingUser.value = true;
  try {
    const res = await axios.get('/users/app', {
      params: { keyword: value, page: 1, limit: 10 } // Assuming backend supports keyword search
    });
    // Adapt to actual backend response structure
    const users = res.items || res.data || [];
    searchResults.value = users.map((u: any) => ({
      id: u.id,
      name: u.profile?.baseInfo?.name || u.phone
    }));
  } catch (error) {
    console.error(error);
  } finally {
    searchingUser.value = false;
  }
};

const showAddModal = () => {
  isEdit.value = false;
  formState.targetId = undefined;
  formState.eventTime = dayjs();
  formState.status = undefined;
  formState.feedbackContent = {};
  modalVisible.value = true;
};

const handleEdit = (record: any) => {
  isEdit.value = true;
  currentId.value = record.id;
  formState.targetId = record.targetId;
  formState.eventTime = dayjs(record.eventTime);
  formState.status = record.status;
  formState.feedbackContent = record.feedbackContent || {};
  // If editing, prepopulate search results with current target
  if (record.targetId && record.targetName) {
      searchResults.value = [{ id: record.targetId, name: record.targetName }];
  }
  modalVisible.value = true;
};

const handleModalOk = async () => {
  modalLoading.value = true;
  try {
    const payload: any = {
      initiatorId: props.userId,
      type: props.type,
      eventTime: formState.eventTime ? dayjs(formState.eventTime).format('YYYY-MM-DDTHH:mm:ss') : dayjs().format('YYYY-MM-DDTHH:mm:ss')
    };
    
    // Only include optional fields if they have values
    if (formState.targetId) {
      payload.targetId = formState.targetId;
    }
    if (formState.status !== undefined && formState.status !== null) {
      payload.status = Number(formState.status);
    }
    if (formState.feedbackContent && Object.keys(formState.feedbackContent).length > 0) {
      payload.feedbackContent = formState.feedbackContent;
    }

    if (isEdit.value) {
      await axios.put(`/service-tracks/${currentId.value}`, payload);
      message.success('更新成功');
    } else {
      await axios.post('/service-tracks', payload);
      message.success('创建成功');
    }
    modalVisible.value = false;
    fetchData();
  } catch (error) {
    console.error('Service track operation failed:', error);
    message.error('操作失败');
  } finally {
    modalLoading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
};

const getStatusText = (status: number) => {
  const opt = statusOptions.value.find(o => o.value === status);
  return opt ? opt.label : status;
};

const getStatusColor = (status: number) => {
  if (status === 1) return 'success';
  if (status === 0) return 'error';
  return 'default';
};

onMounted(() => {
  fetchData();
});

watch(() => props.userId, () => {
  fetchData();
});
</script>

<style scoped>
.readonly-text {
  background: #f5f5f5;
  padding: 5px 10px;
  border-radius: 4px;
  color: #666;
}
</style>

