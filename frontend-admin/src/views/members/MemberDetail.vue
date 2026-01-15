<template>
  <div class="member-detail">
    <a-page-header
      title="会员档案详情"
      @back="() => router.back()"
    >
      <template #extra>
        <a-button type="primary" @click="handleSave" :loading="saving">保存档案</a-button>
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <a-tabs v-model:activeKey="activeTab">
        <!-- 档案详情 Tab -->
        <a-tab-pane key="profile" tab="档案详情">
          <a-form 
            ref="formRef" 
            :model="formState" 
            layout="vertical"
            class="profile-form"
          >
            <!-- 1. 基础信息 (同步自前台，部分可编辑) -->
            <a-card title="基础信息" class="mb-4">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="用户ID">
                    <a-input v-model:value="formState.userId" disabled />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="姓名">
                    <a-input v-model:value="formState.baseInfo.name" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="性别">
                    <a-select v-model:value="formState.baseInfo.gender">
                      <a-select-option value="男">男</a-select-option>
                      <a-select-option value="女">女</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="手机号">
                    <a-input v-model:value="formState.phone" disabled />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="出生日期">
                    <a-date-picker 
                      v-model:value="formState.baseInfo.birthday" 
                      value-format="YYYY-MM-DD" 
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="身高 (cm)">
                    <a-input-number v-model:value="formState.baseInfo.height" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="体重 (kg)">
                    <a-input-number v-model:value="formState.baseInfo.weight" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="婚况">
                    <a-select v-model:value="formState.baseInfo.marriage">
                      <a-select-option value="未婚">未婚</a-select-option>
                      <a-select-option value="离异">离异</a-select-option>
                      <a-select-option value="丧偶">丧偶</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="学历">
                    <a-select v-model:value="formState.baseInfo.education">
                      <a-select-option v-for="opt in options.EDUCATION_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="民族">
                    <a-input v-model:value="formState.baseInfo.ethnicity" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- 2. 服务信息 -->
            <a-card title="服务信息" class="mb-4">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="服务红娘">
                    <a-select 
                      v-model:value="formState.serviceMatchmakerId" 
                      placeholder="选择服务红娘"
                      :disabled="!canAssignMatchmaker"
                    >
                      <a-select-option v-for="m in matchmakers" :key="m.id" :value="m.id">
                        {{ m.username }} ({{ m.phone }})
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="会员类型">
                    <a-select v-model:value="formState.extInfo.memberType">
                      <a-select-option v-for="opt in options.MEMBER_TYPES" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="服务状态">
                    <a-select v-model:value="formState.extInfo.serviceStatus">
                      <a-select-option v-for="opt in options.SERVICE_STATUS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="收费金额">
                    <a-input-number 
                      v-model:value="formState.extInfo.serviceFee" 
                      :formatter="value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\¥\s?|(,*)/g, '')"
                      style="width: 100%" 
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="服务开始日期">
                    <a-date-picker v-model:value="formState.extInfo.serviceStartDate" value-format="YYYY-MM-DD" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="服务结束日期">
                    <a-date-picker v-model:value="formState.extInfo.serviceEndDate" value-format="YYYY-MM-DD" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="状态备注">
                    <a-input v-model:value="formState.extInfo.serviceStatusRemark" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- 3. 个人扩展资料 -->
            <a-card title="个人扩展资料" class="mb-4">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="长相">
                    <a-select v-model:value="formState.extInfo.appearance">
                      <a-select-option v-for="opt in options.APPEARANCE_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="星座">
                    <a-select v-model:value="formState.extInfo.zodiac">
                      <a-select-option v-for="opt in options.ZODIAC_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="血型">
                    <a-select v-model:value="formState.extInfo.bloodType">
                      <a-select-option v-for="opt in options.BLOOD_TYPE_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="属相">
                    <a-select v-model:value="formState.extInfo.chineseZodiac">
                      <a-select-option v-for="opt in options.CHINESE_ZODIAC_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="罩杯 (女)">
                    <a-select v-model:value="formState.extInfo.braCup" :disabled="formState.baseInfo.gender === '男'">
                      <a-select-option v-for="opt in options.BRA_CUP_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="健康状况">
                    <a-input v-model:value="formState.extInfo.healthCondition" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="地中海贫血">
                    <a-select v-model:value="formState.extInfo.hasThalassemia">
                      <a-select-option v-for="opt in options.THALASSEMIA_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="地贫详情">
                    <a-input v-model:value="formState.extInfo.thalassemiaDetail" :disabled="formState.extInfo.hasThalassemia !== '有'" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- 4. 教育与工作 -->
            <a-card title="教育与工作" class="mb-4">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="毕业学校">
                    <a-input v-model:value="formState.extInfo.graduatedSchool" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="专业">
                    <a-input v-model:value="formState.extInfo.major" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="常住城市">
                    <a-input v-model:value="formState.extInfo.residenceCity" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="工作单位">
                    <a-input v-model:value="formState.extInfo.company" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="职称">
                    <a-input v-model:value="formState.extInfo.jobTitle" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="年收入">
                    <a-select v-model:value="formState.extInfo.annualIncome">
                      <a-select-option v-for="opt in options.INCOME_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- 5. 资产与家庭 -->
            <a-card title="资产与家庭" class="mb-4">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="籍贯">
                    <a-input v-model:value="formState.extInfo.hometown" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="小汽车">
                    <a-select v-model:value="formState.extInfo.hasCar">
                      <a-select-option v-for="opt in options.CAR_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="住房情况">
                    <a-select v-model:value="formState.extInfo.housingStatus">
                      <a-select-option v-for="opt in options.HOUSING_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="住房详情">
                    <a-input v-model:value="formState.extInfo.housingDetail" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="父母学历背景">
                    <a-input v-model:value="formState.extInfo.parentsEducation" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="父母情感状况">
                    <a-select v-model:value="formState.extInfo.parentsMaritalStatus">
                      <a-select-option v-for="opt in options.PARENTS_MARITAL_STATUS_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- 6. 个人素质与要求 -->
            <a-card title="个人素质与要求" class="mb-4">
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item label="情商评分 (多选)">
                    <a-checkbox-group v-model:value="formState.extInfo.eqScore">
                      <a-checkbox v-for="opt in options.EQ_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="长期专一承诺">
                    <a-radio-group v-model:value="formState.extInfo.commitmentScore">
                      <a-radio v-for="opt in options.COMMITMENT_SCORE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="兴趣爱好">
                    <a-textarea v-model:value="formState.extInfo.hobbies" :rows="3" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="技能证书">
                    <a-textarea v-model:value="formState.extInfo.skills" :rows="3" />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="红娘评语 (500字)">
                    <a-textarea v-model:value="formState.extInfo.matchmakerComments" :rows="4" show-count :maxlength="500" />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="个人简介">
                    <a-textarea v-model:value="formState.extInfo.intro" :rows="3" />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="择偶要求">
                    <a-textarea v-model:value="formState.extInfo.partnerRequirements" :rows="3" />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="备注">
                    <a-textarea v-model:value="formState.extInfo.remarks" :rows="2" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- 7. 测评结果 (只读展示) -->
            <a-card title="测评结果 (后台计算/同步)" class="mb-4">
              <a-descriptions bordered column="1">
                <a-descriptions-item label="九型人格结果">
                  <div v-if="assessmentResults.enneagram">
                    {{ getEnneagramSummary(assessmentResults.enneagram) }}
                  </div>
                  <div v-else class="text-gray-400">暂无数据</div>
                </a-descriptions-item>
                <a-descriptions-item label="依恋关系结果">
                  <div v-if="assessmentResults.attachment">
                    {{ getAttachmentSummary(assessmentResults.attachment) }}
                  </div>
                  <div v-else class="text-gray-400">暂无数据</div>
                </a-descriptions-item>
                <a-descriptions-item label="幸福力结果">
                  <div v-if="assessmentResults.happiness">
                    总分: {{ assessmentResults.happiness.resultData?.totalScore || 'N/A' }}
                  </div>
                  <div v-else class="text-gray-400">暂无数据</div>
                </a-descriptions-item>
                <a-descriptions-item label="MV值 (后台计算)">
                  <div v-if="formState.mvScore">
                    <span class="text-lg font-bold text-red-500">{{ formState.mvScore }}</span> 分
                  </div>
                  <div v-else class="text-gray-400">
                    暂未计算 
                    <a-button type="link" size="small" disabled>点击计算(待开发)</a-button>
                  </div>
                </a-descriptions-item>
              </a-descriptions>
            </a-card>

          </a-form>
        </a-tab-pane>

        <!-- 占位 Tabs -->
        <a-tab-pane key="match" tab="匹配轨迹">
          <a-empty description="匹配轨迹功能待开发" />
        </a-tab-pane>
        <a-tab-pane key="date" tab="约见轨迹">
          <a-empty description="约见轨迹功能待开发" />
        </a-tab-pane>
        <a-tab-pane key="therapy" tab="治疗轨迹">
          <a-empty description="治疗轨迹功能待开发" />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import axios from 'axios';
