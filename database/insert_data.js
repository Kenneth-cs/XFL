
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678', // 尝试默认密码
    database: 'xingfuli'
  });

  try {
    console.log('Connected to database.');

    const sql1 = `
      INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
      VALUES (
          'XFL00100001', 
          2, 
          '{}', 
          '{"type": "安全型", "typeLabel": "安全型", "description": "您在亲密关系中感到安全和舒适，能够自由地依赖伴侣，也乐于被伴侣依赖。", "anxietyScore": 2.5, "avoidanceScore": 1.5, "securityScore": 5.5}', 
          '{}', 
          1, 
          NOW()
      );
    `;
    
    const sql2 = `
      INSERT INTO assessment_record (user_id, type, answers, result_data, raw_scores, is_latest, created_at)
      VALUES (
          'XFL00100003', 
          2, 
          '{}', 
          '{"type": "焦虑型", "typeLabel": "焦虑型", "description": "您渴望高度的亲密关系，但常常担心伴侣不如您期望的那样爱您。", "anxietyScore": 5.8, "avoidanceScore": 2.1, "securityScore": 2.5}', 
          '{}', 
          1, 
          NOW()
      );
    `;

    await connection.execute(sql1);
    console.log('Inserted attachment record for XFL00100001');
    
    await connection.execute(sql2);
    console.log('Inserted attachment record for XFL00100003');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

run();

