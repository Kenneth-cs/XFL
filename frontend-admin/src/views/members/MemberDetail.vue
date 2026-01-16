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
                  <a-form-item>
                    <template #label>
                      出生日期 <span style="color: red;">*</span>
                      <a-tooltip title="MV值计算必填：用于计算年龄维度">
                        <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
                      </a-tooltip>
                      <span v-if="formState.mvDetail && formState.mvDetail.age" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (得分: {{ formState.mvDetail.age.score || 0 }}分)
                      </span>
                    </template>
                    <a-date-picker 
                      v-model:value="formState.baseInfo.birthday" 
                      value-format="YYYY-MM-DD" 
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <template #label>
                      身高 (cm) <span style="color: red;">*</span>
                      <a-tooltip :title="formState.baseInfo.gender === '女' ? 'MV值计算必填：用于计算BMI维度' : 'MV值计算必填：身高维度'">
                        <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
                      </a-tooltip>
                      <span v-if="formState.mvDetail && formState.mvDetail.height && formState.baseInfo.gender === '男'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (得分: {{ formState.mvDetail.height.score || 0 }}分)
                      </span>
                      <span v-if="formState.mvDetail && formState.mvDetail.bmi && formState.baseInfo.gender === '女'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (BMI得分: {{ formState.mvDetail.bmi.score || 0 }}分)
                      </span>
                    </template>
                    <a-input-number v-model:value="formState.baseInfo.height" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <template #label>
                      体重 (kg) <span v-if="formState.baseInfo.gender === '女'" style="color: red;">*</span>
                      <a-tooltip v-if="formState.baseInfo.gender === '女'" title="MV值计算必填：用于计算BMI维度">
                        <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
                      </a-tooltip>
                      <span v-if="formState.mvDetail && formState.mvDetail.bmi && formState.baseInfo.gender === '女'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (BMI得分: {{ formState.mvDetail.bmi.score || 0 }}分)
                      </span>
                    </template>
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
                  <a-form-item>
                    <template #label>
                      学历 <span style="color: red;">*</span>
                      <a-tooltip :title="formState.baseInfo.gender === '男' ? 'MV值计算必填：智商维度' : 'MV值计算必填：学历维度'">
                        <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
                      </a-tooltip>
                      <span v-if="formState.mvDetail && formState.mvDetail.intelligence && formState.baseInfo.gender === '男'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (智商: {{ formState.mvDetail.intelligence.score || 0 }}分)
                      </span>
                      <span v-if="formState.mvDetail && formState.mvDetail.education && formState.baseInfo.gender === '女'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (得分: {{ formState.mvDetail.education.score || 0 }}分)
                      </span>
                    </template>
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
                  <a-form-item>
                    <template #label>
                      长相 <span style="color: red;">*</span>
                      <a-tooltip title="MV值计算必填：长相维度">
                        <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
                      </a-tooltip>
                      <span v-if="formState.mvDetail && formState.mvDetail.appearance" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (得分: {{ formState.mvDetail.appearance.score || 0 }}分)
                      </span>
                    </template>
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
                  <a-form-item>
                    <template #label>
                      罩杯 (女) <span v-if="formState.baseInfo.gender === '女'" style="color: red;">*</span>
                      <a-tooltip v-if="formState.baseInfo.gender === '女'" title="MV值计算必填：罩杯维度">
                        <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
                      </a-tooltip>
                      <span v-if="formState.mvDetail && formState.mvDetail.bra_cup && formState.baseInfo.gender === '女'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (得分: {{ formState.mvDetail.bra_cup.score || 0 }}分)
                      </span>
                    </template>
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
                  <a-form-item>
                    <template #label>
                      年收入 <span v-if="formState.baseInfo.gender === '男'" style="color: red;">*</span>
                      <a-tooltip v-if="formState.baseInfo.gender === '男'" title="MV值计算必填：财富维度">
                        <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
                      </a-tooltip>
                      <span v-if="formState.mvDetail && formState.mvDetail.wealth && formState.baseInfo.gender === '男'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (财富: {{ formState.mvDetail.wealth.score || 0 }}分)
                      </span>
                    </template>
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
                  <a-form-item>
                    <template #label>
                      父母情感状况 <span v-if="formState.baseInfo.gender === '女'" style="color: red;">*</span>
                      <a-tooltip v-if="formState.baseInfo.gender === '女'" title="MV值计算必填：家庭环境维度">
                        <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
                      </a-tooltip>
                      <span v-if="formState.mvDetail && formState.mvDetail.family && formState.baseInfo.gender === '女'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (家庭: {{ formState.mvDetail.family.score || 0 }}分)
                      </span>
                    </template>
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
                  <a-form-item>
                    <template #label>
                      情商评分 (多选) <span v-if="formState.baseInfo.gender === '男'" style="color: red;">*</span>
                      <a-tooltip v-if="formState.baseInfo.gender === '男'" title="MV值计算必填：情商维度">
                        <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
                      </a-tooltip>
                      <span v-if="formState.mvDetail && formState.mvDetail.eq && formState.baseInfo.gender === '男'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (情商: {{ formState.mvDetail.eq.score || 0 }}分)
                      </span>
                    </template>
                    <a-checkbox-group v-model:value="formState.extInfo.eqScore">
                      <a-checkbox v-for="opt in options.EQ_OPTIONS" :key="opt" :value="opt">{{ opt }}</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item>
                    <template #label>
                      长期专一承诺 <span v-if="formState.baseInfo.gender === '男'" style="color: red;">*</span>
                      <a-tooltip v-if="formState.baseInfo.gender === '男'" title="MV值计算必填：长期专一承诺维度">
                        <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
                      </a-tooltip>
                      <span v-if="formState.mvDetail && formState.mvDetail.commitment && formState.baseInfo.gender === '男'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
                        (承诺: {{ formState.mvDetail.commitment.score || 0 }}分)
                      </span>
                    </template>
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
              <!-- 九型人格详细结果 -->
              <a-card type="inner" title="九型人格测评结果" class="mb-4" v-if="assessmentResults.enneagram">
                <!-- 9个类型百分比 (从高到低) -->
                <a-descriptions bordered size="small" :column="2" class="mb-3" :labelStyle="{ width: '200px' }">
                  <a-descriptions-item label="测评结果详情" :span="2">
                    <a-space direction="vertical" style="width: 100%;">
                      <div 
                        v-for="item in enneagramMatchData?.sortedTypes" 
                        :key="item.type"
                        style="display: flex; justify-content: space-between; padding: 4px 0;"
                      >
                        <span>
                          <a-tag :color="enneagramMatchData.top3.includes(item.type) ? 'blue' : 'default'">
                            {{ item.type }}号
                          </a-tag>
                          {{ item.label }}
                        </span>
                        <span style="font-weight: bold;">{{ (item.percentage * 100).toFixed(2) }}%</span>
                      </div>
                    </a-space>
                  </a-descriptions-item>
                  <a-descriptions-item label="Top3 性格类型" :span="2">
                    <a-space>
                      <a-tag 
                        v-for="type in enneagramMatchData?.top3" 
                        :key="type" 
                        color="blue"
                      >
                        {{ type }}号 - {{ ENNEAGRAM_LABELS[type] }}
                      </a-tag>
                    </a-space>
                  </a-descriptions-item>
                </a-descriptions>
                
                <!-- 可匹配异性性格 -->
                <a-descriptions bordered size="small" :column="1" :labelStyle="{ width: '200px' }">
                  <a-descriptions-item label="可匹配异性性格 (按优先级排序)">
                    <a-space direction="vertical" style="width: 100%;">
                      <div 
                        v-for="match in enneagramMatchData?.matchedTypes" 
                        :key="match.type"
                        style="display: flex; justify-content: space-between; padding: 4px 0;"
                      >
                        <span>
                          <a-tag 
                            :color="match.score >= 3 ? 'red' : match.score === 2 ? 'orange' : match.score === 1 ? 'green' : 'default'"
                          >
                            {{ oppositeGender }}{{ match.type }}号
                          </a-tag>
                          {{ match.label }}
                        </span>
                        <span>
                          <a-tag :color="match.score >= 3 ? 'red' : match.score === 2 ? 'orange' : 'green'">
                            {{ match.priority }}
                          </a-tag>
                        </span>
                      </div>
                    </a-space>
                  </a-descriptions-item>
                  <a-descriptions-item label="不匹配的异性类型 (互斥)" v-if="enneagramMatchData?.unmatchedTypes.length > 0">
                    <a-space>
                      <a-tag 
                        v-for="unmatch in enneagramMatchData?.unmatchedTypes" 
                        :key="unmatch.type" 
                        color="error"
                      >
                        {{ oppositeGender }}{{ unmatch.type }}号 - {{ unmatch.label }}
                      </a-tag>
                    </a-space>
                  </a-descriptions-item>
                  <a-descriptions-item label="匹配结论" :span="2">
                    <div style="white-space: pre-wrap; line-height: 1.8;">
                      {{ enneagramMatchData?.conclusion }}
                    </div>
                  </a-descriptions-item>
                </a-descriptions>
              </a-card>
              <a-alert v-else message="暂无九型人格测评数据" type="info" show-icon class="mb-4" />

              <!-- 依恋关系详细结果 -->
              <a-card type="inner" title="依恋关系测评结果" class="mb-4" v-if="assessmentResults.attachment">
                <a-descriptions bordered size="small" :column="1" :labelStyle="{ width: '200px' }">
                  <!-- 依恋类型 -->
                  <a-descriptions-item label="依恋类型">
                    <div v-if="assessmentResults.attachment.resultData?.type === '得分不足' || assessmentResults.attachment.resultData?.type?.includes('待进一步沟通')">
                      <a-alert 
                        message="得分不足" 
                        description="三个维度得分都低于5分，无法给出具体的依恋类型" 
                        type="warning" 
                        show-icon 
                      />
                    </div>
                    <div v-else-if="attachmentDetailInfo">
                      <a-tag :color="attachmentDetailInfo.color" style="font-size: 14px; padding: 4px 12px;">
                        {{ attachmentDetailInfo.fullName }}
                      </a-tag>
                      <a-tag color="purple" style="margin-left: 8px;">
                        {{ attachmentDetailInfo.label }}
                      </a-tag>
                      <div style="margin-top: 8px; color: #666;">
                        维度组合：{{ attachmentDetailInfo.dimensions }}
                      </div>
                    </div>
                    <div v-else>
                      {{ assessmentResults.attachment.resultData?.type || '暂无数据' }}
                    </div>
                  </a-descriptions-item>

                  <!-- 三维度得分 -->
                  <a-descriptions-item label="三维度得分详情">
                    <div v-if="assessmentResults.attachment.resultData" style="display: flex; flex-direction: column; gap: 12px;">
                      <!-- 焦虑维度 -->
                      <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                          <span style="font-weight: 500;">
                            <a-tag color="orange">A</a-tag> 焦虑维度（Anxiety）
                          </span>
                          <span style="font-weight: bold; color: #fa8c16;">
                            {{ assessmentResults.attachment.resultData.anxietyScore || 0 }}/12 分
                          </span>
                        </div>
                        <a-progress 
                          :percent="((assessmentResults.attachment.resultData.anxietyScore || 0) / 12) * 100" 
                          :show-info="false"
                          stroke-color="#fa8c16"
                        />
                        <div style="margin-top: 4px; font-size: 12px; color: #999;">
                          {{ getDimensionDescription('A', assessmentResults.attachment.resultData.anxietyScore || 0) }}
                        </div>
                      </div>

                      <!-- 回避维度 -->
                      <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                          <span style="font-weight: 500;">
                            <a-tag color="blue">B</a-tag> 回避维度（Avoidance）
                          </span>
                          <span style="font-weight: bold; color: #1890ff;">
                            {{ assessmentResults.attachment.resultData.avoidanceScore || 0 }}/12 分
                          </span>
                        </div>
                        <a-progress 
                          :percent="((assessmentResults.attachment.resultData.avoidanceScore || 0) / 12) * 100" 
                          :show-info="false"
                          stroke-color="#1890ff"
                        />
                        <div style="margin-top: 4px; font-size: 12px; color: #999;">
                          {{ getDimensionDescription('B', assessmentResults.attachment.resultData.avoidanceScore || 0) }}
                        </div>
                      </div>

                      <!-- 安全感维度 -->
                      <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                          <span style="font-weight: 500;">
                            <a-tag color="green">C</a-tag> 安全感维度（Security）
                          </span>
                          <span style="font-weight: bold; color: #52c41a;">
                            {{ assessmentResults.attachment.resultData.securityScore || 0 }}/12 分
                          </span>
                        </div>
                        <a-progress 
                          :percent="((assessmentResults.attachment.resultData.securityScore || 0) / 12) * 100" 
                          :show-info="false"
                          stroke-color="#52c41a"
                        />
                        <div style="margin-top: 4px; font-size: 12px; color: #999;">
                          {{ getDimensionDescription('C', assessmentResults.attachment.resultData.securityScore || 0) }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-gray-400">暂无数据</div>
                  </a-descriptions-item>

                  <!-- 核心特质 -->
                  <a-descriptions-item 
                    label="核心特质" 
                    v-if="attachmentDetailInfo && assessmentResults.attachment.resultData?.type !== '得分不足'"
                  >
                    <div style="line-height: 1.8; color: #333;">
                      {{ attachmentDetailInfo.coreTraits }}
                    </div>
                  </a-descriptions-item>

                  <!-- 典型行为表现 -->
                  <a-descriptions-item 
                    label="典型行为表现" 
                    v-if="attachmentDetailInfo && assessmentResults.attachment.resultData?.type !== '得分不足'"
                  >
                    <ul style="margin: 0; padding-left: 20px; line-height: 2;">
                      <li v-for="(behavior, index) in attachmentDetailInfo.behaviors" :key="index">
                        {{ behavior }}
                      </li>
                    </ul>
                  </a-descriptions-item>

                  <!-- 相处优势/核心痛点 -->
                  <a-descriptions-item 
                    :label="attachmentDetailInfo?.advantage ? '相处优势' : '核心痛点'" 
                    v-if="attachmentDetailInfo && (attachmentDetailInfo.advantage || attachmentDetailInfo.painPoint) && assessmentResults.attachment.resultData?.type !== '得分不足'"
                  >
                    <a-alert 
                      :type="attachmentDetailInfo.advantage ? 'success' : 'warning'"
                      :message="attachmentDetailInfo.advantage || attachmentDetailInfo.painPoint"
                      show-icon
                      style="line-height: 1.8;"
                    />
                  </a-descriptions-item>
                </a-descriptions>
              </a-card>
              <a-alert v-else message="暂无依恋关系测评数据" type="info" show-icon class="mb-4" />

              <!-- 幸福力结果 -->
              <a-descriptions bordered column="1" class="mb-3" :labelStyle="{ width: '200px' }">
                <a-descriptions-item label="幸福力结果">
                  <div v-if="assessmentResults.happiness">
                    总分: {{ assessmentResults.happiness.resultData?.totalScore || 'N/A' }}
                  </div>
                  <div v-else class="text-gray-400">暂无数据</div>
                </a-descriptions-item>
              </a-descriptions>

              <!-- MV值 -->
              <a-descriptions bordered column="1" :labelStyle="{ width: '200px' }">
                <a-descriptions-item label="MV值 (后台计算)">
                  <div v-if="formState.mvScore">
                    <span class="text-lg font-bold text-red-500">{{ formState.mvScore }}</span> 分
                    <a-button type="link" size="small" @click="handleCalculateMv" :loading="calculating">重新计算</a-button>
                  </div>
                  <div v-else class="text-gray-400">
                    暂未计算 
                    <a-button type="primary" size="small" @click="handleCalculateMv" :loading="calculating">立即计算</a-button>
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
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import * as options from '../../constants/member-options';
import { calculateEnneagramMatch, ENNEAGRAM_LABELS, type EnneagramMatchResult } from '../../utils/enneagram-match';
import { getAttachmentTypeInfo, getDimensionDescription } from '../../utils/attachment-info';

const route = useRoute();
const router = useRouter();
const userId = route.params.id as string;

const loading = ref(false);
const saving = ref(false);
const calculating = ref(false);
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
  mvDetail: null,
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

// 计算九型人格匹配数据
const enneagramMatchData = computed<EnneagramMatchResult | null>(() => {
  if (!assessmentResults.enneagram?.resultData?.percentages || !formState.baseInfo?.gender) {
    return null;
  }
  
  const percentages = assessmentResults.enneagram.resultData.percentages;
  const gender = formState.baseInfo.gender;
  
  return calculateEnneagramMatch(percentages, gender);
});

// 计算异性性别
const oppositeGender = computed(() => {
  return formState.baseInfo?.gender === '男' ? '女' : '男';
});

// 获取依恋关系详细信息
const attachmentDetailInfo = computed(() => {
  if (!assessmentResults.attachment?.resultData?.type) {
    return null;
  }
  
  const type = assessmentResults.attachment.resultData.type;
  const typeInfo = getAttachmentTypeInfo(type);
  
  if (!typeInfo) {
    return null;
  }
  
  // 获取三维度得分
  const scores = {
    anxiety: assessmentResults.attachment.resultData.anxietyScore || 0,
    avoidance: assessmentResults.attachment.resultData.avoidanceScore || 0,
    security: assessmentResults.attachment.resultData.securityScore || 0,
  };
  
  return {
    ...typeInfo,
    scores,
  };
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
    formState.mvDetail = data.mvDetail;
    
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

// 验证必填项
const validateMvFields = () => {
  const { gender, birthday, height, weight, education } = formState.baseInfo;
  const { appearance, braCup, annualIncome, parentsMaritalStatus, eqScore, commitmentScore } = formState.extInfo;
  
  const missingFields: string[] = [];
  
  // 通用必填项
  if (!birthday) missingFields.push('出生日期');
  if (!height) missingFields.push('身高');
  if (!education) missingFields.push('学历');
  if (!appearance) missingFields.push('长相');
  
  if (gender === '男') {
    // 男性特有必填项
    if (!annualIncome) missingFields.push('年收入');
    if (!eqScore || eqScore.length === 0) missingFields.push('情商评分（至少选择一项）');
    if (commitmentScore === undefined || commitmentScore === null) missingFields.push('长期专一承诺');
  } else if (gender === '女') {
    // 女性特有必填项
    if (!weight) missingFields.push('体重');
    if (!braCup) missingFields.push('罩杯');
    if (!parentsMaritalStatus) missingFields.push('父母情感状况');
  } else {
    missingFields.push('性别（请先设置用户性别）');
  }
  
  return missingFields;
};

// 计算MV值
const handleCalculateMv = async () => {
  // 1. 先验证必填项
  const missingFields = validateMvFields();
  if (missingFields.length > 0) {
    message.warning({
      content: `请先完善以下MV计算必填项：\n${missingFields.join('、')}`,
      duration: 5,
    });
    return;
  }
  
  calculating.value = true;
  try {
    const res = await axios.post(`/mv/calculate/${userId}`);
    const data = res.data || res;
    
    // 更新显示
    formState.mvScore = data.mvScore;
    formState.mvDetail = data.mvDetail;
    
    // 调试：打印mvDetail到控制台
    console.log('MV计算结果 - 性别:', formState.baseInfo.gender);
    console.log('MV计算结果 - mvDetail:', JSON.stringify(formState.mvDetail, null, 2));
    
    message.success(`MV值计算完成！总分: ${data.mvScore.toFixed(2)}，使用方案: ${data.schemeName}`, 5);
  } catch (error: any) {
    // 详细的错误提示
    const errorMsg = error.response?.data?.message || error.message || 'MV值计算失败';
    const statusCode = error.response?.status;
    
    if (statusCode === 404) {
      message.error('计算服务未找到，请联系管理员或稍后重试', 5);
    } else if (statusCode === 400) {
      message.error(`数据不完整：${errorMsg}`, 5);
    } else if (statusCode === 500) {
      message.error(`服务器错误：${errorMsg}`, 5);
    } else {
      message.error(`计算失败：${errorMsg}`, 5);
    }
    
    console.error('MV计算错误详情:', error);
  } finally {
    calculating.value = false;
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

