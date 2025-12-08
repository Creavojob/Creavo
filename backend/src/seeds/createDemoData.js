const { User, Job } = require('../models');
const bcrypt = require('bcryptjs');

const createDemoData = async () => {
  try {
    console.log('🔄 Erstelle Demo-Daten...');

    // 5 Demo-Clients mit je einem Job
    const demoClients = [
      {
        firstName: 'Lisa',
        lastName: 'Müller',
        email: 'lisa.mueller@demo.com',
        password: await bcrypt.hash('demo123', 10),
        userType: 'client',
        companyName: 'MediaPro Studios',
        job: {
          title: '4K Produktvideo - Elektronik',
          description: 'Wir benötigen ein professionelles 4K Produktvideo für unsere neue Smartwatch. Das Video sollte 60-90 Sekunden lang sein und die Features und Design der Uhr präsentieren.',
          category: 'Videoproduktion',
          budget: 2500,
          currency: 'EUR',
          experience: 'expert',
          status: 'open',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      },
      {
        firstName: 'Thomas',
        lastName: 'Schmidt',
        email: 'thomas.schmidt@demo.com',
        password: await bcrypt.hash('demo123', 10),
        userType: 'client',
        companyName: 'Digital Creators GmbH',
        job: {
          title: 'Motion Graphics - Erklärvideo',
          description: 'Wir suchen einen Motion Graphics Designer für ein 90-Sekunden Erklärvideo über unsere SaaS-Lösung. Das Video sollte ansprechende Animationen enthalten.',
          category: 'Animation & Motion Graphics',
          budget: 1800,
          currency: 'EUR',
          experience: 'intermediate',
          status: 'open',
          deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
        }
      },
      {
        firstName: 'Sarah',
        lastName: 'Weber',
        email: 'sarah.weber@demo.com',
        password: await bcrypt.hash('demo123', 10),
        userType: 'client',
        companyName: 'Podcast Network',
        job: {
          title: 'Audio Editing & Sounddesign - Podcast',
          description: 'Unser Podcast braucht professionelle Audio-Bearbeitung. 8 Episoden à 45 Minuten müssen editiert, gemischt und mit Intro/Outro versehen werden.',
          category: 'Audio & Sound',
          budget: 1200,
          currency: 'EUR',
          experience: 'intermediate',
          status: 'open',
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
        }
      },
      {
        firstName: 'Michael',
        lastName: 'Fischer',
        email: 'michael.fischer@demo.com',
        password: await bcrypt.hash('demo123', 10),
        userType: 'client',
        companyName: 'Event Media AG',
        job: {
          title: 'Videocut & Post-Production - Eventfilm',
          description: 'Wir haben Rohmaterial von unserem Event (ca. 15 Stunden) und benötigen einen professionellen 10-Minuten Highlight-Film mit Color grading und Musik.',
          category: 'Videoschnitt',
          budget: 1500,
          currency: 'EUR',
          experience: 'intermediate',
          status: 'open',
          deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
        }
      },
      {
        firstName: 'Anna',
        lastName: 'Becker',
        email: 'anna.becker@demo.com',
        password: await bcrypt.hash('demo123', 10),
        userType: 'client',
        companyName: 'Creative Solutions',
        job: {
          title: '3D Animation - Produktpräsentation',
          description: 'Hochwertige 3D Animation für Produktpräsentation. Das Modell liegt bereits vor, wir brauchen eine 30-Sekunden Animation mit professionellem Rendering.',
          category: '3D Animation',
          budget: 3200,
          currency: 'EUR',
          experience: 'expert',
          status: 'open',
          deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
        }
      }
    ];

    // Erstelle Clients und Jobs
    for (const clientData of demoClients) {
      const { job, ...userData } = clientData;
      
      // Prüfe ob User bereits existiert
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        console.log(`⏭️  User ${userData.email} existiert bereits`);
        continue;
      }

      // Erstelle User
      const user = await User.create(userData);
      console.log(`✅ User erstellt: ${user.email}`);

      // Erstelle Job für diesen User
      await Job.create({
        ...job,
        clientId: user.id
      });
      console.log(`✅ Job erstellt: ${job.title}`);
    }

    console.log('\n🎉 Demo-Daten erfolgreich erstellt!');
    console.log('📊 5 Demo-Clients mit je 1 Job');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Demo-Daten:', error);
    process.exit(1);
  }
};

createDemoData();
