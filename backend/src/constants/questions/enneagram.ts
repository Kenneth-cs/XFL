export interface EnneagramOption {
  text: string;
  type: number;
}

export interface EnneagramQuestion {
  questionId: number;
  content: string;
  options: EnneagramOption[];
}

export const ENNEAGRAM_QUESTIONS: EnneagramQuestion[] = [
  {
    questionId: 1,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我浪漫并富于幻想', type: 5 },
      { text: '我很实际并实事求是', type: 2 },
    ]
  },
  {
    questionId: 2,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我倾向于接受冲突', type: 7 },
      { text: '我倾向于避免冲突', type: 1 },
    ]
  },
  {
    questionId: 3,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般是老练的、有魅力的以及有上进心的', type: 3 },
      { text: '我一般是直率的、刻板的以及空想的', type: 5 },
    ]
  },
  {
    questionId: 4,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我倾向于集中注意力于某一事物', type: 8 },
      { text: '我倾向于自然的东西，喜欢开玩笑', type: 9 },
    ]
  },
  {
    questionId: 5,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我待人友好，愿意结交新朋友', type: 6 },
      { text: '我喜欢独处、不太愿意与人交往', type: 5 },
    ]
  },
  {
    questionId: 6,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我很难放松和停止思考潜在的问题', type: 2 },
      { text: '潜在的问题不会影响我的工作', type: 1 },
    ]
  },
  {
    questionId: 7,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我是"聪明"的生存者', type: 7 },
      { text: '我是"高尚"的理想主义者', type: 4 },
    ]
  },
  {
    questionId: 8,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我需要给别人爱', type: 5 },
      { text: '我愿意与别人保持一定的距离', type: 7 },
    ]
  },
  {
    questionId: 9,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当别人给我一项新任务时，我通常会问自己它对我是否有用', type: 3 },
      { text: '当别人给我一项新任务时，我通常会问自己它是否有趣', type: 9 },
    ]
  },
  {
    questionId: 10,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我倾向于关注自己', type: 5 },
      { text: '我倾向于关注他人', type: 1 },
    ]
  },
  {
    questionId: 11,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '别人依赖我的见识与知识', type: 8 },
      { text: '别人依赖我的力量与决策', type: 7 },
    ]
  },
  {
    questionId: 12,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我给人的印象是十分不自信的', type: 2 },
      { text: '我给人的印象是十分自信的', type: 4 },
    ]
  },
  {
    questionId: 13,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我更加注重关系', type: 6 },
      { text: '我更加注重目的', type: 3 },
    ]
  },
  {
    questionId: 14,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我不能大胆地说出自己想说的话', type: 5 },
      { text: '我能大胆地说出别人想说但不敢说的话', type: 9 },
    ]
  },
  {
    questionId: 15,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '不考虑其他选择而做某一确定的事对我来说是很困难的', type: 8 },
      { text: '放松、更具灵活性对我来说是很困难的', type: 4 },
    ]
  },
  {
    questionId: 16,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般犹豫与拖延', type: 2 },
      { text: '我一般大胆与果断', type: 7 },
    ]
  },
  {
    questionId: 17,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我不愿意别人给我带来麻烦', type: 1 },
      { text: '我希望别人依赖我，让我帮忙解决麻烦', type: 6 },
    ]
  },
  {
    questionId: 18,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '通常我会为了完成工作将感情置之不顾', type: 3 },
      { text: '在做事之前我需要克制自己的感情', type: 5 },
    ]
  },
  {
    questionId: 19,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般是讲求方法并且很谨慎的', type: 2 },
      { text: '我一般是敢于冒险的', type: 9 },
    ]
  },
  {
    questionId: 20,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我倾向于帮助和给予，喜欢与他人在一起', type: 6 },
      { text: '我倾向于严肃和缄默，喜欢讨论问题', type: 4 },
    ]
  },
  {
    questionId: 21,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我常常感到自己需要成为顶梁柱', type: 7 },
      { text: '我常常感到自己需要做得十全十美', type: 3 },
    ]
  },
  {
    questionId: 22,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我喜欢问难题和保持独立性', type: 8 },
      { text: '我喜欢保持心理的稳定与平静', type: 1 },
    ]
  },
  {
    questionId: 23,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我太顽固并持有怀疑的态度', type: 2 },
      { text: '我太软心肠并多愁善感', type: 6 },
    ]
  },
  {
    questionId: 24,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我常常担心自己不能得到较好的东西', type: 9 },
      { text: '我常常担心如果自己放松警惕，别人就会欺骗我', type: 7 },
    ]
  },
  {
    questionId: 25,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我习惯性表现得很冷淡而使别人生气', type: 5 },
      { text: '我习惯性指使别人做事而使他们生气', type: 4 },
    ]
  },
  {
    questionId: 26,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '如果有太多的刺激和鼓舞，我会感到忧虑', type: 1 },
      { text: '如果没有太多的刺激和鼓舞，我会感到忧虑', type: 9 },
    ]
  },
  {
    questionId: 27,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我要依靠朋友，同时他们也可以依靠我', type: 2 },
      { text: '我不依靠别人并独立行事', type: 3 },
    ]
  },
  {
    questionId: 28,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般独立与专心', type: 8 },
      { text: '我一般情绪化并热衷于自己的想法', type: 5 },
    ]
  },
  {
    questionId: 29,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我喜欢向别人提出挑战，使他们振奋起来', type: 7 },
      { text: '我喜欢安慰他人，使他们冷静下来', type: 6 },
    ]
  },
  {
    questionId: 30,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我总的来说是个开朗并喜欢交际的人', type: 9 },
      { text: '我总的来说是个认真并很能自律的人', type: 4 },
    ]
  },
  {
    questionId: 31,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我希望能迎合别人---当与别人距离很远，我就感到不舒服', type: 1 },
      { text: '我希望与众不同---当不能看到别人与自己的区别，我就感到不舒服', type: 3 },
    ]
  },
  {
    questionId: 32,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '对我来说，追求个人的兴趣比追求舒适与安全更重要', type: 8 },
      { text: '对我来说，追求舒适与安全比追求个人的兴趣更重要', type: 2 },
    ]
  },
  {
    questionId: 33,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当与他人有冲突时，我倾向于退缩', type: 5 },
      { text: '当与他人有冲突时，我很少会改变自己的态度', type: 7 },
    ]
  },
  {
    questionId: 34,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我很容易屈服并受他人摆布', type: 1 },
      { text: '我对他人不但不做出让步，而且还对他们下达命令', type: 4 },
    ]
  },
  {
    questionId: 35,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我很赏识自己高昂的精神状态与深沉', type: 9 },
      { text: '我很赏识自己对他人深层的关心与热情', type: 7 },
    ]
  },
  {
    questionId: 36,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我很想给别人留下好的印象', type: 3 },
      { text: '我并不在乎要给别人留下好的印象', type: 8 },
    ]
  },
  {
    questionId: 37,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我依赖自己的毅力与常有的感觉', type: 2 },
      { text: '我依赖自己的想象与瞬间的灵感', type: 5 },
    ]
  },
  {
    questionId: 38,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '总的来说，我是很随和和很可爱的', type: 1 },
      { text: '总的来说，我是精力旺盛和过分自信的', type: 7 },
    ]
  },
  {
    questionId: 39,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我努力工作以得到别人的接受与喜欢', type: 3 },
      { text: '能否得到别人的接受与喜欢对我来说并不重要', type: 4 },
    ]
  },
  {
    questionId: 40,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当别人给我压力时我更容易退缩', type: 8 },
      { text: '当别人给我压力时我会变得更加自信', type: 9 },
    ]
  },
  {
    questionId: 41,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '人们对我感兴趣是因为我很开朗、有吸引力、有趣', type: 6 },
      { text: '人们对我感兴趣是因为我很安静、不同寻常、深沉', type: 5 },
    ]
  },
  {
    questionId: 42,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '职责与责任对我来说很重要', type: 2 },
      { text: '协调与认可对我来说很重要', type: 1 },
    ]
  },
  {
    questionId: 43,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我制定出重要的计划并做出承诺，以此来激励人们', type: 7 },
      { text: '我指出不按照我的建议去做所产生的后果，以此来要求人们顺从', type: 4 },
    ]
  },
  {
    questionId: 44,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我很少表露情绪', type: 8 },
      { text: '我经常表露情绪', type: 6 },
    ]
  },
  {
    questionId: 45,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我不擅长处理琐碎的事', type: 9 },
      { text: '我擅长处理琐碎的事', type: 3 },
    ]
  },
  {
    questionId: 46,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我常常强调自己与绝大多数人的不同之处，尤其是家境的不同之处', type: 5 },
      { text: '我常常强调自己与绝大多数人的共同之处，尤其是家境的相同之处', type: 5 },
    ]
  },
  {
    questionId: 47,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当场面变得热闹起来时，我一般站在一旁', type: 8 },
      { text: '当场面变得热闹起来时，我一般加入其中', type: 9 },
    ]
  },
  {
    questionId: 48,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '即使朋友不对，我也会支持他们', type: 2 },
      { text: '我不会为了友情而在正确的事情上妥协', type: 4 },
    ]
  },
  {
    questionId: 49,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我是善意的支持者', type: 6 },
      { text: '我是积极的老手', type: 3 },
    ]
  },
  {
    questionId: 50,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当遇到困难时我倾向于夸大自己的问题', type: 5 },
      { text: '当遇到困难时我倾向于转移注意力', type: 9 },
    ]
  },
  {
    questionId: 51,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般对情况持相信的态度', type: 4 },
      { text: '我一般对情况持怀疑的态度', type: 8 },
    ]
  },
  {
    questionId: 52,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我的悲观和抱怨会给别人带来麻烦', type: 2 },
      { text: '我老板式的、控制的方式会给别人带来麻烦', type: 7 },
    ]
  },
  {
    questionId: 53,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般按感觉办事，并听之任之', type: 6 },
      { text: '我一般不按感觉办事，以免产生更多的问题', type: 1 },
    ]
  },
  {
    questionId: 54,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我成为注意的焦点时会很自然', type: 3 },
      { text: '我成为注意的焦点时会很不习惯', type: 5 },
    ]
  },
  {
    questionId: 55,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我做事情很谨慎，努力为意料之外的事情做准备', type: 2 },
      { text: '我做事情凭一时冲动，在问题出现时才临时做准备', type: 9 },
    ]
  },
  {
    questionId: 56,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当别人不是很欣赏我为他们所做的事情时我会很生气', type: 6 },
      { text: '当别人不听我说话时我会很生气', type: 4 },
    ]
  },
  {
    questionId: 57,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '独立、自立更生对我很重要', type: 7 },
      { text: '价值被认可、得到别人的称赞对我很重要', type: 3 },
    ]
  },
  {
    questionId: 58,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当与朋友争论时，我一般强烈地坚持自己的观点', type: 8 },
      { text: '当与朋友争论时，我一般顺其自然以免伤了和气', type: 1 },
    ]
  },
  {
    questionId: 59,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我常常占有所爱的人，不能放任他们', type: 5 },
      { text: '我常常考察所爱的人，想确定他们是否爱我', type: 2 },
    ]
  },
  {
    questionId: 60,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '组织资源并促使某些事情的发生是我的优势之一', type: 7 },
      { text: '提出新观点并振奋人心是我的优势之一', type: 9 },
    ]
  },
  {
    questionId: 61,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我不能依赖自己，要在别人的驱策下才会做事', type: 4 },
      { text: '我不能自律，过于情绪化', type: 5 },
    ]
  },
  {
    questionId: 62,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我试图使生活快节奏、紧张以及充满兴奋', type: 9 },
      { text: '我试图使生活有规律、稳定以及宁静', type: 1 },
    ]
  },
  {
    questionId: 63,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '尽管我已取得成功，但我仍怀疑自己的能力', type: 2 },
      { text: '尽管我受到挫折，但我仍相信自己的能力', type: 3 },
    ]
  },
  {
    questionId: 64,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般对自己的情感会仔细研究', type: 5 },
      { text: '我一般对自己的情感并不加注意', type: 8 },
    ]
  },
  {
    questionId: 65,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我对许多人加以注意并培养他们', type: 6 },
      { text: '我对许多人加以指导并鼓励他们', type: 7 },
    ]
  },
  {
    questionId: 66,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我对自己要求有点严格', type: 4 },
      { text: '我对自己要求比较宽容', type: 9 },
    ]
  },
  {
    questionId: 67,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我独断、追求卓越', type: 3 },
      { text: '我谦虚，喜欢按自己的节奏做事', type: 1 },
    ]
  },
  {
    questionId: 68,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我为自己的清晰性与目标性感到自豪', type: 7 },
      { text: '我为自己的可靠与诚实感到自豪', type: 2 },
    ]
  },
  {
    questionId: 69,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我花大量的时间反省---理解自己的感受对我来说是很重要的', type: 5 },
      { text: '我花大量的时间反省---做完事情对我来说是很重要的', type: 7 },
    ]
  },
  {
    questionId: 70,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我认为自己是一个灿烂和随和的人', type: 1 },
      { text: '我认为自己是一个严肃和有品位的人', type: 4 },
    ]
  },
  {
    questionId: 71,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我头脑灵活，精力充沛', type: 9 },
      { text: '我有一颗炽热的心，具有奉献精神', type: 6 },
    ]
  },
  {
    questionId: 72,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我所做的事情要有极大的可能性得到奖励与赏识', type: 3 },
      { text: '如果所做的事是我所感兴趣的，我愿意放弃别人对我的奖励与赏识', type: 8 },
    ]
  },
  {
    questionId: 73,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我认为履行社会义务并不重要', type: 4 },
      { text: '我常常认真履行社会义务', type: 2 },
    ]
  },
  {
    questionId: 74,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '在绝大多数情况下我愿意做领导', type: 6 },
      { text: '在绝大多数情况下我愿意让其他人做领导', type: 1 },
    ]
  },
  {
    questionId: 75,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '几年来，我的价值观与生活方式变化了好几次', type: 4 },
      { text: '几年来，我的价值观与生活方式基本没有变化', type: 2 },
    ]
  },
  {
    questionId: 76,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般缺乏自律能力', type: 9 },
      { text: '我与别人的联系一般很少', type: 8 },
    ]
  },
  {
    questionId: 77,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我拒绝给别人爱，希望别人进入我的世界', type: 5 },
      { text: '我需要给别人爱，希望自己进入别人的世界', type: 6 },
    ]
  },
  {
    questionId: 78,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般会做最坏的打算', type: 2 },
      { text: '我一般会做最好的打算', type: 1 },
    ]
  },
  {
    questionId: 79,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '人们相信我是因为我很自信，并尽全力做得最好', type: 6 },
      { text: '人们相信我是因为我很公正，并能正确地做事', type: 4 },
    ]
  },
  {
    questionId: 80,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我常常忙于自己的事情而忽略了与他人交往', type: 8 },
      { text: '我常常忙于与他人交往而忽略了自己的事情', type: 6 },
    ]
  },
  {
    questionId: 81,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当第一次遇到某人时，我一般会镇定自若并沉默寡言', type: 3 },
      { text: '当第一次遇到某人时，我一般会与他闲聊并使他觉得有趣', type: 9 },
    ]
  },
  {
    questionId: 82,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '总而言之，我是很悲观的', type: 5 },
      { text: '总而言之，我是很乐观的', type: 1 },
    ]
  },
  {
    questionId: 83,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我更喜欢呆在自己的小世界里', type: 8 },
      { text: '我更喜欢让全世界的人知道我的存在', type: 7 },
    ]
  },
  {
    questionId: 84,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我常常被紧张、不安全以及怀疑困扰', type: 2 },
      { text: '我常常被生气、完美主义以及不耐烦困扰', type: 4 },
    ]
  },
  {
    questionId: 85,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我意识到自己太有人情味，待人太亲密', type: 6 },
      { text: '我意识到自己太酷，过于冷漠', type: 3 },
    ]
  },
  {
    questionId: 86,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我失败是因为我不能抓住机会', type: 5 },
      { text: '我失败是因为追求太多的可能性', type: 9 },
    ]
  },
  {
    questionId: 87,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我要过很长的时间才会采取行动', type: 8 },
      { text: '我会立即采取行动', type: 9 },
    ]
  },
  {
    questionId: 88,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般很难做出决定', type: 2 },
      { text: '我一般很容易做出决定', type: 7 },
    ]
  },
  {
    questionId: 89,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我容易给人留下态度强硬的印象', type: 6 },
      { text: '我并不过多地坚持自己的意见', type: 1 },
    ]
  },
  {
    questionId: 90,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我情绪稳定', type: 3 },
      { text: '我情绪多变', type: 5 },
    ]
  },
  {
    questionId: 91,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当不知道要干什么事情时，我常常会向别人寻找建议', type: 2 },
      { text: '当不知道要干什么事情时，我会尝试不同的事情以确定哪一种最适合自己去做', type: 9 },
    ]
  },
  {
    questionId: 92,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我担心别人搞活动时会忘记我', type: 6 },
      { text: '我担心参加别人活动会影响我做自己的事情', type: 4 },
    ]
  },
  {
    questionId: 93,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当我生气时，我一般会责备别人', type: 7 },
      { text: '当我生气时，我一般会变得很冷淡', type: 3 },
    ]
  },
  {
    questionId: 94,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我很难入睡', type: 8 },
      { text: '我很容易入睡', type: 1 },
    ]
  },
  {
    questionId: 95,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我常常努力思考如何与别人建立更亲密的关系', type: 5 },
      { text: '我常常努力思考别人想从我这儿得到什么', type: 2 },
    ]
  },
  {
    questionId: 96,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般是慎重、有话直说以及深思熟虑的人', type: 7 },
      { text: '我一般是易兴奋、善于快速回避问题以及机智的人', type: 9 },
    ]
  },
  {
    questionId: 97,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当看到别人犯错误时，我一般不会指出来', type: 5 },
      { text: '当看到别人犯错误时，我一般会帮助他们认识到自己所犯的错误', type: 4 },
    ]
  },
  {
    questionId: 98,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '在生活中的绝大多数时间里，我是情感激烈的人，我会产生许多易变的情感', type: 9 },
      { text: '在生活中的绝大多数时间里，我是情感稳定的人，我会"心如止水"', type: 1 },
    ]
  },
  {
    questionId: 99,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当我不喜欢某些人时，我会掩藏自己的情感且努力保持热情', type: 3 },
      { text: '当我不喜欢某些人时，我会以这种或那种方式让他们知道我的情感', type: 2 },
    ]
  },
  {
    questionId: 100,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我与别人交往有困难是因为我很敏感以及总是从自己的角度去考虑问题', type: 5 },
      { text: '我与别人交往有困难是因为我不太在乎社会习俗', type: 8 },
    ]
  },
  {
    questionId: 101,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我的方法是直接帮助别人', type: 6 },
      { text: '我的方法是告诉别人如何自助', type: 7 },
    ]
  },
  {
    questionId: 102,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '总的来说，我喜欢"释放"并突破所受的限制', type: 9 },
      { text: '总的来说，我不喜欢过多失去自我控制', type: 4 },
    ]
  },
  {
    questionId: 103,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我过度关注要比别人做得好', type: 4 },
      { text: '我过度关注把别人的事做好', type: 1 },
    ]
  },
  {
    questionId: 104,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我喜欢玄想，总是充满想象与好奇', type: 8 },
      { text: '我很实际，只是试图保持事情的发展状况', type: 2 },
    ]
  },
  {
    questionId: 105,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我的主要优势之一就是能够控制场面', type: 7 },
      { text: '我的主要优势之一就是能够讲述内心的感受', type: 5 },
    ]
  },
  {
    questionId: 106,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我努力争取把事情做好，却不管这样别人开心不开心', type: 4 },
      { text: '我不喜欢有压力的感觉，所以也不喜欢压制别人', type: 1 },
    ]
  },
  {
    questionId: 107,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我常常因自己在别人的生活中起着重要的作用而感到骄傲', type: 6 },
      { text: '我常常因自己对新的东西很感兴趣并乐于接受而感到骄傲', type: 9 },
    ]
  },
  {
    questionId: 108,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我认为自己给别人留下的印象是好样的，甚至是令人钦佩的', type: 3 },
      { text: '我认为自己给别人留下的印象是与众不同的，甚至是很古怪的', type: 8 },
    ]
  },
  {
    questionId: 109,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般去做自己必须做的事', type: 2 },
      { text: '我一般去做自己想做的事', type: 5 },
    ]
  },
  {
    questionId: 110,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我很喜欢高压力或困境', type: 7 },
      { text: '我不喜欢高压力和困境', type: 1 },
    ]
  },
  {
    questionId: 111,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我为自己的灵活能力而感到骄傲---我知道情况是变化的', type: 3 },
      { text: '我为自己的立场而感到骄傲---我有坚定的信念', type: 4 },
    ]
  },
  {
    questionId: 112,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我的风格倾向于节约和朴实', type: 8 },
      { text: '我的风格倾向于过度地做某些事情', type: 9 },
    ]
  },
  {
    questionId: 113,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '因为我有强烈的愿望去帮助别人，所以我的健康与幸福受到伤害', type: 6 },
      { text: '因为我只关注自己的需要，所以我的人际关系受到损害', type: 5 },
    ]
  },
  {
    questionId: 114,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '总的来说，我太坦诚、太天真', type: 1 },
      { text: '总的来说，我过于谨慎、过于戒备', type: 2 },
    ]
  },
  {
    questionId: 115,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '有时我因过于好斗而令人厌恶', type: 7 },
      { text: '有时我因太紧张而令人厌恶', type: 4 },
    ]
  },
  {
    questionId: 116,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '关注他人的需要以及为他人服务对我来说是很重要的', type: 6 },
      { text: '寻找并等待做好事的其他方法对我来说是很重要的', type: 8 },
    ]
  },
  {
    questionId: 117,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我全身心投入并持之以恒地追求自己的目标', type: 3 },
      { text: '我喜欢探索各种行动的途径，想看看最终的结果如何', type: 9 },
    ]
  },
  {
    questionId: 118,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我经常会激起强烈和紧张的情绪', type: 5 },
      { text: '我经常很冷静和安逸', type: 1 },
    ]
  },
  {
    questionId: 119,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我不太注重实际的结果，而是注重自己的兴趣', type: 8 },
      { text: '我很实际，总是希望自己的工作有具体的结果', type: 7 },
    ]
  },
  {
    questionId: 120,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我有强烈的归属需求', type: 2 },
      { text: '我有强烈的平衡需求', type: 4 },
    ]
  },
  {
    questionId: 121,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '过去我可能过于要求朋友间的亲密', type: 6 },
      { text: '过去我可能过于要求朋友间的疏远', type: 3 },
    ]
  },
  {
    questionId: 122,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我喜欢回忆过去的事情', type: 4 },
      { text: '我喜欢预期未来所要做的事情', type: 9 },
    ]
  },
  {
    questionId: 123,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我倾向于将人看做是很麻烦和苛刻的', type: 8 },
      { text: '我倾向于将人看做是很莽撞和有需求的', type: 4 },
    ]
  },
  {
    questionId: 124,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '总的来说，我不太自信', type: 2 },
      { text: '总的来说，我只相信自己', type: 7 },
    ]
  },
  {
    questionId: 125,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我可能太被动，从不积极参与', type: 1 },
      { text: '我可能控制过多', type: 6 },
    ]
  },
  {
    questionId: 126,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我经常因为怀疑自己而停下来', type: 5 },
      { text: '我很少会怀疑自己', type: 3 },
    ]
  },
  {
    questionId: 127,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '如果让我在熟悉的东西与新的东西之间做选择，我会选新东西', type: 9 },
      { text: '我一般会选自己所喜欢的东西，对自己不喜欢的东西会感到失望', type: 2 },
    ]
  },
  {
    questionId: 128,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我给别人大量的身体接触来让他们相信我对他们的爱', type: 6 },
      { text: '我认为真正的爱是不需要用身体的接触来表达的', type: 4 },
    ]
  },
  {
    questionId: 129,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当我责备别人时，我是很严厉和直截了当的', type: 7 },
      { text: '当我责备别人时，我是旁敲侧击的', type: 3 },
    ]
  },
  {
    questionId: 130,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我对别人认为很困扰甚至很可怕的学科却很感兴趣', type: 8 },
      { text: '我不喜欢去研究令人困扰或可怕的学科', type: 1 },
    ]
  },
  {
    questionId: 131,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我因妨碍或干扰他人而受到指责', type: 6 },
      { text: '我因逃避或沉默寡言而受到指责', type: 2 },
    ]
  },
  {
    questionId: 132,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我担心没有办法履行自己的职责', type: 7 },
      { text: '我担心自己缺乏自律而不能履行职责', type: 9 },
    ]
  },
  {
    questionId: 133,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '总的来说，我是一个凭直觉办事且极度个人主义的人', type: 5 },
      { text: '总的来说，我是一个很有组织能力且负责任的人', type: 4 },
    ]
  },
  {
    questionId: 134,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '难以克服惰性是我的主要问题之一', type: 1 },
      { text: '不能缓慢下来是我的主要问题之一', type: 9 },
    ]
  },
  {
    questionId: 135,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '当我觉得不安全时会变得傲慢，对此表示轻视', type: 3 },
      { text: '当我觉得不安全时会变得好争论，自卫性强', type: 2 },
    ]
  },
  {
    questionId: 136,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我思想开明，乐意尝试新的方法', type: 8 },
      { text: '我会表白真情，乐意与别人共享我的情感', type: 5 },
    ]
  },
  {
    questionId: 137,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '在别人面前我会表现得比实际的我更为强硬', type: 7 },
      { text: '在别人面前我会表现得比实际的我更为在意', type: 6 },
    ]
  },
  {
    questionId: 138,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我一般是按良心与理性去做事情', type: 4 },
      { text: '我一般是按感觉与冲动去做事情', type: 9 },
    ]
  },
  {
    questionId: 139,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '严峻的逆境使我变得坚强', type: 3 },
      { text: '严峻的逆境使我变得气馁与听天由命', type: 1 },
    ]
  },
  {
    questionId: 140,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我确信有某种"安全网"可以依靠', type: 2 },
      { text: '我常常选择居于边缘而无所依靠', type: 8 },
    ]
  },
  {
    questionId: 141,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我要为了别人而表现很坚强，所以没有时间顾及自己的感受', type: 7 },
      { text: '我不能应对自己的感受，所以不能为别人而表现得很坚强', type: 5 },
    ]
  },
  {
    questionId: 142,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我常常觉得奇怪，对于生活中美好的事情为什么人们只看到它消极的一面', type: 1 },
      { text: '我常常觉得奇怪，为什么人们在生活中遇到很糟糕的事情还这么开心', type: 4 },
    ]
  },
  {
    questionId: 143,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我努力使自己不被看做是自私的人', type: 6 },
      { text: '我努力使自己不被看做是令人讨厌的人', type: 9 },
    ]
  },
  {
    questionId: 144,
    content: '以下两个选项我比较倾向于',
    options: [
      { text: '我担心被别人的需要与要求压垮时会避免产生亲密的关系', type: 8 },
      { text: '我担心会辜负人们对我的期望时会避免产生亲密的关系', type: 3 },
    ]
  },
];
