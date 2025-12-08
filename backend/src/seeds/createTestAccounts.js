const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function createTestAccounts() {
  const accounts = [
    {
      firstName: 'TestFreelancer',
      lastName: 'Demo',
      email: 'freelancer.test@demo.com',
      password: await bcrypt.hash('demo123', 10),
      userType: 'freelancer',
    },
    {
      firstName: 'TestClient',
      lastName: 'Demo',
      email: 'client.test@demo.com',
      password: await bcrypt.hash('demo123', 10),
      userType: 'client',
    }
  ];

  for (const data of accounts) {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) {
      console.log(`⏭️  User ${data.email} existiert bereits`);
      continue;
    }
    await User.create(data);
    console.log(`✅ User erstellt: ${data.email}`);
  }
  process.exit(0);
}

createTestAccounts();
