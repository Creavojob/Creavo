require('dotenv').config();
const axios = require('axios');

const PRODUCTION_API = 'https://creavo-backend.onrender.com/api';

// Jobs die in Production erstellt werden sollen
const jobs = [
  {
    title: '4K Produktvideo - Elektronik',
    description: 'Wir benötigen ein professionelles 4K Produktvideo für unsere neue Smartwatch. Das Video sollte 60-90 Sekunden lang sein und die Features und Design der Uhr präsentieren. Included: Konzept, Dreharbeiten, Schnitt, Farbkorrektur, Sound Design.',
    category: 'video',
    budget: 2500,
    deadline: '2026-01-10'
  },
  {
    title: 'Motion Graphics - Erklärvideo',
    description: 'Wir suchen einen Motion Graphics Designer für ein 90-Sekunden Erklärvideo über unsere SaaS-Lösung. Das Video sollte ansprechende Animationen, Text-Overlays und eine professionelle Erzählung enthalten. Lieferung in 4K, geeignet für YouTube und LinkedIn.',
    category: 'animation',
    budget: 1800,
    deadline: '2026-01-05'
  },
  {
    title: 'Audio Editing & Sounddesign - Podcast',
    description: 'Unser Podcast braucht professionelle Audio-Bearbeitung. 8 Episoden à 45 Minuten müssen editiert, gemischt und mit Intro/Outro versehen werden. Noise Reduction, EQ, Kompression und mastering sind erforderlich. Lieferung als MP3 und WAV.',
    category: 'audio',
    budget: 1200,
    deadline: '2025-12-28'
  },
  {
    title: 'Videocut & Post-Production - Eventfilm',
    description: 'Wir haben Rohmaterial von unserem Unternehmens-Event (ca. 15 Stunden) und benötigen einen professionellen 10-Minuten Highlight-Film. Color grading, Musik-Synchronisation, Übergänge und Effekte sind wichtig. Zielgruppe: B2B Marketing.',
    category: 'video',
    budget: 1500,
    deadline: '2026-01-08'
  },
  {
    title: 'Grafik Design - Social Media Content',
    description: 'Wir benötigen einen erfahrenen Grafikdesigner für die Erstellung von 30 Social-Media-Posts (Instagram, LinkedIn, TikTok). Verschiedene Formate, einheitliches Branding, ansprechende Designs mit unserem Logo und Farbschema.',
    category: 'design',
    budget: 900,
    deadline: '2025-12-30'
  },
  {
    title: 'Corporate Video - Imagefilm',
    description: 'Professioneller Imagefilm für unser Unternehmen. 3-5 Minuten, Interviews mit Mitarbeitern, B-Roll vom Büro, professionelle Sprecherstimme. Ziel: Recruiting und Brand Awareness.',
    category: 'video',
    budget: 3500,
    deadline: '2026-01-20'
  },
  {
    title: '3D Animation - Produktvisualisierung',
    description: '3D Animation eines neuen Produkts für Marketing. Photorealistische Darstellung, 360° Ansichten, Explosionszeichnung der Komponenten. Export in 4K für Web und Präsentationen.',
    category: 'animation',
    budget: 2800,
    deadline: '2026-01-15'
  },
  {
    title: 'Musikproduktion - Werbesong',
    description: 'Wir brauchen einen eingängigen 30-Sekunden Werbesong für eine Radio/TV-Kampagne. Modern, energetisch, einprägsam. Verschiedene Versionen (mit/ohne Vocals, unterschiedliche Längen).',
    category: 'audio',
    budget: 2000,
    deadline: '2026-01-12'
  },
  {
    title: 'Logo Animation - Intro/Outro',
    description: 'Animiertes Logo für Video-Intros und Outros. 5 Sekunden Intro, 3 Sekunden Outro. Elegant, modern, passend zu unserem Corporate Design. Mit Sound-Design.',
    category: 'animation',
    budget: 600,
    deadline: '2025-12-25'
  },
  {
    title: 'Drohnenvideo - Immobilie',
    description: 'Professionelle Drohnenaufnahmen einer Immobilie. 4K Footage, verschiedene Perspektiven und Höhen. Zusätzlich Schnitt zu einem 2-Minuten Präsentationsvideo mit Musik.',
    category: 'video',
    budget: 1200,
    deadline: '2025-12-22'
  },
  {
    title: 'Illustration - Kinderbuch',
    description: 'Suche Illustrator für ein Kinderbuch. 20 ganzseitige Illustrationen im einheitlichen Stil. Farbenfrohe, kindgerechte Darstellungen. Digital Art bevorzugt.',
    category: 'design',
    budget: 3000,
    deadline: '2026-02-01'
  },
  {
    title: 'Whiteboard Animation - Schulungsvideo',
    description: 'Whiteboard-Animation für internes Schulungsvideo. 5 Minuten, erklärt komplexe Prozesse auf einfache Art. Inkl. Sprechertext und professioneller Vertonung.',
    category: 'animation',
    budget: 1400,
    deadline: '2026-01-18'
  },
  {
    title: 'Voice-Over - E-Learning',
    description: 'Professionelle Sprecherstimme für E-Learning Module. Ca. 2 Stunden Material auf Deutsch. Klare Aussprache, angenehme Stimme, verschiedene Betonungen.',
    category: 'audio',
    budget: 800,
    deadline: '2025-12-28'
  },
  {
    title: 'Timelapse Video - Bauprojekt',
    description: 'Langzeit-Timelapse eines Bauprojekts über 6 Monate. Setup von Kamera, regelmäßige Wartung, Schnitt zu 2-Minuten Video. Equipment wird gestellt.',
    category: 'video',
    budget: 4500,
    deadline: '2026-06-01'
  },
  {
    title: 'Podcast Cover Art',
    description: 'Cover Art für neuen Podcast. Quadratisches Format, eye-catching Design, funktioniert auch in kleinen Größen. Verschiedene Varianten für Social Media.',
    category: 'design',
    budget: 400,
    deadline: '2025-12-20'
  },
  {
    title: 'Green Screen Keying',
    description: 'Green Screen Keying und Compositing für Video. 10 Minuten Material, sauberes Keying, Farbabgleich, Schattenintegration. Export in ProRes.',
    category: 'video',
    budget: 700,
    deadline: '2026-01-05'
  },
  {
    title: 'Infografik Design',
    description: 'Erstellung von 10 Infografiken für Website und Social Media. Datenvisualisierung, moderne Designs, verschiedene Formate. Quelldateien in AI/Sketch.',
    category: 'design',
    budget: 1100,
    deadline: '2026-01-10'
  }
];

const seedProductionDatabase = async () => {
  try {
    console.log('🔄 Starte Export zur Production-Datenbank...\n');
    
    // 1. Login als Admin
    console.log('1️⃣ Login als Admin...');
    const loginRes = await axios.post(`${PRODUCTION_API}/auth/login`, {
      email: 'creavojob@gmail.com',
      password: 'AdminCreavo2024!'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login erfolgreich\n');
    
    // 2. Erstelle alle Jobs
    console.log('2️⃣ Erstelle Jobs in Production...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const job of jobs) {
      try {
        await axios.post(`${PRODUCTION_API}/jobs`, job, {
          headers: { Authorization: `Bearer ${token}` }
        });
        successCount++;
        console.log(`✅ Job erstellt: ${job.title}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Fehler bei: ${job.title}`, error.response?.data || error.message);
      }
    }
    
    console.log(`\n✨ Fertig! ${successCount} Jobs erfolgreich erstellt, ${errorCount} Fehler`);
    
  } catch (error) {
    console.error('❌ Fehler:', error.response?.data || error.message);
    process.exit(1);
  }
};

// Script ausführen
seedProductionDatabase();
