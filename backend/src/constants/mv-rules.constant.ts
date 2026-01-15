/**
 * MV值计算规则常量
 * 包含5套地域计算方案的完整评分表
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
      { condition: (h) => h < 170, score: 8.5, label: '170cm以下' },
      { condition: (h) => h >= 170 && h < 175, score: 10.5, label: '170-175cm' },
      { condition: (h) => h >= 175 && h < 180, score: 12.5, label: '175-180cm' },
      { condition: (h) => h >= 180, score: 10.5, label: '180cm以上' }
    ],
    [MaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '帅/网红', score: 12.5, label: '帅/网红' }
    ],
    [MaleMvDimension.WEALTH]: [
      { condition: (w) => w >= 50, score: 12.5, label: '50万以上' },
      { condition: (w) => w >= 20 && w < 50, score: 10.5, label: '20-50W' },
      { condition: (w) => w >= 15 && w < 20, score: 8.5, label: '15-20W' },
      { condition: (w) => w < 15, score: 6.5, label: '15万以下' }
    ],
    [MaleMvDimension.INTELLIGENCE]: [
      { condition: (e) => e === '大专' || e === '大专以下', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高', score: 12.5, label: '985或更高' }
    ],
    [MaleMvDimension.EQ]: [
      { condition: (eq) => eq >= 5, score: 12.5, label: '5项优' },
      { condition: (eq) => eq === 4, score: 10.5, label: '任意4项优' },
      { condition: (eq) => eq === 3, score: 8.5, label: '任意3项优' },
      { condition: (eq) => eq === 2, score: 6.5, label: '任意2项优' },
      { condition: (eq) => eq === 1, score: 4.5, label: '任意1项优' },
      { condition: (eq) => eq === 0, score: 2.5, label: '无' }
    ],
    [MaleMvDimension.SEXUAL_ABILITY]: [
      { condition: (age) => age < 30, score: 12.5, label: '30岁以下' },
      { condition: (age) => age >= 30 && age < 35, score: 11.5, label: '30-35岁' },
      { condition: (age) => age >= 35 && age < 40, score: 10.5, label: '35-40岁' },
      { condition: (age) => age >= 40 && age < 50, score: 8.5, label: '40-50岁' },
      { condition: (age) => age >= 50 && age < 60, score: 4.5, label: '50-60岁' },
      { condition: (age) => age >= 60, score: 2.5, label: '60岁以上' }
    ],
    [MaleMvDimension.COMMITMENT]: [
      { condition: (s) => s >= 90, score: 12.5, label: '幸福力90-100' },
      { condition: (s) => s >= 70 && s < 90, score: 10.5, label: '70-80' },
      { condition: (s) => s >= 60 && s < 70, score: 8.5, label: '60-70' },
      { condition: (s) => s < 60, score: 6.5, label: '60分以下' }
    ]
  },
  female: {
    [FemaleMvDimension.AGE]: [
      { condition: (age) => age >= 20 && age <= 25, score: 12.5, label: '20-25岁' },
      { condition: (age) => age >= 26 && age <= 30, score: 10.5, label: '26-30岁' },
      { condition: (age) => age >= 31 && age <= 35, score: 8.5, label: '31-35岁' },
      { condition: (age) => age >= 36 && age <= 40, score: 6.5, label: '36-40岁' },
      { condition: (age) => age >= 41 && age <= 50, score: 4.5, label: '41-50岁' },
      { condition: (age) => age > 50, score: 2.5, label: '51岁以上' }
    ],
    [FemaleMvDimension.BMI]: [
      { condition: (bmi) => bmi >= 18.5 && bmi < 24, score: 12.5, label: '18.5-23.9正常' },
      { condition: (bmi) => bmi < 18.5, score: 10.5, label: '<18.5偏瘦' },
      { condition: (bmi) => bmi >= 24 && bmi <= 32, score: 8.5, label: '24-32超重' },
      { condition: (bmi) => bmi > 32, score: 6.5, label: '>32肥胖' }
    ],
    [FemaleMvDimension.APPEARANCE]: [
      { condition: (a) => a === '一般', score: 8.5, label: '一般' },
      { condition: (a) => a === '帅/网红', score: 12.5, label: '漂亮/网红' }
    ],
    [FemaleMvDimension.BRA_CUP]: [
      { condition: (c) => c === 'A', score: 6.5, label: 'A' },
      { condition: (c) => c === 'B', score: 12.5, label: 'B' },
      { condition: (c) => c === 'C', score: 12.5, label: 'C' },
      { condition: (c) => c === 'D', score: 10.5, label: 'D' },
      { condition: (c) => c === 'E及以上', score: 8.5, label: 'E及以上' }
    ],
    [FemaleMvDimension.EDUCATION]: [
      { condition: (e) => e === '大专以下', score: 6.5, label: '大专以下' },
      { condition: (e) => e === '大专', score: 8.5, label: '大专' },
      { condition: (e) => e === '二本', score: 9.5, label: '二本' },
      { condition: (e) => e === '普通一本', score: 10.5, label: '普通一本' },
      { condition: (e) => e === '211大学', score: 11.5, label: '211大学' },
      { condition: (e) => e === '985或更高', score: 12.5, label: '985或更高' }
    ],
    [FemaleMvDimension.PERSONALITY]: [
      { condition: (p) => p >= 5, score: 12.5, label: '匹配到5+' },
      { condition: (p) => p === 4, score: 10.5, label: '匹配到4' },
      { condition: (p) => p === 3, score: 8.5, label: '匹配到3' },
      { condition: (p) => p === 2, score: 6.5, label: '匹配到2' },
      { condition: (p) => p === 1, score: 4.5, label: '匹配到1' },
      { condition: (p) => p === 0, score: 2.5, label: '无' }
    ],
    [FemaleMvDimension.FAMILY]: [
      { condition: (f) => f === '父母恩爱，互相尊重家庭有爱' || f?.includes('恩爱'), score: 12.5, label: '父母恩爱' },
      { condition: (f) => f?.includes('离异'), score: 10, label: '父母离异家庭健康' },
      { condition: (f) => f?.includes('冲突'), score: 7.5, label: '父母冲突家庭缺爱' }
    ]
  }
};

/**
 * 2. 江浙周边地区方案（财富标准更高）
 */
