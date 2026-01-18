<template>
  <div class="user-profile-view" v-if="user">
    <div class="header">
      <a-avatar :size="64" :src="user.avatar || '/default-avatar.png'" />
      <div class="info">
        <div class="name-row">
          <span class="name">{{ getName() }}</span>
          <span class="id-tag">ID: {{ user.id }}</span>
        </div>
        <div class="meta-row">
          <a-tag color="blue" v-if="getGender() === '男'">男</a-tag>
          <a-tag color="pink" v-else-if="getGender() === '女'">女</a-tag>
          <a-tag color="cyan">{{ getAge() }}岁</a-tag>
          <a-tag color="green">{{ getHeight() }}cm</a-tag>
          <a-tag>{{ getEducation() }}</a-tag>
          <a-tag>{{ getMarriage() }}</a-tag>
        </div>
      </div>
    </div>

    <a-divider style="margin: 12px 0" />

    <!-- 服务信息 -->
    <div class="section service-section">
      <div class="section-title">
        <span style="color: #52c41a; font-size: 14px;">● 服务信息</span>
      </div>
      <a-descriptions :column="2" size="small" bordered>
        <a-descriptions-item label="服务红娘">{{ getMatchmakerName() }}</a-descriptions-item>
        <a-descriptions-item label="服务状态">{{ user.profile?.extInfo?.serviceStatusRemark || '-' }}</a-descriptions-item>
        <a-descriptions-item label="服务周期">
          {{ formatServicePeriod() }}
        </a-descriptions-item>
        <a-descriptions-item label="收费金额">{{ user.profile?.extInfo?.serviceFee ? user.profile.extInfo.serviceFee + '元' : '-' }}</a-descriptions-item>
      </a-descriptions>
    </div>

    <a-divider style="margin: 12px 0" />

    <div class="section">
      <div class="section-title">MV值: <span class="score">{{ getMvScore() }}</span></div>
      <!-- MV Details if available -->
      <div v-if="user.profile?.mvDetail" class="mv-tags">
        <a-tag v-for="(item, key) in user.profile.mvDetail" :key="key" color="orange" v-show="item.score">
          {{ getMvLabelChinese(key) }}: {{ item.score }}
        </a-tag>
      </div>
      <div v-else class="text-gray text-xs">暂无MV明细</div>
    </div>

    <a-tabs v-model:activeKey="activeTab" class="profile-tabs">
      <a-tab-pane key="info" tab="详细资料">
        <a-descriptions :column="2" size="small" bordered>
          <!-- 基本信息 -->
          <a-descriptions-item label="手机号" :span="2">{{ user.phone }}</a-descriptions-item>
          <a-descriptions-item label="性别">{{ user.profile?.baseInfo?.gender }}</a-descriptions-item>
          <a-descriptions-item label="年龄">{{ getAge() }}岁</a-descriptions-item>
          <a-descriptions-item label="生日">{{ user.profile?.baseInfo?.birthday }}</a-descriptions-item>
          <a-descriptions-item label="婚姻状况">{{ user.profile?.baseInfo?.marriage }}</a-descriptions-item>
          
          <!-- 外貌特征 -->
          <a-descriptions-item label="身高">{{ user.profile?.baseInfo?.height }}cm</a-descriptions-item>
          <a-descriptions-item label="体重">{{ user.profile?.baseInfo?.weight }}kg</a-descriptions-item>
          <a-descriptions-item label="长相">{{ user.profile?.extInfo?.appearance || '-' }}</a-descriptions-item>
          <a-descriptions-item label="罩杯" v-if="user.profile?.baseInfo?.gender === '女'">{{ user.profile?.extInfo?.braCup || '-' }}</a-descriptions-item>
          
          <!-- 个人属性 -->
          <a-descriptions-item label="民族">{{ user.profile?.baseInfo?.ethnicity }}</a-descriptions-item>
          <a-descriptions-item label="星座">{{ user.profile?.extInfo?.zodiac || '-' }}</a-descriptions-item>
          <a-descriptions-item label="血型">{{ user.profile?.extInfo?.bloodType || '-' }}</a-descriptions-item>
          <a-descriptions-item label="籍贯">{{ user.profile?.extInfo?.hometown || '-' }}</a-descriptions-item>
          
          <!-- 健康状况 -->
          <a-descriptions-item label="健康状况" :span="2">{{ user.profile?.extInfo?.healthCondition || '-' }}</a-descriptions-item>
          <a-descriptions-item label="地中海贫血">{{ user.profile?.extInfo?.hasThalassemia || '-' }}</a-descriptions-item>
          <a-descriptions-item label="地贫详情">{{ user.profile?.extInfo?.thalassemiaDetail || '-' }}</a-descriptions-item>
          
          <!-- 教育背景 -->
          <a-descriptions-item label="学历">{{ user.profile?.baseInfo?.education }}</a-descriptions-item>
          <a-descriptions-item label="毕业学校">{{ user.profile?.extInfo?.graduatedSchool || '-' }}</a-descriptions-item>
          <a-descriptions-item label="专业" :span="2">{{ user.profile?.extInfo?.major || '-' }}</a-descriptions-item>
          
          <!-- 工作信息 -->
          <a-descriptions-item label="常住城市">{{ user.profile?.extInfo?.residenceCity || '-' }}</a-descriptions-item>
          <a-descriptions-item label="工作单位">{{ user.profile?.extInfo?.company || '-' }}</a-descriptions-item>
          <a-descriptions-item label="职称">{{ user.profile?.extInfo?.jobTitle || '-' }}</a-descriptions-item>
          <a-descriptions-item label="年收入">{{ user.profile?.extInfo?.annualIncome || '-' }}</a-descriptions-item>
          
          <!-- 资产情况 -->
          <a-descriptions-item label="住房情况">{{ user.profile?.extInfo?.housingStatus || '-' }}</a-descriptions-item>
          <a-descriptions-item label="住房详情">{{ user.profile?.extInfo?.housingDetail || '-' }}</a-descriptions-item>
          <a-descriptions-item label="小汽车">{{ user.profile?.extInfo?.hasCar || '-' }}</a-descriptions-item>
          <a-descriptions-item label="房/车组合">{{ user.profile?.extInfo?.housingStatus }} / {{ user.profile?.extInfo?.hasCar }}</a-descriptions-item>
          
          <!-- 家庭背景 -->
          <a-descriptions-item label="父母情感状况" :span="2">{{ user.profile?.extInfo?.parentsMaritalStatus || '-' }}</a-descriptions-item>
          <a-descriptions-item label="父母学历背景" :span="2">{{ user.profile?.extInfo?.parentsEducation || '-' }}</a-descriptions-item>
          
          <!-- 个人素质 -->
          <a-descriptions-item label="情商评分" :span="2">
            <a-tag v-for="eq in getEqScores()" :key="eq" color="green" style="margin-right: 4px;">{{ eq }}</a-tag>
            <span v-if="!getEqScores().length" class="text-gray">-</span>
          </a-descriptions-item>
          <a-descriptions-item label="长期专一承诺" :span="2">
            {{ user.profile?.extInfo?.commitmentScore ? user.profile.extInfo.commitmentScore + '分' : '-' }}
          </a-descriptions-item>
          
          <!-- 兴趣爱好 -->
          <a-descriptions-item label="兴趣爱好" :span="2">{{ user.profile?.extInfo?.hobbies || '-' }}</a-descriptions-item>
          <a-descriptions-item label="技能证书" :span="2">{{ user.profile?.extInfo?.skills || '-' }}</a-descriptions-item>
          
          <!-- 其他信息 -->
          <a-descriptions-item label="个人简介" :span="2">{{ user.profile?.extInfo?.intro || '-' }}</a-descriptions-item>
          <a-descriptions-item label="择偶要求" :span="2">{{ user.profile?.extInfo?.partnerRequirements || '-' }}</a-descriptions-item>
          <a-descriptions-item label="红娘评语" :span="2">
            <div style="color: #1890ff; line-height: 1.6;">{{ user.profile?.extInfo?.matchmakerComments || '-' }}</div>
          </a-descriptions-item>
        </a-descriptions>
      </a-tab-pane>

      <a-tab-pane key="assessment" tab="测评结果">
        <!-- 1. 九型人格 -->
        <div class="assessment-block">
          <h4>九型人格</h4>
          <div v-if="assessments.enneagram" class="enneagram-result">
             <div class="chart-container">
               <div v-for="item in sortedEnneagramTypes" :key="item.type" class="chart-bar-row">
                 <span class="label">{{ item.label }}</span>
                 <div class="bar-wrapper">
                   <div class="bar" :style="{ width: item.percent + '%' }"></div>
                 </div>
                 <span class="value">{{ item.percent }}%</span>
               </div>
             </div>
             <div class="top3-tags mt-2">
               Top3: 
               <a-tag v-for="type in enneagramTop3" :key="type" color="blue">{{ type }}号</a-tag>
             </div>
          </div>
          <div v-else class="empty-text">暂无数据</div>
        </div>

        <a-divider style="margin: 12px 0" />

        <!-- 2. 依恋关系 -->
        <div class="assessment-block">
          <h4>依恋关系</h4>
          <div v-if="assessments.attachment" class="attachment-result">
             <a-tag color="purple" class="mb-2">{{ assessments.attachment.typeLabel || assessments.attachment.type }}</a-tag>
             <p class="desc">{{ assessments.attachment.description }}</p>
             <div class="scores">
               <a-tag>焦虑: {{ assessments.attachment.anxietyScore }}</a-tag>
               <a-tag>回避: {{ assessments.attachment.avoidanceScore }}</a-tag>
               <a-tag>安全: {{ assessments.attachment.securityScore }}</a-tag>
             </div>
          </div>
          <div v-else class="empty-text">暂无数据</div>
        </div>

        <a-divider style="margin: 12px 0" />

        <!-- 3. 幸福力 -->
        <div class="assessment-block">
          <h4>幸福力</h4>
          <div v-if="assessments.happiness" class="happiness-result">
            <div style="display: flex; justify-content: center; margin-bottom: 10px;">
              <HappinessRing :data="assessments.happiness" :width="200" :height="200" :show-label="true" />
            </div>
            <div class="analysis-text" v-if="happinessAnalysis">
              <p v-for="(line, idx) in happinessAnalysis" :key="idx">{{ line }}</p>
            </div>
          </div>
          <div v-else class="empty-text">暂无数据</div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
  <div v-else class="loading-placeholder">
    <a-spin tip="加载用户数据..." />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, onMounted } from 'vue';
