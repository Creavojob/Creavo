// Seed-Runner - Zum Erstellen von Demo-Daten
// Verwendung: node backend/src/seeds/runSeed.js

require('dotenv').config();
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
const initializeModels = require('../models');
const sequelize = initializeModels.sequelize;
const seedJobs = require('./seedJobs');

const runSeeds = async () => {
  try {
    console.log('🌱 Starte Seed-Prozess...');

    // Initialize associations
    initializeModels();
    
    // Sync Database
    await sequelize.sync({ alter: true });
    console.log('✅ Datenbank synchronisiert');

    // Run Seeds
    await seedJobs();

    console.log('✅ Alle Seeds erfolgreich ausgeführt!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fehler beim Ausführen der Seeds:', error);
    process.exit(1);
  }
};

runSeeds();
