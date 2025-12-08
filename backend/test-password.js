const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT,
  logging: false
});

async function testLogin() {
  try {
    const [results] = await sequelize.query(
      "SELECT email, password FROM \"Users\" WHERE email = 'creavojob@gmail.com'"
    );
    
    if (results.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const user = results[0];
    console.log('✅ User found:', user.email);
    console.log('🔑 Hash:', user.password.substring(0, 20) + '...');
    
    const password = 'AdminCreavo2024!';
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log('🔐 Password:', password);
    console.log('✅ Match:', isMatch);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();
