/**
 * MV值计算规则常量
 * 包含5套地域计算方案的完整评分表
 * 根据文档：匹配相关/MV值分地域计算方案及结果计算说明.md
 */

// 男性MV值计算维度类型
export enum MaleMvDimension {
  AGE = 'age',
  HEIGHT = 'height',
  APPEARANCE = 'appearance',
  WEALTH = 'wealth',
  INTELLIGENCE = 'intelligence',
  EQ = 'eq',
  SEXUAL_ABILITY = 'sexual_ability',
  COMMITMENT = 'commitment'
}

// 女性MV值计算维度类型
export enum FemaleMvDimension {
  AGE = 'age',
  HEIGHT = 'height',
  BMI = 'bmi',
  APPEARANCE = 'appearance',
  BRA_CUP = 'bra_cup',
  EDUCATION = 'education',
  PERSONALITY = 'personality',
  FAMILY = 'family'
}

// 评分规则接口
export interface ScoreRule {
  condition: (value: any) => boolean;
  score: number;
  label: string;
}

// MV计算方案接口
export interface MvCalculationScheme {
  id: number;
  code: string;
  name: string;
  male: Record<MaleMvDimension, ScoreRule[]>;
  female: Record<FemaleMvDimension, ScoreRule[]>;
}

/**
 * 4. 上海北京地区方案
 */
