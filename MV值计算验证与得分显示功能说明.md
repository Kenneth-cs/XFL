# MV值计算验证与得分显示功能说明

## 一、功能概述

本功能在用户档案详情页实现了以下两项核心能力：

1. **必填项验证** - 在计算MV值前，检查所有必填字段是否已完整填写
2. **得分显示** - 计算完成后，在每个计算维度的字段旁边显示该维度的得分

---

## 二、男性MV值计算必填项

在点击"计算MV"按钮前，系统会验证以下字段：

| 序号 | 字段名称 | 对应维度 | 数据来源 | 验证规则 |
|------|---------|---------|----------|---------|
| 1 | 出生日期 | age（年龄） | baseInfo.birthday | 必填，非空 |
| 2 | 身高 | height（身高） | baseInfo.height | 必填，非空 |
| 3 | 学历 | intelligence（智商） | baseInfo.education | 必填，非空 |
| 4 | 长相 | appearance（长相） | extInfo.appearance | 必填，非空 |
| 5 | 年收入 | wealth（财富） | extInfo.annualIncome | 必填，非空 |
| 6 | 情商评分 | eq（情商） | extInfo.eqScore | 必填，数组长度≥1 |
| 7 | 长期专一承诺 | commitment（承诺） | extInfo.commitmentScore | 必填，非空 |
| 8 | 性能力 | sexual_ability（性能力） | 系统自动计算（基于年龄） | 无需填写 |

---

## 三、女性MV值计算必填项

在点击"计算MV"按钮前，系统会验证以下字段：

| 序号 | 字段名称 | 对应维度 | 数据来源 | 验证规则 |
|------|---------|---------|----------|---------|
| 1 | 出生日期 | age（年龄） | baseInfo.birthday | 必填，非空 |
| 2 | 身高 | bmi（BMI） | baseInfo.height | 必填，非空 |
| 3 | 体重 | bmi（BMI） | baseInfo.weight | 必填，非空 |
| 4 | 学历 | education（学历） | baseInfo.education | 必填，非空 |
| 5 | 长相 | appearance（长相） | extInfo.appearance | 必填，非空 |
| 6 | 罩杯 | bra_cup（罩杯） | extInfo.braCup | 必填，非空 |
| 7 | 父母情感状况 | family（家庭环境） | extInfo.parentsMaritalStatus | 必填，非空 |
| 8 | 性格 | personality（性格） | 系统自动计算（从测评获取） | 无需填写 |

---

## 四、验证逻辑实现

### 4.1 前端验证函数

```typescript
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
```

### 4.2 验证触发时机

点击"计算MV"按钮时，首先调用验证函数：

```typescript
const handleCalculateMv = async () => {
  // 1. 先验证必填项
  const missingFields = validateMvFields();
  if (missingFields.length > 0) {
    message.warning({
      content: `请先完善以下MV计算必填项：\n${missingFields.join('、')}`,
      duration: 5,
    });
    return; // 阻止计算
  }
  
  // 2. 验证通过后，才调用后端API
  calculating.value = true;
  try {
    const res = await axios.post(`/mv/calculate/${userId}`);
    // ...后续处理
  } catch (error) {
    // ...错误处理
  } finally {
    calculating.value = false;
  }
};
```

---

## 五、得分显示实现

### 5.1 数据结构

后端计算完成后返回的数据结构：

```json
{
  "mvScore": 85.5,
  "schemeName": "婚恋价值广东周边地区",
  "mvDetail": {
    "age": { "value": 30, "score": 12.5, "label": "30岁" },
    "height": { "value": 180, "score": 15.0, "label": "180cm" },
    "appearance": { "value": "帅气", "score": 20.0, "label": "帅气" },
    "wealth": { "value": 30, "score": 15.0, "label": "年收入30万" },
    "intelligence": { "value": "本科", "score": 10.0, "label": "本科" },
    "eq": { "value": 4, "score": 8.0, "label": "选中4项" },
    "sexual_ability": { "value": 30, "score": 3.0, "label": "30岁" },
    "commitment": { "value": 9, "score": 2.0, "label": "9分" }
  }
}
```