import * as options from '../../constants/member-options';

const route = useRoute();
const router = useRouter();
const userId = route.params.id as string;

const loading = ref(false);
const saving = ref(false);
const activeTab = ref('profile');
const matchmakers = ref<any[]>([]);
const userInfo = JSON.parse(localStorage.getItem('admin_user') || '{}');

// 权限判断
const canAssignMatchmaker = computed(() => {
  return ['super_admin', 'admin', 'manager'].includes(userInfo.role);
});

const formState = reactive({
  userId: '',
  phone: '',
  serviceMatchmakerId: undefined,
  mvScore: null,
  baseInfo: {
    name: '',
    gender: '',
    birthday: '',
    height: null,
    weight: null,
    education: '',
    marriage: '',
    ethnicity: '',
  },
  extInfo: {
    memberType: undefined,
    serviceStatus: undefined,
    serviceStatusRemark: '',
    serviceFee: null,
    serviceStartDate: null,
    serviceEndDate: null,
    appearance: undefined,
    zodiac: undefined,
    bloodType: undefined,
    chineseZodiac: undefined,
    braCup: undefined,
    healthCondition: '',
    hasThalassemia: undefined,
    thalassemiaDetail: '',
    graduatedSchool: '',
    major: '',
    residenceCity: '',
    company: '',
    jobTitle: '',
    annualIncome: undefined,
    hometown: '',
    hasCar: undefined,
    housingStatus: undefined,
    housingDetail: '',
    parentsEducation: '',
    parentsMaritalStatus: undefined,
    eqScore: [],
    commitmentScore: undefined,
    hobbies: '',
    skills: '',
    matchmakerComments: '',
    intro: '',
    partnerRequirements: '',
    remarks: ''
  }
});