import HappinessRing from '@/components/HappinessRing.vue';
import { ENNEAGRAM_LABELS } from '@/utils/enneagram-match';
import { generateHappinessAnalysis, HAPPINESS_DIMENSIONS } from '@/utils/happiness-config';

const props = defineProps<{
  user: any
}>();

// Debug
onMounted(() => {
  console.log('📋 User Profile View mounted with user:', props.user);
  console.log('📋 Assessment Results:', props.user?.assessmentResults);
  console.log('📋 Enneagram:', props.user?.assessmentResults?.enneagram);
  console.log('📋 Attachment:', props.user?.assessmentResults?.attachment);
  console.log('📋 Happiness:', props.user?.assessmentResults?.happiness);
});

const activeTab = ref('info');

const getName = () => props.user?.profile?.baseInfo?.name || props.user?.username || '-';
const getGender = () => props.user?.profile?.baseInfo?.gender || '-';
const getAge = () => {
  const birthday = props.user?.profile?.baseInfo?.birthday;
  if (!birthday) return '-';
  const birthYear = new Date(birthday).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};
const getHeight = () => props.user?.profile?.baseInfo?.height || '-';
const getEducation = () => props.user?.profile?.baseInfo?.education || '-';
const getMarriage = () => props.user?.profile?.baseInfo?.marriage || '-';
const getMvScore = () => props.user?.profile?.mvScore ? Number(props.user.profile.mvScore).toFixed(1) : '未计算';

