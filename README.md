# Creavo - Media Industry Job Board

Eine Full-Stack Jobbörse für die Medienbranche. Unternehmen und Privatpersonen können dort Job-Angebote posten und Freelancer können sich bewerbern. Zahlungen werden über PayPal in einem Escrow-System verwaltet und nach Projektabschluss freigegeben.

## 🎯 Features

- **User Management**: Registrierung und Authentifizierung für Freelancer und Auftraggeber
- **Job Posting**: Unternehmen können Job-Angebote mit Budget, Anforderungen und Deadline posten
- **Applications**: Freelancer können sich auf Jobs bewerben mit Angeboten
- **Escrow Payment System**: PayPal Integration für sichere Zahlungsabwicklung
- **🔐 End-to-End Encrypted Messages**: Verschlüsselte Kommunikation zwischen Clients & Freelancern
- **Rating & Reviews**: Bewertungssystem für Freelancer und Auftraggeber
- **Dispute Resolution**: Admin-Zugriff bei Streitfällen (nur wenn beide Parteien zustimmen)
- **Project Management**: Verwaltung von Projektstatussen

## 🛠️ Tech Stack

### Backend
- **Node.js** & Express.js
- **PostgreSQL** & Sequelize ORM
- **JWT Authentication**
- **PayPal REST API**

### Frontend
- **React 18**
- **React Router v6**
- **Axios für API Calls**
- **TweetNaCl** für End-to-End Encryption (E2EE)

## 📦 Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Bearbeite .env mit deinen Konfigurationen
```

**Umgebungsvariablen konfigurieren:**
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=creavojob
JWT_SECRET=your_jwt_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Datenbank erstellen:**
```bash
# PostgreSQL Shell öffnen
psql -U postgres
CREATE DATABASE creavojob;
\q
```

**Server starten:**
```bash
npm run dev  # Development
npm start    # Production
```

### Frontend

```bash
cd frontend
npm install
```

**Server starten:**
```bash
npm start
```

Die App ist dann verfügbar unter `http://localhost:3000`

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/login` - Anmelden
- `GET /api/auth/profile` - Profil abrufen (authentifiziert)

### Jobs
- `GET /api/jobs` - Alle Jobs abrufen
- `GET /api/jobs/:id` - Job Details
- `POST /api/jobs` - Neuen Job erstellen (Auftraggeber only)
- `PUT /api/jobs/:id` - Job aktualisieren
- `DELETE /api/jobs/:id` - Job löschen

### Applications
- `POST /api/applications` - Auf Job bewerben
- `GET /api/applications` - Bewerbungen abrufen
- `PUT /api/applications/:id/accept` - Bewerbung akzeptieren

### Payments
- `POST /api/payments/:id/release` - Escrow-Zahlung freigeben
- `POST /api/payments/:id/refund` - Zahlung rückgängig machen

### Chat & E2EE Messages
- `GET /api/chat/conversations` - Alle Konversationen abrufen
- `POST /api/chat/conversations` - Neue Konversation erstellen
- `GET /api/chat/conversations/:id/messages` - Verschlüsselte Nachrichten abrufen
- `POST /api/chat/conversations/:id/messages` - Verschlüsselte Nachricht senden
- `POST /api/chat/conversations/:id/flag-dispute` - Streitfall markieren
- `GET /api/chat/keys/:userId` - Public Key eines Users abrufen
- `POST /api/chat/keys` - Public Key setzen/updaten
- `GET /api/chat/admin/disputes` - Admin: Alle Streitfälle
- `GET /api/chat/admin/conversations/:id/messages` - Admin: Dispute Messages

## 📊 Datenbankmodelle

### User
- Freelancer & Client/Company Profile
- Authentifizierungsdaten
- PayPal Verbindung
- Bewertungen

### Job
- Auftraggeber ID
- Titel, Beschreibung, Kategorie
- Budget & Deadline
- Status (open, in-progress, completed)

### Application
- Job & Freelancer Referenzen
- Gebotener Preis
- Status (pending, accepted, rejected)

### Payment
- Escrow-System
- PayPal Integration
- Zahlungsstatus Tracking

### Conversation & Message
- End-to-End Verschlüsselte Nachrichten (E2EE)
- TweetNaCl (X25519-XSalsa20-Poly1305)
- Dispute Management mit Admin-Zugriff
- Public/Private Key System

## 🔐 Security Features

- Password Hashing mit bcryptjs
- JWT Token Authentication
- **End-to-End Encryption** für Messages (TweetNaCl)
- Password-Protected Private Keys
- CORS Protection
- Helmet für HTTP Headers
- Input Validation
- Admin Dispute Resolution (nur mit Zustimmung beider Parteien)

📚 **Mehr Info**: Siehe [E2EE Messages Dokumentation](./docs/E2EE_MESSAGES.md)

## 🚦 Nächste Schritte

- [x] Chat-Funktion mit End-to-End Encryption
- [x] Dispute Resolution System
- [ ] Real PayPal Integration implementieren
- [ ] Email Benachrichtigungen
- [ ] Bewertungssystem erweitern
- [ ] File Upload für Portfolio & verschlüsselte Dateien
- [ ] Search & Filter Optimierung
- [ ] Multi-Device Key Sync für E2EE
- [ ] Mobile App

## 📝 Lizenz

MIT

## 👥 Support

Kontakt: support@creavo.de
