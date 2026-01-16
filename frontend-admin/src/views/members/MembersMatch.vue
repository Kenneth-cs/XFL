<template>
  <div class="members-match">
    <a-page-header
      title="智能匹配"
      sub-title="基于MV值与九型人格的精准匹配"
    >
      <template #extra>
        <a-button type="primary" @click="showInitiateModal">发起匹配</a-button>
      </template>
    </a-page-header>

    <!-- 筛选区域 -->
    <a-card class="mb-4">
      <a-form layout="inline">
        <a-form-item label="发起方姓名">
          <a-input v-model:value="searchForm.initiatorName" placeholder="输入姓名模糊查询" allow-clear />
        </a-form-item>
        <a-form-item label="发起方ID">
          <a-input v-model:value="searchForm.initiatorId" placeholder="输入用户ID" allow-clear />
        </a-form-item>
        <a-form-item label="发起方手机号">
          <a-input v-model:value="searchForm.initiatorPhone" placeholder="输入手机号模糊查询" allow-clear />
        </a-form-item>
        <a-form-item label="被发起方姓名">
          <a-input v-model:value="searchForm.candidateName" placeholder="输入姓名模糊查询" allow-clear />
        </a-form-item>
        <a-form-item label="被发起方ID">
          <a-input v-model:value="searchForm.candidateId" placeholder="输入用户ID" allow-clear />
        </a-form-item>
        <a-form-item label="被发起方手机号">
          <a-input v-model:value="searchForm.candidatePhone" placeholder="输入手机号模糊查询" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 匹配结果列表 -->
    <a-spin :spinning="loading">
      <div class="match-list">
        <a-empty v-if="!loading && batches.length === 0" description="暂无匹配记录" />
        
        <div v-for="batch in batches" :key="batch.id" class="match-batch-card">
        <!-- 批次头部 -->
        <div class="batch-header">
          <div class="batch-time">
            <ClockCircleOutlined /> 匹配时间：{{ formatTime(batch.createdAt) }}
          </div>
          <div class="batch-id">批次ID: {{ batch.id }}</div>
        </div>

        <!-- 发起方信息 -->
        <div class="initiator-section">
          <div class="section-label">发起方：</div>
          <div class="user-info">
            <span class="user-name">{{ getProfileName(batch.initiator) }}</span>
            <span class="user-gender">
              <ManOutlined v-if="getGender(batch.initiator) === '男'" style="color: #1890ff" />
              <WomanOutlined v-else style="color: #eb2f96" />
            </span>
            <span class="user-id">(ID: {{ batch.initiatorId }})</span>
            <span class="user-mv">MV: {{ getMvScore(batch.initiator) }}</span>
          </div>
        </div>

        <!-- 候选人列表 -->
        <a-table 
          :dataSource="batch.details" 
          :columns="columns" 
          :pagination="false" 
          rowKey="id"
          size="middle"
          class="candidates-table"
        >
          <!-- 候选人信息 -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'candidate'">
              <div class="candidate-info">
                <span class="name">{{ getProfileName(record.candidate) }}</span>
                <span class="id">(ID: {{ record.candidateId }})</span>
              </div>
            </template>

            <!-- 幸福力圆环 (占位) -->
            <template v-else-if="column.key === 'happiness'">
              <span style="color: #999; font-size: 12px;">(圆环图)</span>
            </template>

            <!-- MV匹配结果 -->
            <template v-else-if="column.key === 'mvMatch'">
              <div class="match-result">
                <a-tag :color="record.isMvPass ? 'success' : 'error'">
                  {{ record.isMvPass ? '通过' : '不通过' }}
                </a-tag>
                <div class="score-diff">分差: {{ record.mvDiff > 0 ? '+' : '' }}{{ record.mvDiff }}</div>
              </div>
            </template>

            <!-- 九型人格匹配结果 -->
            <template v-else-if="column.key === 'enneagramMatch'">
              <div class="match-result">
                <a-tag :color="record.isPersonalityPass ? 'success' : 'error'">
                  {{ record.isPersonalityPass ? '通过' : '不通过' }}
                </a-tag>
                <div class="overlap-count">重合度: {{ record.matchData?.overlapCount || 0 }}项</div>
              </div>
            </template>

            <!-- 操作 -->
            <template v-else-if="column.key === 'action'">
              <a-button type="link" size="small" @click="viewDetail(record)">查看详情</a-button>
            </template>
          </template>
        </a-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="total > 0">
        <a-pagination
          v-model:current="page"
          v-model:pageSize="limit"
          :total="total"
          @change="handleSearch"
          show-size-changer
        />
      </div>
    </div>
    </a-spin>

    <!-- 发起匹配弹窗 -->
    <a-modal
      v-model:visible="initiateModalVisible"
      title="发起智能匹配"
      width="600px"
      @ok="handleInitiateMatch"
      :confirmLoading="initiating"
    >
      <a-form layout="vertical">
        <!-- 步骤1: 选择发起人 -->
        <a-form-item label="选择发起人" required>
          <a-select
            v-model:value="initiateForm.initiatorId"
            show-search
            placeholder="输入姓名或手机号搜索"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="fetchingUser ? undefined : null"
            @search="searchUser"
            @change="handleUserSelect"
          >
            <template v-if="fetchingUser" #notFoundContent>
              <a-spin size="small" />
            </template>
            <a-select-option v-for="user in searchUsers" :key="user.id" :value="user.id">
              {{ user.name }}（{{ user.phone }}）
            </a-select-option>
          </a-select>
          
          <div v-if="selectedUser" class="selected-user-info">
            <p>已选: {{ selectedUser.name }} ({{ selectedUser.gender }}, {{ selectedUser.age }}岁, {{ selectedUser.education }})</p>
            <p>MV分: {{ selectedUser.mvScore || '未计算' }}</p>
          </div>
        </a-form-item>

        <a-divider />

        <!-- 步骤2: 筛选条件 -->
        <p class="section-title">候选人筛选条件</p>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="年龄区间">
              <div class="range-input">
                <a-input-number v-model:value="initiateForm.criteria.ageMin" placeholder="最小" style="width: 45%" />
                <span class="separator">-</span>
                <a-input-number v-model:value="initiateForm.criteria.ageMax" placeholder="最大" style="width: 45%" />
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="身高区间 (cm)">
              <div class="range-input">
                <a-input-number v-model:value="initiateForm.criteria.heightMin" placeholder="最低" style="width: 45%" />
                <span class="separator">-</span>
                <a-input-number v-model:value="initiateForm.criteria.heightMax" placeholder="最高" style="width: 45%" />
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="学历要求">
              <div class="range-input">
                <a-select v-model:value="initiateForm.criteria.educationMin" placeholder="最低学历" style="width: 45%">
                  <a-select-option v-for="opt in educationOptions" :key="opt" :value="opt">{{ opt }}</a-select-option>
                </a-select>
                <span class="separator">至</span>
                <a-select v-model:value="initiateForm.criteria.educationMax" placeholder="最高学历" style="width: 45%">
                  <a-select-option v-for="opt in educationOptions" :key="opt" :value="opt">{{ opt }}</a-select-option>
                </a-select>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { ClockCircleOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

const router = useRouter();

// 列表数据
const loading = ref(false);
const batches = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(10);

const searchForm = reactive({
  initiatorName: '',
  initiatorId: '',
  initiatorPhone: '',
  candidateName: '',
  candidateId: '',
  candidatePhone: ''
});

// 表格列定义
const columns = [
  { title: '候选人', key: 'candidate', width: 200 },
  // { title: '幸福力', key: 'happiness', width: 100 }, // 暂未实现圆环图微缩
  { title: 'MV匹配', key: 'mvMatch', width: 150 },
  { title: '性格匹配', key: 'enneagramMatch', width: 150 },
  { title: '操作', key: 'action', width: 100, align: 'right' }
];

// 发起匹配相关
const initiateModalVisible = ref(false);
const initiating = ref(false);
const fetchingUser = ref(false);
const searchUsers = ref<any[]>([]);
const selectedUser = ref<any>(null);

const initiateForm = reactive({
  initiatorId: undefined,
  criteria: {
    ageMin: undefined,
    ageMax: undefined,
    heightMin: undefined,
    heightMax: undefined,
    educationMin: undefined,
    educationMax: undefined
  }
});

const educationOptions = ['大专以下', '大专', '二本', '普通一本', '211大学', '985或更高'];

// 获取列表
const fetchMatches = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/matches', {
      params: {
        ...searchForm,
        page: page.value,
        limit: limit.value
      }
    });
    const data = res.data || res;
    batches.value = data.items || [];
    total.value = data.total || 0;
  } catch (error) {
    console.error('获取匹配列表失败', error);
    message.error('获取匹配列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  page.value = 1;
  fetchMatches();
};

const handleReset = () => {
  Object.keys(searchForm).forEach(key => (searchForm as any)[key] = '');
  handleSearch();
};

// 发起匹配
const showInitiateModal = () => {
  // 权限控制：超级管理员不能操作
  const userInfo = JSON.parse(localStorage.getItem('admin_user') || '{}');
  if (userInfo.role === 'super_admin') {
    message.warning('请切换对应门店账号进行操作');
    return;
  }

  initiateModalVisible.value = true;
  initiateForm.initiatorId = undefined;
  selectedUser.value = null;
  // 重置条件
  initiateForm.criteria = {
    ageMin: undefined, ageMax: undefined,
    heightMin: undefined, heightMax: undefined,
    educationMin: undefined, educationMax: undefined
  };
};

const searchUser = async (value: string) => {
  if (!value) return;
  fetchingUser.value = true;
  searchUsers.value = [];
  try {
    // 使用前台用户列表接口
    const res = await axios.get('/users/app', { params: { page: 1, limit: 50 } });
    
    // 🚨 健壮性修复：兼容多种响应结构
    // 1. 标准 Axios + 后端包裹: res.data.data
    // 2. 拦截器解包后: res.data
    // 3. 直接返回数组: res.data
    let allUsers: any[] = [];
    const body = res.data || res; // 获取响应体
    
    if (Array.isArray(body)) {
      allUsers = body;
    } else if (Array.isArray(body.data)) {
      allUsers = body.data;
    } else if (Array.isArray(body.items)) {
      allUsers = body.items;
    }

    console.log('🔍 [Debug] 响应体结构 keys:', Object.keys(body));
    console.log('🔍 [Debug] 提取到的用户列表长度:', allUsers.length);

    if (allUsers.length > 0) {
      console.log('🔍 [Debug] 第一个用户示例:', allUsers[0]);
    } else {
      console.warn('⚠️ [Debug] 未能提取到用户数据，请检查响应结构');
    }

    // 在前端过滤匹配的用户（姓名、手机号、用户ID）
    const filtered = allUsers.filter((u: any) => {
      const name = String(u.profile?.baseInfo?.name || '');
      const phone = String(u.phone || '');
      const userId = String(u.id || '');
      const searchValue = String(value).toLowerCase();
      
      const match = name.toLowerCase().includes(searchValue) || 
                    phone.includes(searchValue) || 
                    userId.toLowerCase().includes(searchValue);
      
      console.log(`🔍 匹配检查: ${name} / ${phone} / ${userId} -> ${match}`);
      return match;
    });
    
    searchUsers.value = filtered.map((u: any) => ({
      id: u.id,
      name: u.profile?.baseInfo?.name || '未命名',
      phone: u.phone,
      gender: u.profile?.baseInfo?.gender,
      age: u.profile?.baseInfo?.age,
      education: u.profile?.baseInfo?.education,
      mvScore: u.profile?.mvScore
    }));
  } catch (error) {
    console.error(error);
    message.error('搜索用户失败');
  } finally {
    fetchingUser.value = false;
  }
};

const handleUserSelect = (val: string) => {
  selectedUser.value = searchUsers.value.find(u => u.id === val);
};

const handleInitiateMatch = async () => {
  if (!initiateForm.initiatorId) {
    message.warning('请选择发起人');
    return;
  }
  
  initiating.value = true;
  try {
    const res = await axios.post('/matches/initiate', {
      initiatorId: initiateForm.initiatorId,
      criteria: initiateForm.criteria
    });
    
    message.success(`匹配完成，共找到 ${res.data.count || 0} 位候选人`);
    initiateModalVisible.value = false;
    fetchMatches();
  } catch (error: any) {
    message.error(error.response?.data?.message || '发起匹配失败');
  } finally {
    initiating.value = false;
  }
};

// 辅助函数
const formatTime = (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss');

const getProfileName = (user: any) => {
  return user?.profile?.baseInfo?.name || user?.username || '未知用户';
};

const getGender = (user: any) => {
  return user?.profile?.baseInfo?.gender;
};

const getMvScore = (user: any) => {
  return user?.profile?.mvScore ? Number(user.profile.mvScore).toFixed(1) : '-';
};

const viewDetail = (record: any) => {
  // TODO: 跳转详情
  // 详情页应该显示 双方信息
  // 路由: /matches/detail/:id (record.id is matchDetail id)
  // 暂时先跳转到候选人档案? 不，需求是对比详情。
  // 我们需要一个新的详情页
  // router.push({ name: 'MatchDetail', params: { id: record.id } });
  message.info('详情页开发中');
};

onMounted(() => {
  fetchMatches();
});
</script>

<style scoped>
.members-match {
  background: #f0f2f5;
  min-height: 100%;
}
.mb-4 {
  margin-bottom: 16px;
}
.match-batch-card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
}
.batch-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: bold;
  color: #52c41a; /* 绿色醒目 */
  font-size: 16px;
}
.batch-id {
  color: #999;
  font-size: 12px;
  font-weight: normal;
}
.initiator-section {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 4px;
}
.section-label {
  font-weight: bold;
  margin-right: 12px;
}
.user-info {
  display: flex;
  gap: 12px;
  align-items: center;
}
.user-name {
  font-size: 16px;
  font-weight: 500;
}
.user-id, .user-mv {
  color: #666;
  font-size: 13px;
}
.candidates-table {
  /* :deep(.ant-table-thead > tr > th) {
    background: #fafafa;
  } */
}
.candidate-info {
  display: flex;
  flex-direction: column;
}
.candidate-info .name {
  font-weight: 500;
}
.candidate-info .id {
  font-size: 12px;
  color: #999;
}
.match-result {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.score-diff, .overlap-count {
  font-size: 12px;
  color: #666;
}
.range-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.separator {
  margin: 0 8px;
  color: #999;
}
.selected-user-info {
  margin-top: 8px;
  padding: 8px;
  background: #e6f7ff;
  border-radius: 4px;
  font-size: 12px;
  color: #1890ff;
}
.selected-user-info p {
  margin: 0;
}
</style>