const getMatchmakerName = () => {
  // 如果有红娘信息，显示红娘姓名
  // 这里假设 user 对象中可能包含 matchmaker 信息
  // 如果没有，可以考虑在后端查询时 join 红娘表
  return props.user?.profile?.serviceMatchmakerId || '-';
};

const formatServicePeriod = () => {
  const start = props.user?.profile?.extInfo?.serviceStartDate;
  const end = props.user?.profile?.extInfo?.serviceEndDate;
  if (!start && !end) return '-';
  return `${start || '-'} 至 ${end || '-'}`;
};

const getEqScores = () => {
  return props.user?.profile?.extInfo?.eqScore || [];
};

// MV维度中文映射
const MV_LABEL_MAP: Record<string, string> = {
  // 男性维度
  age: '年龄',
  height: '身高',
  appearance: '长相',
  wealth: '财富',
  intelligence: '智商',
  eq: '情商',
  sexual_ability: '性能力',
  commitment: '长期专一承诺',
  // 女性维度
  bmi: 'BMI',
  bra_cup: '罩杯',
  education: '学历',
  personality: '性格',
  family: '家庭环境'
};

const getMvLabelChinese = (key: string) => {
  return MV_LABEL_MAP[key] || key;
};

const assessments = computed(() => props.user?.assessmentResults || {});