export const BEIJING_SHANGHAI_SCHEME: MvCalculationScheme = {
  id: 4,
  code: 'BEIJING_SHANGHAI',
  name: '婚恋价值上海北京地区',
  male: {
    [MaleMvDimension.AGE]: [
      { condition: (age) => age < 25, score: 8.5, label: '25岁以下' },
      { condition: (age) => age >= 25 && age <= 35, score: 12.5, label: '25-35岁' },
      { condition: (age) => age > 35, score: 8.5, label: '35岁以上' }
    ],
    [MaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 175, score: 8.5, label: '175cm以下' },
      { condition: (h) => h >= 175 && h <= 179, score: 10.5, label: '175-179cm' },
      { condition: (h) => h >= 180 && h <= 184, score: 12.5, label: '180-184cm' },
      { condition: (h) => h > 184, score: 10.5, label: '184cm以上' }
    ],
    [MaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '帅气' || a === '阳光' || a === '斯文', score: 10.5, label: '帅气' },
      { condition: (a) => a === '帅/网红' || a === '阳光帅气', score: 12.5, label: '帅/网红' }
    ],
    [MaleMvDimension.WEALTH]: [
      { condition: (w) => w >= 100, score: 12.5, label: '100万以上' },
      { condition: (w) => w >= 60 && w < 100, score: 10.5, label: '60-100W' },
      { condition: (w) => w >= 20 && w < 60, score: 8.5, label: '20-60W' },
      { condition: (w) => w < 20, score: 6.5, label: '20万以下' }
    ],
    [MaleMvDimension.INTELLIGENCE]: [
      { condition: (e) => e === '大专' || e === '大专以下' || e === '高中及以下', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本' || e === '一本' || e === '本科', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高' || e === '硕士' || e === '博士', score: 12.5, label: '985或更高' }
    ],
    [MaleMvDimension.EQ]: [
      { condition: (eq) => eq >= 5, score: 12.5, label: '5项优' },
      { condition: (eq) => eq === 4, score: 10.5, label: '任意4项优' },
      { condition: (eq) => eq === 3, score: 8.5, label: '任意3项优' },
      { condition: (eq) => eq === 2, score: 6.5, label: '任意2项优' },
      { condition: (eq) => eq === 1, score: 4.5, label: '任意1项优' }
    ],
    [MaleMvDimension.SEXUAL_ABILITY]: [
      { condition: (age) => age < 30, score: 12.5, label: '30岁以下' },
      { condition: (age) => age >= 30 && age <= 34, score: 11.5, label: '30-34岁' },
      { condition: (age) => age >= 35 && age <= 39, score: 10.5, label: '35-39岁' },
      { condition: (age) => age >= 40 && age <= 49, score: 8.5, label: '40-49岁' },
      { condition: (age) => age >= 50 && age <= 60, score: 4.5, label: '50-60岁' }
    ],
    [MaleMvDimension.COMMITMENT]: [
      { condition: (s) => s >= 91 && s <= 100, score: 12.5, label: '幸福力评测结果91-100' },
      { condition: (s) => s >= 81 && s <= 90, score: 10.5, label: '81-90' },
      { condition: (s) => s >= 71 && s <= 80, score: 8.5, label: '71-80' },
      { condition: (s) => s >= 61 && s <= 70, score: 6.5, label: '61-70' },
      { condition: (s) => s < 61, score: 4.5, label: '60分以下' }
    ]
  },
  female: {
    [FemaleMvDimension.AGE]: [
      { condition: (age) => age >= 20 && age <= 25, score: 12.5, label: '20-25岁' },
      { condition: (age) => age >= 26 && age <= 30, score: 10.5, label: '26-30岁' },
      { condition: (age) => age >= 31 && age <= 35, score: 8.5, label: '31-35岁' },
      { condition: (age) => age >= 36 && age <= 40, score: 6.5, label: '36-40岁' },
      { condition: (age) => age >= 41 && age <= 50, score: 4.5, label: '41-50岁' },
      { condition: (age) => age >= 51, score: 2.5, label: '51岁以上' }
    ],
    [FemaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 158, score: 8.5, label: '158cm以下' },
      { condition: (h) => h >= 159 && h <= 163, score: 10.5, label: '159-163cm' },
      { condition: (h) => h >= 164 && h <= 168, score: 12.5, label: '164-168cm' },
      { condition: (h) => h >= 169 && h <= 173, score: 10.5, label: '169-173cm' },
      { condition: (h) => h >= 174 && h <= 179, score: 9, label: '174-179cm' },
      { condition: (h) => h >= 180, score: 8, label: '180cm以上' }
    ],
    [FemaleMvDimension.BMI]: [
      { condition: (bmi) => bmi >= 18.5 && bmi < 24, score: 12.5, label: '18.5-23.9正常' },
      { condition: (bmi) => bmi < 18.5, score: 10.5, label: '<18.5偏瘦' },
      { condition: (bmi) => bmi >= 24 && bmi < 28, score: 8.5, label: '24-27.9超重' },
      { condition: (bmi) => bmi >= 28, score: 6.5, label: '≥28.0' }
    ],
    [FemaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '清秀' || a === '甜美' || a === '可爱', score: 10.5, label: '清秀/甜美' },
      { condition: (a) => a === '漂亮/网红', score: 12.5, label: '漂亮/网红' }
    ],
    [FemaleMvDimension.BRA_CUP]: [
      { condition: (c) => c === 'A', score: 6.5, label: 'A' },
      { condition: (c) => c === 'B', score: 12.5, label: 'B' },
      { condition: (c) => c === 'C', score: 12.5, label: 'C' },
      { condition: (c) => c === 'D', score: 10.5, label: 'D' },
      { condition: (c) => c === 'E及以上', score: 8.5, label: 'E及以上' }
    ],
    [FemaleMvDimension.EDUCATION]: [
      { condition: (e) => e === '大专以下' || e === '高中及以下', score: 6.5, label: '大专以下' },
      { condition: (e) => e === '大专', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本' || e === '一本' || e === '本科', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高' || e === '硕士' || e === '博士', score: 12.5, label: '985或更高' }
    ],
    [FemaleMvDimension.PERSONALITY]: [
      { condition: (p) => p >= 5, score: 12.5, label: '匹配到5+' },
      { condition: (p) => p === 4, score: 10.5, label: '匹配到4' },
      { condition: (p) => p === 3, score: 8.5, label: '匹配到3' },
      { condition: (p) => p === 2, score: 6.5, label: '匹配到2' },
      { condition: (p) => p === 1, score: 4.5, label: '匹配到1' },
      { condition: (p) => p === 0 || p === null || p === undefined, score: 0, label: '未测评' }
    ],
    [FemaleMvDimension.FAMILY]: [
      { condition: (f) => f?.includes('恩爱') || f?.includes('和睦') || f?.includes('有爱'), score: 12.5, label: '父母恩爱，相互尊重（家庭有爱）' },
      { condition: (f) => f?.includes('离异') && f?.includes('健康'), score: 10, label: '父母离异家庭健康' },
      { condition: (f) => f?.includes('冲突') || f?.includes('缺爱'), score: 7.5, label: '父母冲突家庭缺爱' }
    ]
  }
};

/**
 * 5. 东北新疆地区方案
 */