### 5.2 前端显示实现

在每个字段的label后添加得分显示：

**示例1：出生日期（通用）**

```vue
<template #label>
  出生日期 <span style="color: red;">*</span>
  <a-tooltip title="MV值计算必填：用于计算年龄维度">
    <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
  </a-tooltip>
  <span v-if="formState.mvDetail?.age" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
    (得分: {{ formState.mvDetail.age.score }}分)
  </span>
</template>
```

**示例2：身高（男性显示height得分，女性显示bmi得分）**

```vue
<template #label>
  身高 (cm) <span style="color: red;">*</span>
  <a-tooltip title="...">
    <QuestionCircleOutlined style="margin-left: 4px; color: #999;" />
  </a-tooltip>
  <span v-if="formState.mvDetail?.height && formState.baseInfo.gender === '男'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
    (得分: {{ formState.mvDetail.height.score }}分)
  </span>
  <span v-if="formState.mvDetail?.bmi && formState.baseInfo.gender === '女'" style="color: #52c41a; font-size: 12px; margin-left: 8px;">
    (BMI得分: {{ formState.mvDetail.bmi.score }}分)
  </span>
</template>
```

### 5.3 得分显示规则

| 条件 | 显示效果 |
|------|---------|
| 未计算MV | 不显示得分 |
| 已计算MV | 显示绿色得分文字：`(得分: 12.5分)` |
| 字体颜色 | `#52c41a`（Ant Design成功色） |
| 字体大小 | `12px` |
| 位置 | 紧跟在问号图标后，`margin-left: 8px` |

---

## 六、各维度得分对应关系

### 6.1 男性MV维度映射

| 前端字段 | 后端mvDetail键名 | 显示标签 |
|----------|-----------------|---------|
| 出生日期 | `age` | (得分: X分) |
| 身高 | `height` | (得分: X分) |
| 学历 | `intelligence` | (智商: X分) |
| 长相 | `appearance` | (得分: X分) |
| 年收入 | `wealth` | (财富: X分) |
| 情商评分 | `eq` | (情商: X分) |
| 长期专一承诺 | `commitment` | (承诺: X分) |
| 性能力（自动） | `sexual_ability` | - |

### 6.2 女性MV维度映射

| 前端字段 | 后端mvDetail键名 | 显示标签 |
|----------|-----------------|---------|
| 出生日期 | `age` | (得分: X分) |
| 身高 + 体重 | `bmi` | (BMI得分: X分) |
| 学历 | `education` | (得分: X分) |
| 长相 | `appearance` | (得分: X分) |
| 罩杯 | `bra_cup` | (得分: X分) |
| 父母情感状况 | `family` | (家庭: X分) |
| 性格（自动） | `personality` | - |

---

## 七、用户操作流程

### 7.1 完整计算流程

```
用户进入档案详情页
     ↓
填写/补充必填字段（标有红色*号）
     ↓
点击"计算MV"按钮
     ↓
前端验证必填项
     ↓
   验证失败 → 弹出警告提示缺失字段
   验证通过 ↓
     ↓
调用后端计算API
     ↓
后端计算并返回结果
     ↓
前端更新 mvScore 和 mvDetail
     ↓
在每个字段旁显示绿色得分
     ↓
弹出成功提示（总分+方案名）
```

### 7.2 错误提示示例

**必填项缺失**：

```
⚠️ 请先完善以下MV计算必填项：
出生日期、身高、年收入、情商评分（至少选择一项）
```

**计算成功**：

```
✓ MV值计算完成！总分: 85.50，使用方案: 婚恋价值广东周边地区
```

---

## 八、视觉效果说明

### 8.1 字段标记样式

