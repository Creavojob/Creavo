const { Job, User } = require('../models');

const seedJobs = async () => {
  try {
    // Finde oder erstelle einen Demo-Auftraggeber
    const demoClient = await User.findOrCreate({
      where: { email: 'client@demo.com' },
      defaults: {
        firstName: 'Demo',
        lastName: 'Kunde',
        email: 'client@demo.com',
        password: 'demo123',
        userType: 'client'
      }
    });

    const jobs = [
      {
        title: '4K Produktvideo - Elektronik',
        description: 'Wir benötigen ein professionelles 4K Produktvideo für unsere neue Smartwatch. Das Video sollte 60-90 Sekunden lang sein und die Features und Design der Uhr präsentieren. Included: Konzept, Dreharbeiten, Schnitt, Farbkorrektur, Sound Design.',
        category: 'Videoproduktion',
        budget: 2500,
        currency: 'EUR',
        experience: 'expert',
        status: 'open',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Tage
        clientId: demoClient[0].id
      },
      {
        title: 'Motion Graphics - Erklärvideo',
        description: 'Wir suchen einen Motion Graphics Designer für ein 90-Sekunden Erklärvideo über unsere SaaS-Lösung. Das Video sollte ansprechende Animationen, Text-Overlays und eine professionelle Erzählung enthalten. Lieferung in 4K, geeignet für YouTube und LinkedIn.',
        category: 'Animation & Motion Graphics',
        budget: 1800,
        currency: 'EUR',
        experience: 'intermediate',
        status: 'open',
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        clientId: demoClient[0].id
      },
      {
        title: 'Audio Editing & Sounddesign - Podcast',
        description: 'Unser Podcast braucht professionelle Audio-Bearbeitung. 8 Episoden à 45 Minuten müssen editiert, gemischt und mit Intro/Outro versehen werden. Noise Reduction, EQ, Kompression und mastering sind erforderlich. Lieferung als MP3 und WAV.',
        category: 'Audio & Sound',
        budget: 1200,
        currency: 'EUR',
        experience: 'intermediate',
        status: 'open',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        clientId: demoClient[0].id
      },
      {
        title: 'Videocut & Post-Production - Eventfilm',
        description: 'Wir haben Rohmaterial von unserem Unternehmens-Event (ca. 15 Stunden) und benötigen einen professionellen 10-Minuten Highlight-Film. Color grading, Musik-Synchronisation, Übergänge und Effekte sind wichtig. Zielgruppe: B2B Marketing.',
        category: 'Videoschnitt',
        budget: 1500,
        currency: 'EUR',
        experience: 'intermediate',
        status: 'open',
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        clientId: demoClient[0].id
      },
      {
        title: 'Grafik Design - Social Media Content',
        description: 'Wir benötigen einen erfahrenen Grafikdesigner für die Erstellung von 30 Social-Media-Posts (Instagram, LinkedIn, TikTok). Verschiedene Formate, einheitliches Branding, ansprechende Designs mit unserem Logo und Farbschema. Lieferung als PNG, JPG und Video-Animationen.',
        category: 'Grafik & Design',
        budget: 900,
        currency: 'EUR',
        experience: 'entry',
        status: 'open',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        clientId: demoClient[0].id
      }
    ];

    // Erstelle Jobs
    const createdJobs = await Job.bulkCreate(jobs);
    console.log(`✅ ${createdJobs.length} Demo-Jobs erstellt`);
    
    return createdJobs;
  } catch (error) {
    console.error('Fehler beim Erstellen der Demo-Jobs:', error);
    throw error;
  }
};

module.exports = seedJobs;
