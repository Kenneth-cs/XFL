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
      :scroll="{ x: 1200 }"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <!-- 匹配轨迹 -->
        <template v-if="column.key === 'initiatorName'">
          <span>{{ record.initiatorName }}</span>
        </template>
        <template v-if="column.key === 'targetName'">
          <span>{{ record.targetName }}</span>
        </template>
        <template v-if="column.key === 'myResult'">
          <a-tag :color="getMyResultColor(record)">{{ getMyResultText(record) }}</a-tag>
        </template>
        <template v-if="column.key === 'peerResult'">
          <a-tag :color="getPeerResultColor(record)">{{ getPeerResultText(record) }}</a-tag>
        </template>
        
        <!-- 约见轨迹 -->
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'myFeedback'">
          <span>{{ getMyFeedback(record) }}</span>
        </template>
        <template v-if="column.key === 'peerFeedback'">
          <span>{{ getPeerFeedback(record) }}</span>
        </template>
        
        <!-- 治疗轨迹 -->
        <template v-if="column.key === 'demand'">
          <span>{{ record.feedbackContent?.demand || '-' }}</span>
        </template>
        <template v-if="column.key === 'plan'">
          <span>{{ record.feedbackContent?.plan || '-' }}</span>
        </template>
        <template v-if="column.key === 'effect'">
          <span>{{ record.feedbackContent?.effect || '-' }}</span>
        </template>
        <template v-if="column.key === 'nextTime'">
          <span>{{ record.feedbackContent?.nextTime || '-' }}</span>
        </template>
        
        <!-- 操作 -->
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

        <a-form-item label="状态/结果" required v-if="type !== 3">
          <a-select v-model:value="formState.status">
            <a-select-option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- 动态表单项基于类型 -->
        <template v-if="type === 1"> <!-- 匹配轨迹 -->
           <a-form-item label="本方结果">
             <a-select v-model:value="formState.myResult">
               <a-select-option value="看中">看中</a-select-option>
               <a-select-option value="未看中">未看中</a-select-option>
               <a-select-option value="待反馈">待反馈</a-select-option>
             </a-select>
           </a-form-item>
           <a-form-item label="对方结果 (只读/对方填写)">
             <div class="readonly-text">{{ formState.peerResult || '暂无' }}</div>
           </a-form-item>
        </template>

        <template v-if="type === 2"> <!-- 约见轨迹 -->
           <a-form-item label="约见反馈">
             <a-textarea v-model:value="formState.myFeedback" :rows="3" />
           </a-form-item>
           <a-form-item label="对方反馈 (只读)">
             <div class="readonly-text">{{ formState.peerFeedback || '暂无' }}</div>
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
  feedbackContent: {} as any,
  viewerRole: undefined as string | undefined, // Track viewer's role when editing
  myResult: undefined as string | undefined, // For match track
  peerResult: undefined as string | undefined, // For match track (readonly)
  myFeedback: undefined as string | undefined, // For date track
  peerFeedback: undefined as string | undefined // For date track (readonly)
});

