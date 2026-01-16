/**
 * 匹配功能诊断脚本
 * 
 * 使用方法：node debug-match.js
 * 
 * 检查项：
 * 1. 发起人数据完整性
 * 2. 候选人数据完整性
 * 3. 数据库表结构
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function diagnose() {
  console.log('🔍 开始诊断匹配功能...\n');

  try {
    // 1. 测试获取用户列表
    console.log('1️⃣ 测试获取用户列表...');
    const usersRes = await axios.get(`${BASE_URL}/users/app`, {
      params: { page: 1, limit: 10 },
      headers: {
        Authorization: 'Bearer YOUR_TOKEN_HERE' // 需要替换为实际token
      }
    });
    console.log(`✅ 成功获取 ${usersRes.data.data?.length || 0} 个用户`);
    
    if (usersRes.data.data && usersRes.data.data.length > 0) {
      const user = usersRes.data.data[0];
      console.log(`   示例用户: ${user.id}, profile存在: ${!!user.profile}`);
      if (user.profile) {
        console.log(`   - baseInfo: ${JSON.stringify(user.profile.baseInfo)}`);
        console.log(`   - mvScore: ${user.profile.mvScore}`);
      }
    }

    // 2. 测试发起匹配
    console.log('\n2️⃣ 测试发起匹配...');
    const matchRes = await axios.post(`${BASE_URL}/matches/initiate`, {
      initiatorId: '15521303903', // 替换为实际的用户ID
      criteria: {
        ageMin: 16,
        ageMax: 39,
        heightMin: 160,
        heightMax: 180,
        educationMin: '大专以下',
        educationMax: '985或更高'
      }
    }, {
      headers: {
        Authorization: 'Bearer YOUR_TOKEN_HERE' // 需要替换为实际token
      }
    });
    console.log(`✅ 匹配成功，找到 ${matchRes.data.count} 位候选人`);

  } catch (error) {
    console.error('\n❌ 诊断发现错误:');
    if (error.response) {
      console.error(`   状态码: ${error.response.status}`);
      console.error(`   错误信息: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   错误: ${error.message}`);
    }
  }
}

diagnose();