export const NORTHEAST_XINJIANG_SCHEME: MvCalculationScheme = {
  id: 5,
  code: 'NORTHEAST_XINJIANG',
  name: '婚恋价值东北新疆地区',
  male: {
    [MaleMvDimension.AGE]: [
      { condition: (age) => age < 25, score: 8.5, label: '25岁以下' },
      { condition: (age) => age >= 25 && age <= 35, score: 12.5, label: '25-35岁' },
      { condition: (age) => age > 35, score: 8.5, label: '35岁以上' }
    ],
    [MaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 175, score: 8.5, label: '175cm以下' },
      { condition: (h) => h >= 175 && h <= 180, score: 10.5, label: '175-180cm' },
      { condition: (h) => h >= 181 && h <= 185, score: 12.5, label: '181-185cm' },
      { condition: (h) => h > 185, score: 10.5, label: '185cm以上' }
    ],
    [MaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '帅气' || a === '阳光' || a === '斯文', score: 10.5, label: '帅气' },
      { condition: (a) => a === '帅/网红' || a === '阳光帅气', score: 12.5, label: '帅/网红' }
    ],
    [MaleMvDimension.WEALTH]: [
      { condition: (w) => w >= 20, score: 12.5, label: '20万以上' },
      { condition: (w) => w >= 15 && w < 20, score: 10.5, label: '15-20W' },
      { condition: (w) => w >= 10 && w < 15, score: 8.5, label: '10-15W' },
      { condition: (w) => w < 10, score: 6.5, label: '10万以下' }
    ],
    [MaleMvDimension.INTELLIGENCE]: [
      { condition: (e) => e === '大专' || e === '大专以下' || e === '高中及以下', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本' || e === '一本' || e === '本科', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高' || e === '硕士' || e === '博士', score: 12.5, label: '985或更高' }
    ],
    [MaleMvDimension.EQ]: [
      { condition: (eq) => eq >= 5, score: 12.5, label: '5项优' },
      { condition: (eq) => eq === 4, score: 10.5, label: '任意4项优' },
      { condition: (eq) => eq === 3, score: 8.5, label: '任意3项优' },
      { condition: (eq) => eq === 2, score: 6.5, label: '任意2项优' },
      { condition: (eq) => eq === 1, score: 4.5, label: '任意1项优' }
    ],
    [MaleMvDimension.SEXUAL_ABILITY]: [
      { condition: (age) => age < 30, score: 12.5, label: '30岁以下' },
      { condition: (age) => age >= 30 && age <= 34, score: 11.5, label: '30-34岁' },
      { condition: (age) => age >= 35 && age <= 39, score: 10.5, label: '35-39岁' },
      { condition: (age) => age >= 40 && age <= 49, score: 8.5, label: '40-49岁' },
      { condition: (age) => age >= 50 && age <= 60, score: 4.5, label: '50-60岁' }
    ],
    [MaleMvDimension.COMMITMENT]: [
      { condition: (s) => s >= 91 && s <= 100, score: 12.5, label: '幸福力评测结果91-100' },
      { condition: (s) => s >= 81 && s <= 90, score: 10.5, label: '81-90' },
      { condition: (s) => s >= 71 && s <= 80, score: 8.5, label: '71-80' },
      { condition: (s) => s >= 61 && s <= 70, score: 6.5, label: '61-70' },
      { condition: (s) => s < 61, score: 4.5, label: '60分以下' }
    ]
  },
  female: {
    [FemaleMvDimension.AGE]: [
      { condition: (age) => age >= 20 && age <= 25, score: 12.5, label: '20-25岁' },
      { condition: (age) => age >= 26 && age <= 30, score: 10.5, label: '26-30岁' },
      { condition: (age) => age >= 31 && age <= 35, score: 8.5, label: '31-35岁' },
      { condition: (age) => age >= 36 && age <= 40, score: 6.5, label: '36-40岁' },
      { condition: (age) => age >= 41 && age <= 50, score: 4.5, label: '41-50岁' },
      { condition: (age) => age >= 51, score: 2.5, label: '51岁以上' }
    ],
    [FemaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 157, score: 8.5, label: '157cm以下' },
      { condition: (h) => h >= 158 && h <= 162, score: 10.5, label: '158-162cm' },
      { condition: (h) => h >= 163 && h <= 167, score: 12.5, label: '163-167cm' },
      { condition: (h) => h >= 168 && h <= 172, score: 10.5, label: '168-172cm' },
      { condition: (h) => h >= 173 && h <= 178, score: 9, label: '173-178cm' },
      { condition: (h) => h >= 179, score: 8, label: '179cm以上' }
    ],
    [FemaleMvDimension.BMI]: [
      { condition: (bmi) => bmi >= 18.5 && bmi < 24, score: 12.5, label: '18.5-23.9正常' },
      { condition: (bmi) => bmi < 18.5, score: 10.5, label: '<18.5偏瘦' },
      { condition: (bmi) => bmi >= 24 && bmi < 28, score: 8.5, label: '24-27.9超重' },
      { condition: (bmi) => bmi >= 28, score: 6.5, label: '≥28.0' }
    ],
    [FemaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '清秀' || a === '甜美' || a === '可爱', score: 10.5, label: '清秀/甜美' },
      { condition: (a) => a === '漂亮/网红', score: 12.5, label: '漂亮/网红' }
    ],
    [FemaleMvDimension.BRA_CUP]: [
      { condition: (c) => c === 'A', score: 6.5, label: 'A' },
      { condition: (c) => c === 'B', score: 12.5, label: 'B' },
      { condition: (c) => c === 'C', score: 12.5, label: 'C' },
      { condition: (c) => c === 'D', score: 10.5, label: 'D' },
      { condition: (c) => c === 'E及以上', score: 8.5, label: 'E及以上' }
    ],
    [FemaleMvDimension.EDUCATION]: [
      { condition: (e) => e === '大专以下' || e === '高中及以下', score: 6.5, label: '大专以下' },
      { condition: (e) => e === '大专', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本' || e === '一本' || e === '本科', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高' || e === '硕士' || e === '博士', score: 12.5, label: '985或更高' }
    ],
    [FemaleMvDimension.PERSONALITY]: [
      { condition: (p) => p >= 5, score: 12.5, label: '匹配到5+' },
      { condition: (p) => p === 4, score: 10.5, label: '匹配到4' },
      { condition: (p) => p === 3, score: 8.5, label: '匹配到3' },
      { condition: (p) => p === 2, score: 6.5, label: '匹配到2' },
      { condition: (p) => p === 1, score: 4.5, label: '匹配到1' },
      { condition: (p) => p === 0 || p === null || p === undefined, score: 0, label: '未测评' }
    ],
    [FemaleMvDimension.FAMILY]: [
      { condition: (f) => f?.includes('恩爱') || f?.includes('和睦') || f?.includes('有爱'), score: 12.5, label: '父母恩爱，相互尊重（家庭有爱）' },
      { condition: (f) => f?.includes('离异') && f?.includes('健康'), score: 10, label: '父母离异家庭健康' },
      { condition: (f) => f?.includes('冲突') || f?.includes('缺爱'), score: 7.5, label: '父母冲突家庭缺爱' }
    ]
  }
};