- **红色星号** (`*`): `color: red;` - 标识必填项
- **灰色问号** (`?`): `color: #999;` - 提供字段说明的tooltip
- **绿色得分** (`(得分: X分)`): `color: #52c41a;` - 计算后显示的得分

### 8.2 完整显示效果示例

```
出生日期 * ? (得分: 12.5分)  [日期选择器]
身高 (cm) * ? (得分: 15.0分)  [数字输入框]
长相 * ? (得分: 20.0分)      [下拉选择]
年收入 * ? (财富: 15.0分)    [下拉选择]
情商评分 (多选) * ? (情商: 8.0分)  [复选框组]
长期专一承诺 * ? (承诺: 2.0分)     [单选框组]
```

---

## 九、技术实现要点

### 9.1 响应式数据绑定

```typescript
const formState = reactive({
  mvScore: null,      // MV总分
  mvDetail: null,     // MV详细得分（对象）
  baseInfo: { ... },
  extInfo: { ... }
});
```

### 9.2 条件渲染逻辑

使用 `v-if` 确保：
1. 只有计算后才显示得分
2. 男女性别显示不同的维度得分
3. 组合维度（如BMI）在所有相关字段旁显示

### 9.3 API数据同步

```typescript
// 计算完成后更新状态
formState.mvScore = data.mvScore;
formState.mvDetail = data.mvDetail;

// 页面加载时从数据库恢复已计算的MV值
if (data.mvScore) formState.mvScore = data.mvScore;
if (data.mvDetail) formState.mvDetail = data.mvDetail;
```

---

## 十、后端数据支持

后端已实现的功能：

1. ✅ 5套地域计算方案（MV_RULES常量）
2. ✅ 男女性别分别计算逻辑
3. ✅ 自动计算派生字段（年龄、BMI）
4. ✅ 单维度评分函数（evaluateDimension）
5. ✅ MV值持久化（保存到app_user_profile）
6. ✅ 返回详细得分明细（mvDetail）

---

## 十一、测试场景

### 11.1 必填项验证测试

| 测试场景 | 缺失字段 | 预期结果 |
|---------|---------|---------|
| 男性用户未填年收入 | annualIncome | 弹出警告："请先完善以下MV计算必填项：年收入" |
| 女性用户未填体重 | weight | 弹出警告："请先完善以下MV计算必填项：体重" |
| 情商评分未选择任何项 | eqScore | 弹出警告："请先完善以下MV计算必填项：情商评分（至少选择一项）" |
| 所有必填项已填写 | 无 | 正常发起API请求 |

### 11.2 得分显示测试

| 测试场景 | 操作步骤 | 预期结果 |
|---------|---------|---------|
| 首次打开档案页 | 刚注册的用户 | 不显示任何得分 |
| 计算完成后 | 点击"计算MV"成功 | 所有相关字段旁显示绿色得分 |
| 刷新页面 | F5刷新 | 得分依然显示（从数据库恢复） |
| 修改字段后 | 修改身高，未重新计算 | 显示的是上次计算的得分（提示用户重新计算） |

---

## 十二、未来优化方向

1. **实时提示** - 用户填写过程中实时提示还需填写的必填项
2. **得分变化提示** - 修改字段后，提示"字段已变化，建议重新计算MV"
3. **得分趋势** - 显示历史MV值变化曲线
4. **维度详情** - 点击得分可查看该维度的详细计算依据

---

## 十三、相关文档

- 📄 `MV值分地域计算方案及结果计算说明.md` - MV计算规则详细说明
- 📄 `MV值计算必填字段说明.md` - 所有必填字段的完整列表
- 📄 `PRD_幸福力项目_v1.0.md` - 产品需求文档
- 📄 `系统架构与数据库设计_幸福力项目_v1.0.md` - 数据库字段设计

---

**文档版本**: v1.0  
**更新时间**: 2026-01-15  
**编写人员**: AI Assistant  
**审核状态**: 待审核

