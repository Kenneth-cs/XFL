import request from './request'

// 获取测评历史
export const getAssessmentHistory = (userId: string) => {
  return request.get(`/assessments/history/${userId}`)
}

// 获取最新测评结果
export const getLatestResults = (userId: string) => {
  return request.get(`/assessments/latest/${userId}`)
}

// 获取九型人格题目
export const getEnneagramQuestions = () => {
  return request.get('/assessments/enneagram/questions')
}

// 提交九型人格
export const submitEnneagram = (data: { userId: string; answers: { questionId: number; selectedType: number }[] }) => {
  return request.post('/assessments/enneagram/submit', data)
}

// 获取依恋关系题目
export const getAttachmentQuestions = () => {
  return request.get('/assessments/attachment/questions')
}

// 提交依恋关系
export const submitAttachment = (data: { userId: string; selectedQuestions: string[] }) => {
  return request.post('/assessments/attachment/submit', data)
}

// 获取幸福力题目
export const getHappinessQuestions = () => {
  return request.get('/assessments/happiness/questions')
}

// 提交幸福力
export const submitHappiness = (data: { userId: string; answers: any[] }) => {
  return request.post('/assessments/happiness/submit', data)
}