export const JIANGZHE_SCHEME: MvCalculationScheme = {
  id: 2,
  code: 'JIANGZHE',
  name: '婚恋价值江浙周边地区',
  male: {
    ...GUANGDONG_SCHEME.male,
    [MaleMvDimension.WEALTH]: [
      { condition: (w) => w >= 100, score: 12.5, label: '100万以上' },
      { condition: (w) => w >= 50 && w < 100, score: 10.5, label: '50-100W' },
      { condition: (w) => w >= 20 && w < 50, score: 8.5, label: '20W-50W' },
      { condition: (w) => w < 20, score: 6.5, label: '20W以下' }
    ]
  },
  female: GUANGDONG_SCHEME.female
};

/**
 * 3. 全国普适版方案
 */
export const NATIONWIDE_SCHEME: MvCalculationScheme = {
  id: 3,
  code: 'NATIONWIDE',
  name: '婚恋价值全国普适版',
  male: {
    ...GUANGDONG_SCHEME.male,
    [MaleMvDimension.WEALTH]: [
      { condition: (w) => w >= 20, score: 12.5, label: '20万以上' },
      { condition: (w) => w >= 15 && w < 20, score: 10.5, label: '15-20W' },
      { condition: (w) => w >= 10 && w < 15, score: 8.5, label: '10-15W' },
      { condition: (w) => w < 10, score: 6.5, label: '10万以下' }
    ]
  },
  female: GUANGDONG_SCHEME.female
};

/**
 * 4. 上海北京地区方案（财富标准最高）
 */
export const BEIJING_SHANGHAI_SCHEME: MvCalculationScheme = {
  id: 4,
  code: 'BEIJING_SHANGHAI',
  name: '婚恋价值上海北京地区',
  male: {
    ...GUANGDONG_SCHEME.male,
    [MaleMvDimension.WEALTH]: [
      { condition: (w) => w >= 100, score: 12.5, label: '100万以上' },
      { condition: (w) => w >= 60 && w < 100, score: 10.5, label: '60-100W' },
      { condition: (w) => w >= 20 && w < 60, score: 8.5, label: '20-60W' },
      { condition: (w) => w < 20, score: 6.5, label: '20万以下' }
    ]
  },
  female: GUANGDONG_SCHEME.female
};

/**
 * 5. 东北新疆地区方案（身高标准更高）
 */
export const NORTHEAST_XINJIANG_SCHEME: MvCalculationScheme = {
  id: 5,
  code: 'NORTHEAST_XINJIANG',
  name: '婚恋价值东北新疆地区',
  male: {
    ...GUANGDONG_SCHEME.male,
    [MaleMvDimension.HEIGHT]: [
      { condition: (h) => h < 175, score: 8.5, label: '175cm以下' },
      { condition: (h) => h >= 175 && h < 180, score: 10.5, label: '175-180cm' },
      { condition: (h) => h >= 180 && h < 185, score: 12.5, label: '180-185cm' },
      { condition: (h) => h >= 185, score: 10.5, label: '185cm以上' }
    ],
    [MaleMvDimension.WEALTH]: [
      { condition: (w) => w >= 20, score: 12.5, label: '20万以上' },
      { condition: (w) => w >= 15 && w < 20, score: 10.5, label: '15-20W' },
      { condition: (w) => w >= 10 && w < 15, score: 8.5, label: '10-15W' },
      { condition: (w) => w < 10, score: 6.5, label: '10万以下' }
    ]
  },
  female: GUANGDONG_SCHEME.female
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