/**
 * 1. 广东周边地区方案
 */
export const GUANGDONG_SCHEME: MvCalculationScheme = {
  id: 1,
  code: 'GUANGDONG',
  name: '婚恋价值广东周边地区',
  male: {
    [MaleMvDimension.AGE]: [
      { condition: (age) => age < 25, score: 8.5, label: '25岁以下' },
      { condition: (age) => age >= 25 && age <= 35, score: 12.5, label: '25-35岁' },
      { condition: (age) => age > 35, score: 8.5, label: '35岁以上' }
    ],
    [MaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 172, score: 8.5, label: '172cm以下' },
      { condition: (h) => h >= 172 && h <= 176, score: 10.5, label: '172-176cm' },
      { condition: (h) => h >= 177 && h <= 181, score: 12.5, label: '177-181cm' },
      { condition: (h) => h > 181, score: 10.5, label: '181cm以上' }
    ],
    [MaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '帅气' || a === '阳光' || a === '斯文', score: 10.5, label: '帅气' },
      { condition: (a) => a === '帅/网红' || a === '阳光帅气', score: 12.5, label: '帅/网红' }
    ],
    [MaleMvDimension.WEALTH]: [
      { condition: (w) => w >= 50, score: 12.5, label: '50万以上' },
      { condition: (w) => w >= 21 && w < 50, score: 10.5, label: '21-50W' },
      { condition: (w) => w >= 15 && w < 21, score: 8.5, label: '15-20W' },
      { condition: (w) => w < 15, score: 6.5, label: '15万以下' }
    ],
    [MaleMvDimension.INTELLIGENCE]: [
      { condition: (e) => e === '大专' || e === '大专以下' || e === '高中及以下', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本' || e === '一本' || e === '本科', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高' || e === '硕士' || e === '博士', score: 12.5, label: '985或更高' }
    ],
    [MaleMvDimension.EQ]: [
      { condition: (eq) => eq >= 5, score: 12.5, label: '5项优' },
      { condition: (eq) => eq === 4, score: 10.5, label: '任意4项优' },
      { condition: (eq) => eq === 3, score: 8.5, label: '任意3项优' },
      { condition: (eq) => eq === 2, score: 6.5, label: '任意2项优' },
      { condition: (eq) => eq === 1, score: 4.5, label: '任意1项优' }
    ],
    [MaleMvDimension.SEXUAL_ABILITY]: [
      { condition: (age) => age < 30, score: 12.5, label: '30岁以下' },
      { condition: (age) => age >= 30 && age <= 34, score: 11.5, label: '30-34岁' },
      { condition: (age) => age >= 35 && age <= 39, score: 10.5, label: '35-39岁' },
      { condition: (age) => age >= 40 && age <= 49, score: 8.5, label: '40-49岁' },
      { condition: (age) => age >= 50 && age <= 60, score: 4.5, label: '50-60岁' }
    ],
    [MaleMvDimension.COMMITMENT]: [
      { condition: (s) => s >= 91 && s <= 100, score: 12.5, label: '幸福力评测结果91-100' },
      { condition: (s) => s >= 81 && s <= 90, score: 10.5, label: '81-90' },
      { condition: (s) => s >= 71 && s <= 80, score: 8.5, label: '71-80' },
      { condition: (s) => s >= 61 && s <= 70, score: 6.5, label: '61-70' },
      { condition: (s) => s < 61, score: 4.5, label: '60分以下' }
    ]
  },
  female: {
    [FemaleMvDimension.AGE]: [
      { condition: (age) => age >= 20 && age <= 25, score: 12.5, label: '20-25岁' },
      { condition: (age) => age >= 26 && age <= 30, score: 10.5, label: '26-30岁' },
      { condition: (age) => age >= 31 && age <= 35, score: 8.5, label: '31-35岁' },
      { condition: (age) => age >= 36 && age <= 40, score: 6.5, label: '36-40岁' },
      { condition: (age) => age >= 41 && age <= 50, score: 4.5, label: '41-50岁' },
      { condition: (age) => age >= 51, score: 2.5, label: '51岁以上' }
    ],
    [FemaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 152, score: 8.5, label: '152cm以下' },
      { condition: (h) => h >= 153 && h <= 157, score: 10.5, label: '153-157cm' },
      { condition: (h) => h >= 158 && h <= 162, score: 12.5, label: '158-162cm' },
      { condition: (h) => h >= 163 && h <= 167, score: 10.5, label: '163-167cm' },
      { condition: (h) => h >= 168 && h <= 172, score: 9, label: '168-172cm' },
      { condition: (h) => h > 172, score: 8, label: '172cm以上' }
    ],
    [FemaleMvDimension.BMI]: [
      { condition: (bmi) => bmi >= 18.5 && bmi < 24, score: 12.5, label: '18.5-23.9正常' },
      { condition: (bmi) => bmi < 18.5, score: 10.5, label: '<18.5偏瘦' },
      { condition: (bmi) => bmi >= 24 && bmi < 28, score: 8.5, label: '24-27.9超重' },
      { condition: (bmi) => bmi >= 28, score: 6.5, label: '≥28.0' }
    ],
    [FemaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '清秀' || a === '甜美' || a === '可爱', score: 10.5, label: '清秀/甜美' },
      { condition: (a) => a === '漂亮/网红', score: 12.5, label: '漂亮/网红' }
    ],
    [FemaleMvDimension.BRA_CUP]: [
      { condition: (c) => c === 'A', score: 6.5, label: 'A' },
      { condition: (c) => c === 'B', score: 12.5, label: 'B' },
      { condition: (c) => c === 'C', score: 12.5, label: 'C' },
      { condition: (c) => c === 'D', score: 10.5, label: 'D' },
      { condition: (c) => c === 'E及以上', score: 8.5, label: 'E及以上' }
    ],
    [FemaleMvDimension.EDUCATION]: [
      { condition: (e) => e === '大专以下' || e === '高中及以下', score: 6.5, label: '大专以下' },
      { condition: (e) => e === '大专', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本' || e === '一本' || e === '本科', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高' || e === '硕士' || e === '博士', score: 12.5, label: '985或更高' }
    ],
    [FemaleMvDimension.PERSONALITY]: [
      { condition: (p) => p >= 5, score: 12.5, label: '匹配到5+' },
      { condition: (p) => p === 4, score: 10.5, label: '匹配到4' },
      { condition: (p) => p === 3, score: 8.5, label: '匹配到3' },
      { condition: (p) => p === 2, score: 6.5, label: '匹配到2' },
      { condition: (p) => p === 1, score: 4.5, label: '匹配到1' },
      { condition: (p) => p === 0 || p === null || p === undefined, score: 0, label: '未测评' }
    ],
    [FemaleMvDimension.FAMILY]: [
      { condition: (f) => f?.includes('恩爱') || f?.includes('和睦') || f?.includes('有爱'), score: 12.5, label: '父母恩爱，相互尊重（家庭有爱）' },
      { condition: (f) => f?.includes('离异') && f?.includes('健康'), score: 10, label: '父母离异家庭健康' },
      { condition: (f) => f?.includes('冲突') || f?.includes('缺爱'), score: 7.5, label: '父母冲突家庭缺爱' }
    ]
  }
};

