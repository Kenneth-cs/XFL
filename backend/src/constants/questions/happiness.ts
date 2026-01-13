/**
 * 婚恋幸福力测评题库
 * 20个维度，共150+题，每个维度有不同的评分标准
 * 计分逻辑：每题选项对应分值，部分题目不计分
 */

export interface HappinessOption {
  value: number;
  label: string;
}

export interface HappinessQuestion {
  questionId: string;
  dimensionId: number; // 1-20 对应20个维度
  content: string;
  options: HappinessOption[];
  isIgnored?: boolean; // 是否不计分（干扰题）
  subLabel?: string; // 子标签（如"自我情绪评估"等）
}

export interface HappinessDimension {
  id: number;
  name: string;
  shortName: string; // 如"乐商"、"情商"
  description: string;
  totalQuestions: number;
  maxScore: number; // 该维度可获得的最高分
  targetScore: number; // 换算目标分（通常是10分）
}

/**
 * 20个维度配置
 */
export const HAPPINESS_DIMENSIONS: HappinessDimension[] = [
  { id: 1, name: '积极性格', shortName: '乐商', description: '积极性格，是开启婚恋幸福的钥匙', totalQuestions: 24, maxScore: 120, targetScore: 10 },
  { id: 2, name: '积极情绪', shortName: '情商', description: '善用积极情绪，是婚恋中最高的相处智慧', totalQuestions: 4, maxScore: 24, targetScore: 10 },
  { id: 3, name: '积极心态', shortName: '心商', description: '让积极心态成为灯塔，照亮幸福航向', totalQuestions: 3, maxScore: 21, targetScore: 10 },
  { id: 4, name: '积极力量', shortName: '施容', description: '将积极力量，铸成婚恋幸福的坚实基石', totalQuestions: 4, maxScore: 16, targetScore: 10 },
  { id: 5, name: '积极语言', shortName: '语商', description: '温暖对话，用积极语言共建爱的幸福力', totalQuestions: 3, maxScore: 21, targetScore: 10 },
  { id: 6, name: '积极沟通', shortName: '施语', description: '积极沟通，是婚恋关系进行的光合作用', totalQuestions: 3, maxScore: 15, targetScore: 10 },
  { id: 7, name: '积极教育', shortName: '素质', description: '幸福是一本合著，以积极教育为笔写成', totalQuestions: 5, maxScore: 25, targetScore: 10 },
  { id: 8, name: '积极教养', shortName: '管教', description: '幸福是一种语言，由积极教养代代相传', totalQuestions: 5, maxScore: 20, targetScore: 10 },
  { id: 9, name: '积极习惯', shortName: '自律', description: '爱如长河，在积极习惯河床里流向幸福', totalQuestions: 5, maxScore: 25, targetScore: 10 },
  { id: 10, name: '积极天赋', shortName: '优势', description: '让积极天赋交织，奏出婚恋的幸福和声', totalQuestions: 2, maxScore: 10, targetScore: 10 },
  { id: 11, name: '积极自尊', shortName: '修养', description: '幸福回向积极自尊校准，吸引对等的爱', totalQuestions: 10, maxScore: 40, targetScore: 10 },
  { id: 12, name: '积极关系', shortName: '爱商', description: '幸福是张底片，由积极关系彰显成真', totalQuestions: 23, maxScore: 161, targetScore: 10 },
  { id: 13, name: '积极改变', shortName: '勇气', description: '积极改变，是通往幸福不可绕行的阶梯', totalQuestions: 5, maxScore: 25, targetScore: 10 },
  { id: 14, name: '积极信念', shortName: '希望', description: '幸福的内核，是坚信彼此价值的积极信念', totalQuestions: 8, maxScore: 32, targetScore: 10 },
  { id: 15, name: '积极体验', shortName: '福流', description: '积极体验，是幸福婚恋可持续的燃料', totalQuestions: 9, maxScore: 45, targetScore: 10 },
  { id: 16, name: '积极品质', shortName: '福商', description: '婚恋的幸福力，是你积极品质绽放的光', totalQuestions: 10, maxScore: 50, targetScore: 10 },
  { id: 17, name: '积极投入', shortName: '志商', description: '幸福如明火，需以积极投入不断添薪', totalQuestions: 3, maxScore: 18, targetScore: 10 },
  { id: 18, name: '积极自我', shortName: '德商', description: '幸福的婚恋，源于两个积极自我的同频共振', totalQuestions: 10, maxScore: 40, targetScore: 10 },
  { id: 19, name: '积极目标', shortName: '财商', description: '以积极目标为薪火，燃亮婚恋的幸福长路', totalQuestions: 4, maxScore: 16, targetScore: 10 },
  { id: 20, name: '积极意义', shortName: '健商', description: '看见积极意义，是婚恋幸福的本质', totalQuestions: 12, maxScore: 48, targetScore: 10 },
];

