const mysql = require('mysql2/promise');

async function checkTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root', // 假设是 root，如果不是请告诉我
    password: 'password', // 请替换为您的密码，或者如果我想错了请纠正
    database: 'xingfuli'
  });

  try {
    const [rows] = await connection.execute('DESCRIBE service_track');
    console.table(rows);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkTable();