/**
 * 2. 江浙周边地区方案
 */
export const JIANGZHE_SCHEME: MvCalculationScheme = {
  id: 2,
  code: 'JIANGZHE',
  name: '婚恋价值江浙周边地区',
  male: {
    [MaleMvDimension.AGE]: [
      { condition: (age) => age < 25, score: 8.5, label: '25岁以下' },
      { condition: (age) => age >= 25 && age <= 35, score: 12.5, label: '25-35岁' },
      { condition: (age) => age > 35, score: 8.5, label: '35岁以上' }
    ],
    [MaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 173, score: 8.5, label: '173cm以下' },
      { condition: (h) => h >= 173 && h <= 177, score: 10.5, label: '173-177cm' },
      { condition: (h) => h >= 178 && h <= 182, score: 12.5, label: '178-182cm' },
      { condition: (h) => h > 182, score: 10.5, label: '182cm以上' }
    ],
    [MaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '帅气' || a === '阳光' || a === '斯文', score: 10.5, label: '帅气' },
      { condition: (a) => a === '帅/网红' || a === '阳光帅气', score: 12.5, label: '帅/网红' }
    ],
    [MaleMvDimension.WEALTH]: [
      { condition: (w) => w >= 100, score: 12.5, label: '100万以上' },
      { condition: (w) => w >= 50 && w < 100, score: 10.5, label: '50-100W' },
      { condition: (w) => w >= 20 && w < 50, score: 8.5, label: '20W-50W' },
      { condition: (w) => w < 20, score: 6.5, label: '20W以下' }
    ],
    [MaleMvDimension.INTELLIGENCE]: [
      { condition: (e) => e === '大专' || e === '大专以下' || e === '高中及以下', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本' || e === '一本' || e === '本科', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高' || e === '硕士' || e === '博士', score: 12.5, label: '985或更高' }
    ],
    [MaleMvDimension.EQ]: [
      { condition: (eq) => eq >= 5, score: 12.5, label: '5项优' },
      { condition: (eq) => eq === 4, score: 10.5, label: '任意4项优' },
      { condition: (eq) => eq === 3, score: 8.5, label: '任意3项优' },
      { condition: (eq) => eq === 2, score: 6.5, label: '任意2项优' },
      { condition: (eq) => eq === 1, score: 4.5, label: '任意1项优' }
    ],
    [MaleMvDimension.SEXUAL_ABILITY]: [
      { condition: (age) => age < 30, score: 12.5, label: '30岁以下' },
      { condition: (age) => age >= 30 && age <= 34, score: 11.5, label: '30-34岁' },
      { condition: (age) => age >= 35 && age <= 39, score: 10.5, label: '35-39岁' },
      { condition: (age) => age >= 40 && age <= 49, score: 8.5, label: '40-49岁' },
      { condition: (age) => age >= 50 && age <= 60, score: 4.5, label: '50-60岁' }
    ],
    [MaleMvDimension.COMMITMENT]: [
      { condition: (s) => s >= 91 && s <= 100, score: 12.5, label: '幸福力评测结果91-100' },
      { condition: (s) => s >= 81 && s <= 90, score: 10.5, label: '81-90' },
      { condition: (s) => s >= 71 && s <= 80, score: 8.5, label: '71-80' },
      { condition: (s) => s >= 61 && s <= 70, score: 6.5, label: '61-70' },
      { condition: (s) => s < 61, score: 4.5, label: '60分以下' }
    ]
  },
  female: {
    [FemaleMvDimension.AGE]: [
      { condition: (age) => age >= 20 && age <= 25, score: 12.5, label: '20-25岁' },
      { condition: (age) => age >= 26 && age <= 30, score: 10.5, label: '26-30岁' },
      { condition: (age) => age >= 31 && age <= 35, score: 8.5, label: '31-35岁' },
      { condition: (age) => age >= 36 && age <= 40, score: 6.5, label: '36-40岁' },
      { condition: (age) => age >= 41 && age <= 50, score: 4.5, label: '41-50岁' },
      { condition: (age) => age >= 51, score: 2.5, label: '51岁以上' }
    ],
    [FemaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 155, score: 8.5, label: '155cm以下' },
      { condition: (h) => h >= 156 && h <= 160, score: 10.5, label: '156-160cm' },
      { condition: (h) => h >= 161 && h <= 165, score: 12.5, label: '161-165cm' },
      { condition: (h) => h >= 166 && h <= 170, score: 10.5, label: '166-170cm' },
      { condition: (h) => h >= 171 && h <= 177, score: 9, label: '171-177cm' },
      { condition: (h) => h > 177, score: 8, label: '177cm以上' }
    ],
    [FemaleMvDimension.BMI]: [
      { condition: (bmi) => bmi >= 18.5 && bmi < 24, score: 12.5, label: '18.5-23.9正常' },
      { condition: (bmi) => bmi < 18.5, score: 10.5, label: '<18.5偏瘦' },
      { condition: (bmi) => bmi >= 24 && bmi < 28, score: 8.5, label: '24-27.9超重' },
      { condition: (bmi) => bmi >= 28, score: 6.5, label: '≥28.0' }
    ],
    [FemaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '清秀' || a === '甜美' || a === '可爱', score: 10.5, label: '清秀/甜美' },
      { condition: (a) => a === '漂亮/网红', score: 12.5, label: '漂亮/网红' }
    ],
    [FemaleMvDimension.BRA_CUP]: [
      { condition: (c) => c === 'A', score: 6.5, label: 'A' },
      { condition: (c) => c === 'B', score: 12.5, label: 'B' },
      { condition: (c) => c === 'C', score: 12.5, label: 'C' },
      { condition: (c) => c === 'D', score: 10.5, label: 'D' },
      { condition: (c) => c === 'E及以上', score: 8.5, label: 'E及以上' }
    ],
    [FemaleMvDimension.EDUCATION]: [
      { condition: (e) => e === '大专以下' || e === '高中及以下', score: 6.5, label: '大专以下' },
      { condition: (e) => e === '大专', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本' || e === '一本' || e === '本科', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高' || e === '硕士' || e === '博士', score: 12.5, label: '985或更高' }
    ],
    [FemaleMvDimension.PERSONALITY]: [
      { condition: (p) => p >= 5, score: 12.5, label: '匹配到5' },
      { condition: (p) => p === 4, score: 10.5, label: '匹配到4' },
      { condition: (p) => p === 3, score: 8.5, label: '匹配到3' },
      { condition: (p) => p === 2, score: 6.5, label: '匹配到2' },
      { condition: (p) => p === 1, score: 4.5, label: '匹配到1' }
    ],
    [FemaleMvDimension.FAMILY]: [
      { condition: (f) => f?.includes('恩爱') || f?.includes('和睦') || f?.includes('有爱'), score: 12.5, label: '父母恩爱，相互尊重（家庭有爱）' },
      { condition: (f) => f?.includes('离异') && f?.includes('健康'), score: 10, label: '父母离异家庭健康' },
      { condition: (f) => f?.includes('冲突') || f?.includes('缺爱'), score: 7.5, label: '父母冲突家庭缺爱' }
    ]
  }
};