const assessmentResults = reactive({
  enneagram: null as any,
  attachment: null as any,
  happiness: null as any
});

// 获取详情
const fetchProfile = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`/users/profile/${userId}`);
    const data = res.data || res;
    
    // 填充数据
    formState.userId = data.userId;
    formState.phone = data.user?.phone;
    formState.serviceMatchmakerId = data.serviceMatchmakerId;
    formState.mvScore = data.mvScore;
    
    if (data.baseInfo) Object.assign(formState.baseInfo, data.baseInfo);
    if (data.extInfo) Object.assign(formState.extInfo, data.extInfo);
    
    // 测评结果
    if (data.assessmentResults) {
      assessmentResults.enneagram = data.assessmentResults.enneagram;
      assessmentResults.attachment = data.assessmentResults.attachment;
      assessmentResults.happiness = data.assessmentResults.happiness;
    }
    
    // 如果是门店管理员或超管，且有storeId，加载该门店的红娘列表
    if (canAssignMatchmaker.value && data.user?.storeId) {
      fetchMatchmakers(data.user.storeId);
    }
    
  } catch (error: any) {
    message.error('加载档案失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 获取红娘列表
const fetchMatchmakers = async (storeId: string) => {
  try {
    const res = await axios.get('/users/sys', {
      params: { storeId, role: 'matchmaker' }
    });
    matchmakers.value = res.data || res || [];
  } catch (error) {
    console.error('加载红娘列表失败', error);
  }
};

// 保存
const handleSave = async () => {
  saving.value = true;
  try {
    await axios.patch(`/users/profile/${userId}`, {
      baseInfo: formState.baseInfo,
      extInfo: formState.extInfo,
      serviceMatchmakerId: formState.serviceMatchmakerId
    });
    message.success('保存成功');
  } catch (error: any) {
    message.error(error.response?.data?.message || '保存失败');
  } finally {
    saving.value = false;
  }
};

// 辅助函数
const getEnneagramSummary = (record: any) => {
  if (!record?.resultData?.top3) return '暂无数据';
  return `Top3: ${record.resultData.top3.map((t: any) => `${t.type}号`).join(', ')}`;
};

const getAttachmentSummary = (record: any) => {
  if (!record?.resultData?.type) return '暂无数据';
  return `${record.resultData.type}`;
};

onMounted(() => {
  if (userId) {
    fetchProfile();
  }
});
</script>

<style scoped>
.member-detail {
  background: #f0f2f5;
  min-height: 100%;
}
.profile-form :deep(.ant-card-head) {
  background: #fafafa;
  min-height: 48px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>