const columns = computed(() => {
  if (props.type === 1) { // 匹配轨迹
    return [
      { title: '时间', dataIndex: 'eventTime', key: 'eventTime', width: 160 },
      { title: '发起方', key: 'initiatorName', width: 120 },
      { title: '发起方ID', dataIndex: 'initiatorId', key: 'initiatorId', width: 120 },
      { title: '匹配方', key: 'targetName', width: 120 },
      { title: '匹配方ID', dataIndex: 'targetId', key: 'targetId', width: 120 },
      { title: '本方结果', key: 'myResult', width: 100 },
      { title: '对方结果', key: 'peerResult', width: 100 },
      { title: '记录人', dataIndex: 'createdBy', key: 'createdBy', width: 120 },
      { title: '操作', key: 'action', width: 80, fixed: 'right' }
    ];
  } else if (props.type === 2) { // 约见轨迹
    return [
      { title: '时间', dataIndex: 'eventTime', key: 'eventTime', width: 160 },
      { title: '发起方', key: 'initiatorName', width: 120 },
      { title: '发起方ID', dataIndex: 'initiatorId', key: 'initiatorId', width: 120 },
      { title: '约见方', key: 'targetName', width: 120 },
      { title: '约见方ID', dataIndex: 'targetId', key: 'targetId', width: 120 },
      { title: '约见进度', key: 'status', width: 100 },
      { title: '本方反馈', key: 'myFeedback', width: 120, ellipsis: true },
      { title: '对方反馈', key: 'peerFeedback', width: 120, ellipsis: true },
      { title: '记录人', dataIndex: 'createdBy', key: 'createdBy', width: 120 },
      { title: '操作', key: 'action', width: 80, fixed: 'right' }
    ];
  } else { // 治疗轨迹
    return [
      { title: '用户ID', dataIndex: 'initiatorId', key: 'initiatorId', width: 120 },
      { title: '用户姓名', key: 'initiatorName', width: 120 },
      { title: '服务时间', dataIndex: 'eventTime', key: 'eventTime', width: 160 },
      { title: '用户需求', key: 'demand', width: 150, ellipsis: true },
      { title: '服务方案', key: 'plan', width: 150, ellipsis: true },
      { title: '服务效果', key: 'effect', width: 120, ellipsis: true },
      { title: '服务老师', dataIndex: 'createdBy', key: 'createdBy', width: 120 },
      { title: '下次预约', key: 'nextTime', width: 160 },
      { title: '操作', key: 'action', width: 80, fixed: 'right' }
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
  if (!value || value.trim().length === 0) {
    searchResults.value = [];
    return;
  }
  
  searchingUser.value = true;
  try {
    const keyword = value.trim();
    
    // 智能判断搜索类型
    const isId = /^XFL\d+$/i.test(keyword); // XFL开头的ID格式（不区分大小写）
    const isPhone = /^1[3-9]\d{9}$/.test(keyword); // 标准手机号格式
    
    let params: any = { page: 1, limit: 20 };
    
    if (isId) {
      // 用户ID精确搜索
      params.userId = keyword.toUpperCase(); // 统一转大写
    } else if (isPhone) {
      // 手机号搜索
      params.phone = keyword;
    } else {
      // 姓名模糊搜索
      params.name = keyword;
    }
    
    const res = await axios.get('/users/app', { params });
    const users = res.items || res.data || [];
    
    searchResults.value = users.map((u: any) => ({
      id: u.id,
      name: u.profile?.baseInfo?.name || u.phone || '未命名'
    }));
    
    if (searchResults.value.length === 0) {
      message.warning('未找到匹配的用户');
    }
  } catch (error) {
    console.error('搜索用户失败:', error);
    message.error('搜索用户失败');
  } finally {
    searchingUser.value = false;
  }
};

const showAddModal = async () => {
  isEdit.value = false;
  formState.targetId = undefined;
  formState.eventTime = dayjs();
  formState.status = undefined;
  formState.feedbackContent = {};
  formState.viewerRole = 'initiator'; // New records are always created as initiator
  formState.myResult = undefined;
  formState.peerResult = undefined;
  formState.myFeedback = undefined;
  formState.peerFeedback = undefined;
  modalVisible.value = true;
  
  // 预加载一些用户供选择
  await loadInitialUsers();
};

const loadInitialUsers = async () => {
  searchingUser.value = true;
  try {
    const res = await axios.get('/users/app', {
      params: { page: 1, limit: 20 }
    });
    const users = res.items || res.data || [];
    searchResults.value = users.map((u: any) => ({
      id: u.id,
      name: u.profile?.baseInfo?.name || u.phone || '未命名'
    }));
  } catch (error) {
    console.error('加载用户列表失败:', error);
  } finally {
    searchingUser.value = false;
  }
};

const handleEdit = (record: any) => {
  isEdit.value = true;
  currentId.value = record.id;
  formState.targetId = record.targetId;
  formState.eventTime = dayjs(record.eventTime);
  formState.status = record.status;
  formState.feedbackContent = record.feedbackContent || {};
  formState.viewerRole = record.viewerRole; // Store the viewer's role
  
  // Extract my/peer data based on viewer role
  if (props.type === 1) { // Match track
    if (record.viewerRole === 'initiator') {
      formState.myResult = record.feedbackContent?.myResult;
      formState.peerResult = record.feedbackContent?.peerResult;
    } else {
      formState.myResult = record.feedbackContent?.peerResult;
      formState.peerResult = record.feedbackContent?.myResult;
    }
  } else if (props.type === 2) { // Date track
    if (record.viewerRole === 'initiator') {
      formState.myFeedback = record.feedbackContent?.feedback;
      formState.peerFeedback = record.feedbackContent?.peerFeedback;
    } else {
      formState.myFeedback = record.feedbackContent?.peerFeedback;
      formState.peerFeedback = record.feedbackContent?.feedback;
    }
  }
  
  // If editing, prepopulate search results with current target
  if (record.targetId && record.targetName) {
      searchResults.value = [{ id: record.targetId, name: record.targetName }];
  }
  modalVisible.value = true;
};

const handleModalOk = async () => {
  modalLoading.value = true;
  try {
    if (isEdit.value) {
      // Update operation: only send fields to be updated
      const updatePayload: any = {};
      
      if (formState.status !== undefined && formState.status !== null && props.type !== 3) {
        updatePayload.status = Number(formState.status);
      }
      
      if (formState.eventTime) {
        updatePayload.eventTime = dayjs(formState.eventTime).format('YYYY-MM-DDTHH:mm:ss');
      }
      
      // Build feedbackContent based on viewer role
      const feedbackContent: any = {};
      
      if (props.type === 1) { // Match track
        if (formState.viewerRole === 'initiator') {
          feedbackContent.myResult = formState.myResult;
        } else {
          feedbackContent.peerResult = formState.myResult;
        }
      } else if (props.type === 2) { // Date track
        if (formState.viewerRole === 'initiator') {
          feedbackContent.feedback = formState.myFeedback;
        } else {
          feedbackContent.peerFeedback = formState.myFeedback;
        }
      } else if (props.type === 3) { // Therapy track
        Object.assign(feedbackContent, formState.feedbackContent);
      }
      
      updatePayload.feedbackContent = feedbackContent;
      
      await axios.put(`/service-tracks/${currentId.value}`, updatePayload);
      message.success('更新成功');
    } else {
      // Create operation
      const createPayload: any = {
        initiatorId: props.userId,
        type: props.type,
        eventTime: formState.eventTime ? dayjs(formState.eventTime).format('YYYY-MM-DDTHH:mm:ss') : dayjs().format('YYYY-MM-DDTHH:mm:ss')
      };
      
      if (formState.targetId) {
        createPayload.targetId = formState.targetId;
      }
      if (formState.status !== undefined && formState.status !== null && props.type !== 3) {
        createPayload.status = Number(formState.status);
      }
      
      // Build feedbackContent for new record
      const feedbackContent: any = {};
      
      if (props.type === 1) {
        feedbackContent.myResult = formState.myResult || '待反馈';
      } else if (props.type === 2) {
        feedbackContent.feedback = formState.myFeedback || '';
      } else if (props.type === 3) {
        Object.assign(feedbackContent, formState.feedbackContent);
      }
      
      createPayload.feedbackContent = feedbackContent;
      
      await axios.post('/service-tracks', createPayload);
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

// 匹配轨迹：获取本方结果
const getMyResultText = (record: any) => {
  if (!record.feedbackContent) return '待反馈';
  // viewerRole === 'initiator' means I am the initiator
  if (record.viewerRole === 'initiator') {
    return record.feedbackContent.myResult || '待反馈';
  } else {
    // I am the target, so "my" result is stored in peerResult from initiator's perspective
    return record.feedbackContent.peerResult || '待反馈';
  }
};

const getMyResultColor = (record: any) => {
  const text = getMyResultText(record);
  if (text === '看中') return 'success';
  if (text === '未看中') return 'error';
  return 'default';
};

// 匹配轨迹：获取对方结果
const getPeerResultText = (record: any) => {
  if (!record.feedbackContent) return '待反馈';
  if (record.viewerRole === 'initiator') {
    return record.feedbackContent.peerResult || '待反馈';
  } else {
    return record.feedbackContent.myResult || '待反馈';
  }
};

const getPeerResultColor = (record: any) => {
  const text = getPeerResultText(record);
  if (text === '看中') return 'success';
  if (text === '未看中') return 'error';
  return 'default';
};

// 约见轨迹：获取本方反馈
const getMyFeedback = (record: any) => {
  if (!record.feedbackContent) return '-';
  if (record.viewerRole === 'initiator') {
    return record.feedbackContent.feedback || '-';
  } else {
    return record.feedbackContent.peerFeedback || '-';
  }
};

// 约见轨迹：获取对方反馈
const getPeerFeedback = (record: any) => {
  if (!record.feedbackContent) return '-';
  if (record.viewerRole === 'initiator') {
    return record.feedbackContent.peerFeedback || '-';
  } else {
    return record.feedbackContent.feedback || '-';
  }
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

