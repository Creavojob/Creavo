const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

const createAdminUser = async () => {
  try {
    // Datenbank synchronisieren um isAdmin Feld zu erstellen
    await sequelize.sync({ alter: true });
    console.log('✅ Datenbank synchronisiert');
    
    const adminEmail = 'creavojob@gmail.com'; // Hier deine gewünschte Email
    const adminPassword = 'AdminCreavo2024!'; // Hier dein gewünschtes Passwort
    
    // Prüfen ob Admin bereits existiert
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (existingAdmin) {
      console.log('✅ Admin existiert bereits:', adminEmail);
      // Admin-Flag setzen falls noch nicht vorhanden
      if (!existingAdmin.isAdmin) {
        await existingAdmin.update({ isAdmin: true });
        console.log('✅ Admin-Rechte hinzugefügt');
      }
    } else {
      // Neuen Admin erstellen - Plaintext übergeben, beforeCreate Hook hasht es
      const admin = await User.create({
        email: adminEmail,
        password: adminPassword, // Plaintext - wird von beforeCreate Hook gehasht
        firstName: 'Mario',
        lastName: 'Admin',
        userType: 'client', // Als Client, damit du auch Jobs erstellen kannst
        isAdmin: true
      });
      
      console.log('✅ Admin-User erstellt!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Passwort:', adminPassword);
      console.log('⚠️  BITTE PASSWORT ÄNDERN nach erstem Login!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Fehler beim Erstellen des Admin-Users:', err);
    process.exit(1);
  }
};

createAdminUser();