/**
 * 通用选项配置
 */
const OPTIONS_1_5: HappinessOption[] = [
  { value: 1, label: '非常不符合' },
  { value: 2, label: '不太符合' },
  { value: 3, label: '一般（既不符合也不背离）' },
  { value: 4, label: '比较符合' },
  { value: 5, label: '非常符合' },
];

const OPTIONS_0_6: HappinessOption[] = [
  { value: 0, label: '非常不符合' },
  { value: 1, label: '很不符合' },
  { value: 2, label: '不太符合' },
  { value: 3, label: '一般（既不符合也不背离）' },
  { value: 4, label: '比较符合' },
  { value: 5, label: '非常符合' },
  { value: 6, label: '极度符合' },
];

const OPTIONS_1_7: HappinessOption[] = [
  { value: 1, label: '从来没有' },
  { value: 2, label: '几乎没有' },
  { value: 3, label: '很少有' },
  { value: 4, label: '一般' },
  { value: 5, label: '比较多' },
  { value: 6, label: '较多' },
  { value: 7, label: '极多' },
];

const OPTIONS_1_4: HappinessOption[] = [
  { value: 1, label: '非常不符合' },
  { value: 2, label: '不符合' },
  { value: 3, label: '基本符合' },
  { value: 4, label: '非常符合' },
];

/**
 * 完整题库（按维度组织）
 */
