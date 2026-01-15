/**
 * 依恋关系类型详细信息
 * 参考文档: 需求开发功能确定文档.md (358-391)
 */

export interface AttachmentTypeInfo {
  type: string // 类型名称，如"安全型"
  fullName: string // 完整名称，如"安全型依恋"
  label: string // 类型标签，如"健康核心型"
  dimensions: string // 维度组合，如"低焦虑 + 低回避"
  coreTraits: string // 核心特质
  behaviors: string[] // 典型行为表现
  advantage?: string // 相处优势（安全型特有）
  painPoint?: string // 核心痛点（其他类型特有）
  color: string // UI 显示颜色
}

export const ATTACHMENT_TYPE_INFO: Record<string, AttachmentTypeInfo> = {
  安全型: {
    type: '安全型',
    fullName: '安全型依恋',
    label: '健康核心型',
    dimensions: '低焦虑 + 低回避',
    coreTraits: '安全感充足，既信任伴侣、愿意亲密，又能保持自我独立，是最健康的依恋类型。',
    behaviors: [
      '沟通直接坦诚：开心时主动分享，有矛盾时愿意直面沟通，不冷战、不指责',
      '亲密与独立平衡：享受和伴侣的相处，也能坦然接受彼此的独处时间，不粘人、不疏离',
      '情绪稳定：不会因伴侣的小疏忽过度猜忌，被拒绝 / 产生矛盾时，能理性看待，不极端',
      '懂得共情：能感知伴侣的情绪需求，主动提供支持，也能坦然向伴侣求助',
    ],
    advantage:
      '适配所有依恋类型，能包容伴侣的依恋短板，是亲密关系中的「稳定器」，关系质量往往最高。',
    color: '#52c41a', // 绿色
  },
  焦虑型: {
    type: '焦虑型',
    fullName: '焦虑型依恋',
    label: '渴求亲密型',
    dimensions: '高焦虑 + 低回避',
    coreTraits:
      '极度渴望亲密与认可，害怕被抛弃，对关系的安全感极低，习惯通过「索取关注」确认爱意。',
    behaviors: [
      '患得患失：伴侣回复消息慢、语气冷淡，就会脑补「对方不爱自己」，陷入焦虑',
      '过度索取联结：频繁发消息、打电话，要求报备行程，渴望时刻黏在一起，害怕独处',
      '情绪波动大：被忽视时易委屈、愤怒、哭闹，被安抚后又快速平复，反复循环',
      '低自我价值：把伴侣的态度当作自我价值的评判标准，会为了留住对方妥协、讨好，甚至放弃自我边界',
    ],
    painPoint:
      '过度依赖会给伴侣带来巨大压力，容易让关系陷入「追 - 逃」模式，越焦虑越抓紧，伴侣越想回避。',
    color: '#faad14', // 橙色
  },
  回避型: {
    type: '回避型',
    fullName: '回避型依恋',
    label: '疏离独立型',
    dimensions: '低焦虑 + 高回避',
    coreTraits:
      '极度重视个人独立，排斥情感亲密与依赖，习惯用「疏离」和「冷漠」保护自己，内心深处害怕被束缚。',
    behaviors: [
      '抗拒过度亲密：伴侣主动撒娇、倾诉、肢体亲密时，会下意识回避，感到烦躁',
      '情感封闭：很少袒露内心的脆弱与真实想法，被追问感受时，常以「没事」「没必要」敷衍',
      '逃避冲突：发生矛盾时第一反应是冷战、拉黑、失联，拒绝沟通，认为「独处比解决问题更重要」',
      '假性独立：嘴上说「不需要伴侣」，内心深处渴望被爱，但不敢接受，会把亲密等同于「失去自由」',
    ],
    painPoint:
      '疏离的行为会让伴侣感到被忽视、被冷落，长期下来消耗对方的爱意，难以建立深度联结。',
    color: '#1890ff', // 蓝色
  },
  紊乱型: {
    type: '紊乱型',
    fullName: '恐惧型依恋（紊乱型）',
    label: '矛盾纠结型',
    dimensions: '高焦虑 + 高回避',
    coreTraits:
      '内心充满极致矛盾—— 既极度渴望亲密、害怕被抛弃（高焦虑），又极度抗拒亲密、害怕被伤害（高回避），是最不稳定的依恋类型。',
    behaviors: [
      '亲密推拉：伴侣靠近时，会下意识推开、疏离；伴侣离开时，又会极度焦虑、拼命挽回，反复陷入「追 - 逃 - 追」',
      '敏感又冷漠：对伴侣的负面信号极度敏感，容易脑补被抛弃，却又不愿主动沟通，用冷漠伪装自己的脆弱',
      '信任匮乏：很难真正信任伴侣，即使对方表达爱意，也会怀疑其真实性，害怕投入后被背叛',
      '自我内耗：一边渴望稳定的亲密关系，一边又不断破坏关系，陷入「想要爱，又怕爱」的极致内耗',
    ],
    painPoint:
      '自身的矛盾会让关系反复拉扯，不仅折磨自己，也会让伴侣感到疲惫，是亲密关系中最难磨合的类型。',
    color: '#f5222d', // 红色
  },
}

/**
 * 获取依恋类型的详细信息
 * @param type - 类型名称（如"安全型"、"焦虑型"）
 * @returns 类型详细信息
 */
export function getAttachmentTypeInfo(type: string): AttachmentTypeInfo | null {
  // 处理"恐惧型"的别名
  if (type === '恐惧型' || type.includes('恐惧')) {
    return ATTACHMENT_TYPE_INFO['紊乱型']
  }
  
  // 提取核心类型名（去除"依恋"后缀）
  const coreType = type.replace(/依恋|型依恋/g, '').trim()
  
  // 查找匹配的类型
  for (const key in ATTACHMENT_TYPE_INFO) {
    if (key === coreType || type.includes(key)) {
      return ATTACHMENT_TYPE_INFO[key]
    }
  }
  
  return null
}

/**
 * 获取维度得分的描述
 * @param dimension - 维度标识 ('A' 焦虑, 'B' 回避, 'C' 安全感)
 * @param score - 得分 (0-12)
 * @returns 描述文本
 */
export function getDimensionDescription(dimension: string, score: number): string {
  const threshold = 5
  const level = score >= threshold ? '高' : '低'
  
  const descMap: Record<string, Record<string, string>> = {
    A: {
      高: '对关系被抛弃、不被爱的担忧程度较高',
      低: '对关系的安全感较强，不易焦虑',
    },
    B: {
      高: '对情感亲密、过度依赖的抗拒程度较高',
      低: '愿意建立情感亲密，不排斥依赖',
    },
    C: {
      高: '安全感充足，信任伴侣',
      低: '安全感不足，需要建立信任',
    },
  }
  
  return descMap[dimension]?.[level] || ''
}