/**
 * 3. 全国普适版方案
 */
export const NATIONWIDE_SCHEME: MvCalculationScheme = {
  id: 3,
  code: 'NATIONWIDE',
  name: '婚恋价值全国普适版',
  male: {
    [MaleMvDimension.AGE]: [
      { condition: (age) => age < 25, score: 8.5, label: '25岁以下' },
      { condition: (age) => age >= 25 && age <= 35, score: 12.5, label: '25-35岁' },
      { condition: (age) => age > 35, score: 8.5, label: '35岁以上' }
    ],
    [MaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 170, score: 8.5, label: '170cm以下' },
      { condition: (h) => h >= 171 && h <= 175, score: 10.5, label: '171-175cm' },
      { condition: (h) => h >= 176 && h <= 180, score: 12.5, label: '176-180cm' },
      { condition: (h) => h > 180, score: 10.5, label: '180cm以上' }
    ],
    [MaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '帅气' || a === '阳光' || a === '斯文', score: 10.5, label: '帅气' },
      { condition: (a) => a === '帅/网红' || a === '阳光帅气', score: 12.5, label: '帅/网红' }
    ],
    [MaleMvDimension.WEALTH]: [
      { condition: (w) => w >= 20, score: 12.5, label: '20万以上' },
      { condition: (w) => w >= 15 && w < 20, score: 10.5, label: '15-20W' },
      { condition: (w) => w >= 10 && w < 15, score: 8.5, label: '10-15W' },
      { condition: (w) => w < 10, score: 6.5, label: '10万以下' }
    ],
    [MaleMvDimension.INTELLIGENCE]: [
      { condition: (e) => e === '大专' || e === '大专以下' || e === '高中及以下', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本' || e === '一本' || e === '本科', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高' || e === '硕士' || e === '博士', score: 12.5, label: '985或更高' }
    ],
    [MaleMvDimension.EQ]: [
      { condition: (eq) => eq >= 5, score: 12.5, label: '5项优' },
      { condition: (eq) => eq === 4, score: 10.5, label: '任意4项优' },
      { condition: (eq) => eq === 3, score: 8.5, label: '任意3项优' },
      { condition: (eq) => eq === 2, score: 6.5, label: '任意2项优' },
      { condition: (eq) => eq === 1, score: 4.5, label: '任意1项优' }
    ],
    [MaleMvDimension.SEXUAL_ABILITY]: [
      { condition: (age) => age < 30, score: 12.5, label: '30岁以下' },
      { condition: (age) => age >= 30 && age <= 34, score: 11.5, label: '30-34岁' },
      { condition: (age) => age >= 35 && age <= 39, score: 10.5, label: '35-39岁' },
      { condition: (age) => age >= 40 && age <= 49, score: 8.5, label: '40-49岁' },
      { condition: (age) => age >= 50 && age <= 60, score: 4.5, label: '50-60岁' }
    ],
    [MaleMvDimension.COMMITMENT]: [
      { condition: (s) => s >= 91 && s <= 100, score: 12.5, label: '幸福力评测结果91-100' },
      { condition: (s) => s >= 81 && s <= 90, score: 10.5, label: '81-90' },
      { condition: (s) => s >= 71 && s <= 80, score: 8.5, label: '71-80' },
      { condition: (s) => s >= 61 && s <= 70, score: 6.5, label: '61-70' },
      { condition: (s) => s < 61, score: 4.5, label: '60分以下' }
    ]
  },
  female: {
    [FemaleMvDimension.AGE]: [
      { condition: (age) => age >= 20 && age <= 25, score: 12.5, label: '20-25岁' },
      { condition: (age) => age >= 26 && age <= 30, score: 10.5, label: '26-30岁' },
      { condition: (age) => age >= 31 && age <= 35, score: 8.5, label: '31-35岁' },
      { condition: (age) => age >= 36 && age <= 40, score: 6.5, label: '36-40岁' },
      { condition: (age) => age >= 41 && age <= 50, score: 4.5, label: '41-50岁' },
      { condition: (age) => age >= 51, score: 2.5, label: '51岁以上' }
    ],
    [FemaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 152, score: 8.5, label: '152cm以下' },
      { condition: (h) => h >= 153 && h <= 157, score: 10.5, label: '153-157cm' },
      { condition: (h) => h >= 158 && h <= 162, score: 12.5, label: '158-162cm' },
      { condition: (h) => h >= 163 && h <= 167, score: 10.5, label: '163-167cm' },
      { condition: (h) => h >= 168 && h <= 172, score: 9, label: '168-172cm' },
      { condition: (h) => h > 172, score: 8, label: '172cm以上' }
    ],
    [FemaleMvDimension.BMI]: [
      { condition: (bmi) => bmi >= 18.5 && bmi < 24, score: 12.5, label: '18.5-23.9正常' },
      { condition: (bmi) => bmi < 18.5, score: 10.5, label: '<18.5偏瘦' },
      { condition: (bmi) => bmi >= 24 && bmi < 28, score: 8.5, label: '24-27.9超重' },
      { condition: (bmi) => bmi >= 28, score: 6.5, label: '≥28.0' }
    ],
    [FemaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '清秀' || a === '甜美' || a === '可爱', score: 10.5, label: '清秀/甜美' },
      { condition: (a) => a === '漂亮/网红', score: 12.5, label: '漂亮/网红' }
    ],
    [FemaleMvDimension.BRA_CUP]: [
      { condition: (c) => c === 'A', score: 6.5, label: 'A' },
      { condition: (c) => c === 'B', score: 12.5, label: 'B' },
      { condition: (c) => c === 'C', score: 12.5, label: 'C' },
      { condition: (c) => c === 'D', score: 10.5, label: 'D' },
      { condition: (c) => c === 'E及以上', score: 8.5, label: 'E及以上' }
    ],
    [FemaleMvDimension.EDUCATION]: [
      { condition: (e) => e === '大专以下' || e === '高中及以下', score: 6.5, label: '大专以下' },
      { condition: (e) => e === '大专', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本' || e === '一本' || e === '本科', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高' || e === '硕士' || e === '博士', score: 12.5, label: '985或更高' }
    ],
    [FemaleMvDimension.PERSONALITY]: [
      { condition: (p) => p >= 5, score: 12.5, label: '匹配到5+' },
      { condition: (p) => p === 4, score: 10.5, label: '匹配到4' },
      { condition: (p) => p === 3, score: 8.5, label: '匹配到3' },
      { condition: (p) => p === 2, score: 6.5, label: '匹配到2' },
      { condition: (p) => p === 1, score: 4.5, label: '匹配到1' },
      { condition: (p) => p === 0 || p === null || p === undefined, score: 0, label: '未测评' }
    ],
    [FemaleMvDimension.FAMILY]: [
      { condition: (f) => f?.includes('恩爱') || f?.includes('和睦') || f?.includes('有爱'), score: 12.5, label: '父母恩爱，相互尊重（家庭有爱）' },
      { condition: (f) => f?.includes('离异') && f?.includes('健康'), score: 10, label: '父母离异家庭健康' },
      { condition: (f) => f?.includes('冲突') || f?.includes('缺爱'), score: 7.5, label: '父母冲突家庭缺爱' }
    ]
  }
};

/**
 * 所有MV计算方案映射表
 */
export const MV_SCHEMES: Record<number, MvCalculationScheme> = {
  1: GUANGDONG_SCHEME,
  2: JIANGZHE_SCHEME,
  3: NATIONWIDE_SCHEME,
  4: BEIJING_SHANGHAI_SCHEME,
  5: NORTHEAST_XINJIANG_SCHEME
};