export const HAPPINESS_QUESTIONS: HappinessQuestion[] = [
  // ============== 第一维度：积极性格（24题） ==============
  { questionId: 'D1-Q1', dimensionId: 1, subLabel: '创造力', content: '我喜欢尝试新方法来解决问题', options: OPTIONS_1_5 },
  { questionId: 'D1-Q2', dimensionId: 1, subLabel: '好奇心', content: '我总是对新事物充满兴趣', options: OPTIONS_1_5 },
  { questionId: 'D1-Q3', dimensionId: 1, subLabel: '开放性思维', content: '我愿意从不同角度看待问题', options: OPTIONS_1_5 },
  { questionId: 'D1-Q4', dimensionId: 1, subLabel: '好学', content: '我喜欢学习新知识和技能', options: OPTIONS_1_5 },
  { questionId: 'D1-Q5', dimensionId: 1, subLabel: '洞察力', content: '我能够为他人提供明智的建议', options: OPTIONS_1_5 },
  { questionId: 'D1-Q6', dimensionId: 1, subLabel: '勇敢', content: '在困难面前，我不会轻易退缩', options: OPTIONS_1_5 },
  { questionId: 'D1-Q7', dimensionId: 1, subLabel: '毅力', content: '我能够坚持完成我的任务', options: OPTIONS_1_5 },
  { questionId: 'D1-Q8', dimensionId: 1, subLabel: '正值', content: '我总是诚实地对待他人和自己', options: OPTIONS_1_5 },
  { questionId: 'D1-Q9', dimensionId: 1, subLabel: '热情', content: '我对生活充满热情和活力', options: OPTIONS_1_5 },
  { questionId: 'D1-Q10', dimensionId: 1, subLabel: '爱与被爱的能力', content: '我能够与他人建立深厚的关系', options: OPTIONS_1_5 },
  { questionId: 'D1-Q11', dimensionId: 1, subLabel: '善良', content: '我愿意帮助他人，即使他们并不认识我', options: OPTIONS_1_5 },
  { questionId: 'D1-Q12', dimensionId: 1, subLabel: '社交能力', content: '我能够理解他人的感受和需求', options: OPTIONS_1_5 },
  { questionId: 'D1-Q13', dimensionId: 1, subLabel: '合作', content: '我能够与团队成员很好地协作', options: OPTIONS_1_5 },
  { questionId: 'D1-Q14', dimensionId: 1, subLabel: '公平', content: '我对待每个人都很公平', options: OPTIONS_1_5 },
  { questionId: 'D1-Q15', dimensionId: 1, subLabel: '领导力', content: '我能够带领团队实现目标', options: OPTIONS_1_5 },
  { questionId: 'D1-Q16', dimensionId: 1, subLabel: '宽恕', content: '我能够原谅他人的错误', options: OPTIONS_1_5 },
  { questionId: 'D1-Q17', dimensionId: 1, subLabel: '谦逊', content: '我保持谦虚的态度，不自视过高', options: OPTIONS_1_5 },
  { questionId: 'D1-Q18', dimensionId: 1, subLabel: '谨慎', content: '我对自己的决定非常谨慎', options: OPTIONS_1_5 },
  { questionId: 'D1-Q19', dimensionId: 1, subLabel: '自我调节', content: '我能够控制自己的情绪和行为', options: OPTIONS_1_5 },
  { questionId: 'D1-Q20', dimensionId: 1, subLabel: '对美和卓越的欣赏', content: '我能够欣赏生活中的美好事物', options: OPTIONS_1_5 },
  { questionId: 'D1-Q21', dimensionId: 1, subLabel: '感激', content: '我经常感激他人的帮助', options: OPTIONS_1_5 },
  { questionId: 'D1-Q22', dimensionId: 1, subLabel: '希望', content: '我对未来充满希望', options: OPTIONS_1_5 },
  { questionId: 'D1-Q23', dimensionId: 1, subLabel: '幽默', content: '我喜欢用幽默来调节气氛', options: OPTIONS_1_5 },
  { questionId: 'D1-Q24', dimensionId: 1, subLabel: '信仰', content: '我对生活有坚定的信念', options: OPTIONS_1_5 },

  // ============== 第二维度：积极情绪（4题） ==============
  { questionId: 'D2-Q1', dimensionId: 2, subLabel: '自我情绪评估', content: '大多数时候我很清楚当时自己为什么有那种特定的感受', options: OPTIONS_0_6 },
  { questionId: 'D2-Q2', dimensionId: 2, subLabel: '他人情绪评估', content: '我总是能从我的朋友的行为中了解到他们的情绪', options: OPTIONS_0_6 },
  { questionId: 'D2-Q3', dimensionId: 2, subLabel: '情绪的控制', content: '我能控制好自己的脾气并且理智地处理问题', options: OPTIONS_0_6 },
  { questionId: 'D2-Q4', dimensionId: 2, subLabel: '情绪运用', content: '我总是为自己设定目标然后尽自己最大的努力去完成他们', options: OPTIONS_0_6 },

  // ============== 第三维度：积极心态（3题） ==============
  { questionId: 'D3-Q1', dimensionId: 3, subLabel: '可理解感', content: '我能够理解发生在我周围的事情', options: OPTIONS_1_7 },
  { questionId: 'D3-Q2', dimensionId: 3, subLabel: '可控制感', content: '当事情出错时，我通常能找到解决问题的方法', options: OPTIONS_1_7 },
  { questionId: 'D3-Q3', dimensionId: 3, subLabel: '意义感', content: '我感到生活中的事情是有趣的', options: OPTIONS_1_7 },

  // ============== 第四维度：积极力量（4题） ==============
  { questionId: 'D4-Q1', dimensionId: 4, subLabel: '清晰性', content: '当我做某件事情的时候，我总是很清楚自己为什么这么做', options: OPTIONS_1_4 },
  { questionId: 'D4-Q2', dimensionId: 4, subLabel: '接纳性', content: '我愿意承担自己表达真实的想法所带来的负面后果', options: OPTIONS_1_4 },
  { questionId: 'D4-Q3', dimensionId: 4, subLabel: '一致性', content: '我常忽略自己内心深处的想法和感受', options: OPTIONS_1_4 },
  { questionId: 'D4-Q4', dimensionId: 4, subLabel: '真诚性', content: '我认为在与人交往中真诚和开放很重要', options: OPTIONS_1_4 },

  // ============== 第五维度：积极语言（3题） ==============
  { questionId: 'D5-Q1', dimensionId: 5, content: '我高兴快乐的时候就会表现出来', options: OPTIONS_1_7 },
  { questionId: 'D5-Q2', dimensionId: 5, content: '有时候看悲伤的电影会令我哭出来', options: OPTIONS_1_7 },
  { questionId: 'D5-Q3', dimensionId: 5, content: '我是一个情绪上富于表达的人', options: OPTIONS_1_7 },

  // ============== 第六维度：积极沟通（3题） ==============
  { questionId: 'D6-Q1', dimensionId: 6, subLabel: '沟通技能', content: '与人交流中目光接触，手势、姿势表现适当', options: OPTIONS_1_5 },
  { questionId: 'D6-Q2', dimensionId: 6, subLabel: '沟通认知', content: '通过询问，请他完整地解释他的意思', options: OPTIONS_1_5 },
  { questionId: 'D6-Q3', dimensionId: 6, subLabel: '沟通倾向', content: '渴望被他人理解', options: OPTIONS_1_5 },

  // ============== 第七维度：积极教育（5题） ==============
  { questionId: 'D7-Q1', dimensionId: 7, subLabel: '教育成效', content: '当父母为我的前程做规划时，父母几乎可以肯定他们能帮我实现', options: OPTIONS_1_5 },
  { questionId: 'D7-Q2', dimensionId: 7, subLabel: '父母的责任', content: '那些无法让自己的孩子听自己讲话的父母，根本不懂如何同自己的子女相处', options: OPTIONS_1_5 },
  { questionId: 'D7-Q3', dimensionId: 7, subLabel: '子女的控制', content: '即使我常常大发脾气，父母也不应放弃努力', options: OPTIONS_1_5 },
  { questionId: 'D7-Q4', dimensionId: 7, subLabel: '运气或机遇', content: '大多数父母认识不到，偶然事件对他们的孩子最终的表现影响有多大', options: OPTIONS_1_5 },
  { questionId: 'D7-Q5', dimensionId: 7, subLabel: '父母的控制', content: '父母让我改变主意并不是件难以做到的事', options: OPTIONS_1_5 },

  // ============== 第八维度：积极教养（5题） ==============
  { questionId: 'D8-Q1', dimensionId: 8, subLabel: '情感交流', content: '我们相互之间不大愿意表露感情', options: [
    { value: 1, label: '非常不像我家' },
    { value: 2, label: '不太像我家' },
    { value: 3, label: '比较像我家' },
    { value: 4, label: '非常像我家' },
  ] },
  { questionId: 'D8-Q2', dimensionId: 8, subLabel: '积极沟通', content: '我们家的人相互之间说话很诚实，很坦率', options: [
    { value: 1, label: '非常不像我家' },
    { value: 2, label: '不太像我家' },
    { value: 3, label: '比较像我家' },
    { value: 4, label: '非常像我家' },
  ] },
  { questionId: 'D8-Q3', dimensionId: 8, subLabel: '自我主义', content: '我们家的人过分以自己为中心，只顾个人', options: [
    { value: 1, label: '非常不像我家' },
    { value: 2, label: '不太像我家' },
    { value: 3, label: '比较像我家' },
    { value: 4, label: '非常像我家' },
  ] },
  { questionId: 'D8-Q4', dimensionId: 8, subLabel: '问题解决', content: '我们家里大部分日常生活问题能够得到解决', options: [
    { value: 1, label: '非常不像我家' },
    { value: 2, label: '不太像我家' },
    { value: 3, label: '比较像我家' },
    { value: 4, label: '非常像我家' },
  ] },
  { questionId: 'D8-Q5', dimensionId: 8, subLabel: '家庭规则', content: '在我们家，家务集中在个别人身上，没有平均分担', options: [
    { value: 1, label: '非常不像我家' },
    { value: 2, label: '不太像我家' },
    { value: 3, label: '比较像我家' },
    { value: 4, label: '非常像我家' },
  ] },

  // ============== 第九维度：积极习惯（5题） ==============
  { questionId: 'D9-Q1', dimensionId: 9, content: '我做的很多事情是因为一时冲动', options: OPTIONS_1_5 },
  { questionId: 'D9-Q2', dimensionId: 9, content: '我是懒惰的', options: OPTIONS_1_5 },
  { questionId: 'D9-Q3', dimensionId: 9, content: '我能为了一个长远目标高效地工作', options: OPTIONS_1_5 },
  { questionId: 'D9-Q4', dimensionId: 9, content: '我能很好地抵制诱惑', options: OPTIONS_1_5 },
  { questionId: 'D9-Q5', dimensionId: 9, content: '我有时会上网(或饮酒)过度', options: OPTIONS_1_5 },

  // ============== 第十维度：积极天赋（2题） ==============
  { questionId: 'D10-Q1', dimensionId: 10, content: '你是否有意识地使用自己的优势来领导团队或项目？', options: OPTIONS_1_5 },
  { questionId: 'D10-Q2', dimensionId: 10, content: '在团队合作中，你是否有意识地使用自己的优势来促进团队协作？', options: OPTIONS_1_5 },

  // ============== 第十一维度：积极自尊（10题） ==============
  { questionId: 'D11-Q1', dimensionId: 11, content: '我认为自己是个有价值的人，至少与别人不相上下', options: [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '同意' },
    { value: 4, label: '非常同意' },
  ] },
  { questionId: 'D11-Q2', dimensionId: 11, content: '我觉得我有许多优点', options: [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '同意' },
    { value: 4, label: '非常同意' },
  ] },
  { questionId: 'D11-Q3', dimensionId: 11, content: '总的来说，我倾向于认为自己是一个失败者', options: [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '同意' },
    { value: 4, label: '非常同意' },
  ] },
  { questionId: 'D11-Q4', dimensionId: 11, content: '我做事可以做得和大多数人一样好', options: [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '同意' },
    { value: 4, label: '非常同意' },
  ] },
  { questionId: 'D11-Q5', dimensionId: 11, content: '我觉得自己没有什么值得自豪的地方', options: [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '同意' },
    { value: 4, label: '非常同意' },
  ] },
  { questionId: 'D11-Q6', dimensionId: 11, content: '我对自己持肯定态度', options: [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '同意' },
    { value: 4, label: '非常同意' },
  ] },
  { questionId: 'D11-Q7', dimensionId: 11, content: '我整体而言对自己感到满意', options: [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '同意' },
    { value: 4, label: '非常同意' },
  ] },
  { questionId: 'D11-Q8', dimensionId: 11, content: '我希望我能为自己赢得更多尊重', options: [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '同意' },
    { value: 4, label: '非常同意' },
  ] },
  { questionId: 'D11-Q9', dimensionId: 11, content: '我时常觉得自己一无是处', options: [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '同意' },
    { value: 4, label: '非常同意' },
  ] },
  { questionId: 'D11-Q10', dimensionId: 11, content: '我时常认为自己不如别人', options: [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '同意' },
    { value: 4, label: '非常同意' },
  ] },

  // ============== 第十二维度：积极关系（23题） ==============
  { questionId: 'D12-Q1', dimensionId: 12, subLabel: '情感亲密性', content: '他 / 她给我许多关心的照顾', options: OPTIONS_1_7 },
  { questionId: 'D12-Q2', dimensionId: 12, subLabel: '情感亲密性', content: '他 / 她经常夸我', options: OPTIONS_1_7 },
  { questionId: 'D12-Q3', dimensionId: 12, subLabel: '情感亲密性', content: '他 / 她让我感到很温暖', options: OPTIONS_1_7 },
  { questionId: 'D12-Q4', dimensionId: 12, subLabel: '情感亲密性', content: '他 / 她愿意为我做很多事', options: OPTIONS_1_7 },
  { questionId: 'D12-Q5', dimensionId: 12, subLabel: '情感亲密性', content: '他 / 她对我的情绪很敏感', options: OPTIONS_1_7 },
  { questionId: 'D12-Q6', dimensionId: 12, subLabel: '情感亲密性', content: '他 / 她对我表达感情很自然', options: OPTIONS_1_7 },
  { questionId: 'D12-Q7', dimensionId: 12, subLabel: '情感亲密性', content: '他 / 她能让我轻松地表达自己的感受', options: OPTIONS_1_7 },
  { questionId: 'D12-Q8', dimensionId: 12, subLabel: '情感亲密性', content: '他 / 她给我一种感受，我可以把任何事情都告诉他 / 她', options: OPTIONS_1_7 },
  { questionId: 'D12-Q9', dimensionId: 12, subLabel: '尊重性', content: '他 / 她对我的生活习惯很宽容', options: OPTIONS_1_7 },
  { questionId: 'D12-Q10', dimensionId: 12, subLabel: '尊重性', content: '他 / 她不会强迫我做不想做的事', options: OPTIONS_1_7 },
  { questionId: 'D12-Q11', dimensionId: 12, subLabel: '尊重性', content: '他 / 她尊重我的想法', options: OPTIONS_1_7 },
  { questionId: 'D12-Q12', dimensionId: 12, subLabel: '尊重性', content: '他 / 她允许我仔细考虑我的观点', options: OPTIONS_1_7 },
  { questionId: 'D12-Q13', dimensionId: 12, subLabel: '尊重性', content: '他 / 她不会随意否定我的看法', options: OPTIONS_1_7 },
  { questionId: 'D12-Q14', dimensionId: 12, subLabel: '尊重性', content: '他 / 她在小问题上也不厌其烦地和我讨论', options: OPTIONS_1_7 },
  { questionId: 'D12-Q15', dimensionId: 12, subLabel: '支持性', content: '他 / 她鼓励我发展自己的兴趣爱好', options: OPTIONS_1_7 },
  { questionId: 'D12-Q16', dimensionId: 12, subLabel: '支持性', content: '他 / 她认为我的意见有可取之处', options: OPTIONS_1_7 },
  { questionId: 'D12-Q17', dimensionId: 12, subLabel: '支持性', content: '他 / 她愿意帮我解决工作 / 学习中的难题', options: OPTIONS_1_7 },
  { questionId: 'D12-Q18', dimensionId: 12, subLabel: '支持性', content: '他 / 她支持我做的重要决定', options: OPTIONS_1_7 },
  { questionId: 'D12-Q19', dimensionId: 12, subLabel: '支持性', content: '他 / 她相信我知道如何应对挫折', options: OPTIONS_1_7 },
  { questionId: 'D12-Q20', dimensionId: 12, subLabel: '平衡性', content: '他 / 她和我一起分担日常事务', options: OPTIONS_1_7 },
  { questionId: 'D12-Q21', dimensionId: 12, subLabel: '平衡性', content: '他 / 她愿意和我平等地做决定', options: OPTIONS_1_7 },
  { questionId: 'D12-Q22', dimensionId: 12, subLabel: '平衡性', content: '他 / 她不会事事都自己说了算', options: OPTIONS_1_7 },
  { questionId: 'D12-Q23', dimensionId: 12, subLabel: '平衡性', content: '他 / 她认为我很聪明', options: OPTIONS_1_7 },

  // ============== 第十三维度：积极改变（5题） ==============
  { questionId: 'D13-Q1', dimensionId: 13, subLabel: '探索意愿', content: '我愿意尝试新的想法和方法来解决问题', options: OPTIONS_1_5 },
  { questionId: 'D13-Q2', dimensionId: 13, subLabel: '学习喜好', content: '我对学习新技能和知识感到兴奋', options: OPTIONS_1_5 },
  { questionId: 'D13-Q3', dimensionId: 13, subLabel: '知识结合能力', content: '我能够将新学到的信息与我已有的知识联系起来', options: OPTIONS_1_5 },
  { questionId: 'D13-Q4', dimensionId: 13, subLabel: '深入探究意愿', content: '面对复杂问题，我愿意深入研究以找到解决方案', options: OPTIONS_1_5 },
  { questionId: 'D13-Q5', dimensionId: 13, subLabel: '坚持追求', content: '即使遇到困难，我也会坚持学习直到我非常理解材料', options: OPTIONS_1_5 },

  // ============== 第十四维度：积极信念（12题，部分不计分） ==============
  { questionId: 'D14-Q1', dimensionId: 14, subLabel: '路径思维', content: '我能想出许多途径和方法来使自己摆脱陷入的困境', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D14-Q2', dimensionId: 14, subLabel: '动力思维', content: '我总是不知疲倦地追求我的目标', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D14-Q3', dimensionId: 14, subLabel: '干扰题', content: '我大多数时候感到很累', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ], isIgnored: true },
  { questionId: 'D14-Q4', dimensionId: 14, subLabel: '路径思维', content: '任何问题总会有许多解决的途径和办法', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D14-Q5', dimensionId: 14, subLabel: '干扰题', content: '我容易在争论中被击败', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ], isIgnored: true },
  { questionId: 'D14-Q6', dimensionId: 14, subLabel: '路径思维', content: '我总是能想出很多途径和办法来处理我生命中重要的事情', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D14-Q7', dimensionId: 14, subLabel: '干扰题', content: '我担心我的身体健康', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ], isIgnored: true },
  { questionId: 'D14-Q8', dimensionId: 14, subLabel: '路径思维', content: '即使当别人都泄气时，我也知道我能找到解决问题的途径', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D14-Q9', dimensionId: 14, subLabel: '动力思维', content: '我的过去的经历已为我的将来做好了充分准备', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D14-Q10', dimensionId: 14, subLabel: '动力思维', content: '我的生活一直很成功', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D14-Q11', dimensionId: 14, subLabel: '干扰题', content: '我经常发现我自己对有些事担心', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ], isIgnored: true },
  { questionId: 'D14-Q12', dimensionId: 14, subLabel: '动力思维', content: '我对我的目标充满热情，并且会尽全力去实现它们', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },

  // ============== 第十五维度：积极体验（9题） ==============
  { questionId: 'D15-Q1', dimensionId: 15, subLabel: '挑战-技能平衡', content: '我面临挑战，但我认为我的技术非常可以让我迎接挑战', options: OPTIONS_1_5 },
  { questionId: 'D15-Q2', dimensionId: 15, subLabel: '行为意识统一', content: '我不用考虑就能做出正确的动作', options: OPTIONS_1_5 },
  { questionId: 'D15-Q3', dimensionId: 15, subLabel: '清晰的目标', content: '我清楚的知道我想做什么', options: OPTIONS_1_5 },
  { questionId: 'D15-Q4', dimensionId: 15, subLabel: '及时反馈', content: '我能够根据反馈调整我的行为', options: OPTIONS_1_5 },
  { questionId: 'D15-Q5', dimensionId: 15, subLabel: '注意力集中', content: '我的注意力非常集中在与活动有关的内容上', options: OPTIONS_1_5 },
  { questionId: 'D15-Q6', dimensionId: 15, subLabel: '控制感', content: '我感觉到非常能控制我所做的动作', options: OPTIONS_1_5 },
  { questionId: 'D15-Q7', dimensionId: 15, subLabel: '自我意识降低', content: '我不再担心自己的表现', options: OPTIONS_1_5 },
  { questionId: 'D15-Q8', dimensionId: 15, subLabel: '时间感改变', content: '我觉得时间好像不断变换，一会过的快、一会过的慢', options: OPTIONS_1_5 },
  { questionId: 'D15-Q9', dimensionId: 15, subLabel: '自带目的性体验', content: '活动本身就是目的，而不仅仅是达到某个目标的手段', options: OPTIONS_1_5 },

  // ============== 第十六维度：积极品质（10题） ==============
  { questionId: 'D16-Q1', dimensionId: 16, subLabel: '道德认同内化', content: '我在做决定时，会优先考虑道德原则，即便代价较大', options: OPTIONS_1_5 },
  { questionId: 'D16-Q2', dimensionId: 16, subLabel: '道德认同内化', content: '我认为自己就是一个遵守道德规范的人', options: OPTIONS_1_5 },
  { questionId: 'D16-Q3', dimensionId: 16, subLabel: '道德认同内化', content: '面对道德冲突时，我倾向于坚持正确的做法，即使别人不认同', options: OPTIONS_1_5 },
  { questionId: 'D16-Q4', dimensionId: 16, subLabel: '道德认同内化', content: '遭遇诱惑时，我相信自己的品格会指引我做出合乎道德的选择', options: OPTIONS_1_5 },
  { questionId: 'D16-Q5', dimensionId: 16, subLabel: '道德认同内化', content: '我愿意为了道德信念承担个人损失', options: OPTIONS_1_5 },
  { questionId: 'D16-Q6', dimensionId: 16, subLabel: '道德认同内化', content: '我认为自己就是一个遵守道德规范的人', options: OPTIONS_1_5 },
  { questionId: 'D16-Q7', dimensionId: 16, subLabel: '道德认同内化', content: '我把道德视为自己身份的一部分，而非仅仅是一时的行为', options: OPTIONS_1_5 },
  { questionId: 'D16-Q8', dimensionId: 16, subLabel: '道德认同符号化', content: '我愿意通过具体行动向他人展示自己是个有道德的人', options: OPTIONS_1_5 },
  { questionId: 'D16-Q9', dimensionId: 16, subLabel: '道德认同符号化', content: '我相信某些日常行为可以把我的道德形象传达给周围人', options: OPTIONS_1_5 },
  { questionId: 'D16-Q10', dimensionId: 16, subLabel: '道德认同符号化', content: '为了道德形象，我会主动参与公益活动，即使回报不明显', options: OPTIONS_1_5 },

  // ============== 第十七维度：积极投入（3题） ==============
  { questionId: 'D17-Q1', dimensionId: 17, subLabel: '活动', content: '在工作时，我感到自己强大并且充满活力', options: OPTIONS_0_6 },
  { questionId: 'D17-Q2', dimensionId: 17, subLabel: '奉献', content: '我对工作富有热情', options: OPTIONS_0_6 },
  { questionId: 'D17-Q3', dimensionId: 17, subLabel: '专注', content: '工作时，我感到自己沉浸于其中', options: OPTIONS_0_6 },

  // ============== 第十八维度：积极自我（10题） ==============
  { questionId: 'D18-Q1', dimensionId: 18, content: '如果我尽力去做的话，我总是能够解决问题的', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D18-Q2', dimensionId: 18, content: '即使别人反对我，我仍有办法取得我所要的', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D18-Q3', dimensionId: 18, content: '对我来说，坚持理想和达成目标是轻而易举的', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D18-Q4', dimensionId: 18, content: '我自信能有效地应付任何突如其来的事情', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D18-Q5', dimensionId: 18, content: '以我的才智，我定能应付意料之外的情况', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D18-Q6', dimensionId: 18, content: '如果我付出必要的努力，我一定能解决大多数的难题', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D18-Q7', dimensionId: 18, content: '我能冷静地面对困难，因为我可信赖自己处理问题的能力', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D18-Q8', dimensionId: 18, content: '面对一个难题时，我通常能找到几个解决方法', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D18-Q9', dimensionId: 18, content: '有麻烦的时候，我通常能想到一些应付的方法', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D18-Q10', dimensionId: 18, content: '无论什么事在我身上发生，我都能够应付自如', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },

  // ============== 第十九维度：积极目标（4题） ==============
  { questionId: 'D19-Q1', dimensionId: 19, subLabel: '权力/声望', content: '我会比较尊重一个比我有钱的人', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D19-Q2', dimensionId: 19, subLabel: '保留时间', content: '我会为了未来而做财务规划', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D19-Q3', dimensionId: 19, subLabel: '不信任', content: '当进行一笔大额采购时，我总是担心我被占便宜', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },
  { questionId: 'D19-Q4', dimensionId: 19, subLabel: '忧虑', content: '当我的财务状况不稳定时我会感到忧虑', options: [
    { value: 1, label: '绝对错误' },
    { value: 2, label: '大部分错误' },
    { value: 3, label: '大部分正确' },
    { value: 4, label: '绝对正确' },
  ] },

  // ============== 第二十维度：积极意义（12题） ==============
  { questionId: 'D20-Q1', dimensionId: 20, subLabel: '健康照护', content: '理解医生 / 药师所讲健康相关信息的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q2', dimensionId: 20, subLabel: '健康照护', content: '理解药品说明书内容的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q3', dimensionId: 20, subLabel: '健康照护', content: '依据医生 / 药师建议判断适当治疗措施的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q4', dimensionId: 20, subLabel: '健康照护', content: '需要医疗服务时，判断就诊科室 / 部门的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q5', dimensionId: 20, subLabel: '疾病预防', content: '判断自己是否需要接种某种疫苗的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q6', dimensionId: 20, subLabel: '疾病预防', content: '理解体检或健康筛查信息的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q7', dimensionId: 20, subLabel: '疾病预防', content: '理解政府 / 媒体发布的疾病预防健康信息的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q8', dimensionId: 20, subLabel: '疾病预防', content: '判断日常哪些行为可能影响自身健康的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q9', dimensionId: 20, subLabel: '健康促进', content: '理解媒体上关于如何变得更健康的信息的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q10', dimensionId: 20, subLabel: '健康促进', content: '找到改善生活方式（如锻炼、饮食）有用信息的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q11', dimensionId: 20, subLabel: '健康促进', content: '依据健康信息采取行动改善健康的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
  { questionId: 'D20-Q12', dimensionId: 20, subLabel: '健康促进', content: '判断获取的健康信息是否可信的难易程度', options: [
    { value: 1, label: '非常困难' },
    { value: 2, label: '困难' },
    { value: 3, label: '容易' },
    { value: 4, label: '非常容易' },
  ] },
];

