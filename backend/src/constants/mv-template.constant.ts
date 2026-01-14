/**
 * MV值地域计算方案常量
 * 
 * 系统预设5套地域方案，门店创建时由超级管理员手动选择绑定
 * 详细计算规则参见: /匹配相关/MV值分地域计算方案及结果计算说明.md
 */

export enum MvTemplateCode {
  GUANGDONG = 'GUANGDONG',           // 广东周边地区
  JIANGZHE = 'JIANGZHE',             // 江浙周边地区
  NATIONWIDE = 'NATIONWIDE',         // 全国普适版
  BEIJING_SHANGHAI = 'BEIJING_SHANGHAI', // 上海北京地区
  NORTHEAST_XINJIANG = 'NORTHEAST_XINJIANG', // 东北新疆地区
}

export interface MvTemplate {
  id: number;
  code: MvTemplateCode;
  name: string;
  description: string;
  region: string;
}

/**
 * MV方案列表（供前端下拉选择）
 */
export const MV_TEMPLATES: MvTemplate[] = [
  {
    id: 1,
    code: MvTemplateCode.GUANGDONG,
    name: '婚恋价值广东周边地区',
    description: '适用于广东及周边地区',
    region: '广东、广西、福建等',
  },
  {
    id: 2,
    code: MvTemplateCode.JIANGZHE,
    name: '婚恋价值江浙周边地区',
    description: '适用于江浙及周边地区',
    region: '江苏、浙江、安徽等',
  },
  {
    id: 3,
    code: MvTemplateCode.NATIONWIDE,
    name: '婚恋价值全国普适版',
    description: '适用于全国大部分地区',
    region: '全国通用',
  },
  {
    id: 4,
    code: MvTemplateCode.BEIJING_SHANGHAI,
    name: '婚恋价值上海北京地区',
    description: '适用于京沪等一线城市',
    region: '北京、上海、深圳等',
  },
  {
    id: 5,
    code: MvTemplateCode.NORTHEAST_XINJIANG,
    name: '婚恋价值东北新疆地区',
    description: '适用于东北、新疆等地区',
    region: '东北三省、新疆等',
  },
];

/**
 * 根据ID获取MV方案
 */
export function getMvTemplateById(id: number): MvTemplate | undefined {
  return MV_TEMPLATES.find(template => template.id === id);
}

/**
 * 验证MV方案ID是否有效
 */
export function isValidMvTemplateId(id: number): boolean {
  return id >= 1 && id <= 5;
}