// Enneagram Logic
const sortedEnneagramTypes = computed(() => {
  if (!assessments.value.enneagram) return [];
  const result = assessments.value.enneagram;
  
  // 检查是否有 percentages 字段
  let data = result.percentages || result;
  
  // 转换为数组
  const list = Object.keys(ENNEAGRAM_LABELS).map(key => {
    // 过滤掉非数字key
    if (!/^\d+$/.test(key)) return null;
    const type = key;
    const rawVal = data[key];
    // 如果是小数，乘100
    const percent = rawVal > 1 ? rawVal : (rawVal * 100);
    return {
      type,
      label: `${type}号 (${ENNEAGRAM_LABELS[Number(key)]})`,
      percent: Number(percent || 0).toFixed(1),
      raw: Number(percent || 0)
    };
  }).filter(Boolean) as any[];

  return list.sort((a, b) => b.raw - a.raw);
});

const enneagramTop3 = computed(() => {
  return sortedEnneagramTypes.value.slice(0, 3).map(i => i.type);
});

// Happiness Logic
const happinessAnalysis = computed(() => {
  if (!assessments.value.happiness) return { highScoreText: '', lowScoreText: '' };
  
  // 转换对象格式为数组格式
  const happinessData = assessments.value.happiness;
  const dimensionsArray = HAPPINESS_DIMENSIONS.map(dim => ({
    dimensionId: dim.id,
    normalizedScore: happinessData[dim.name] || 0
  }));
  
  const analysis = generateHappinessAnalysis(dimensionsArray);
  // 返回文本数组供模板使用
  return [analysis.highScoreText, analysis.lowScoreText].filter(text => text);
});

</script>

<style scoped>
.user-profile-view {
  background: #fff;
}
.header {
  display: flex;
  gap: 16px;
  align-items: center;
  padding-bottom: 12px;
}
.info {
  flex: 1;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.name {
  font-size: 18px;
  font-weight: bold;
}
.id-tag {
  font-size: 12px;
  color: #999;
}
.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.service-section {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}
.section-title {
  font-weight: bold;
  margin-bottom: 8px;
}
.score {
  color: #f5222d;
  font-size: 18px;
  font-weight: bold;
}
.mv-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.text-gray {
  color: #999;
}
.assessment-block h4 {
  border-left: 3px solid #1890ff;
  padding-left: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: bold;
}
.chart-bar-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
}
.chart-bar-row .label {
  width: 90px;
  text-align: right;
  margin-right: 8px;
  color: #666;
}
.chart-bar-row .value {
  width: 40px;
  margin-left: 8px;
  color: #666;
}
.bar-wrapper {
  flex: 1;
  background: #f0f0f0;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}
.bar {
  height: 100%;
  background: #1890ff;
  border-radius: 4px;
}
.desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
}
.scores {
  display: flex;
  gap: 4px;
}
.analysis-text {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin-top: 12px;
  background: #f9f9f9;
  padding: 8px;
  border-radius: 4px;
}
.empty-text {
  color: #ccc;
  font-style: italic;
  font-size: 12px;
}
.loading-placeholder {
  padding: 24px;
  text-align: center;
}
</style>