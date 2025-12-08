# Creavo - Media Industry Job Board

Eine Full-Stack Jobbörse für die Medienbranche. Unternehmen und Privatpersonen können dort Job-Angebote posten und Freelancer können sich bewerbern. Zahlungen werden über PayPal in einem Escrow-System verwaltet und nach Projektabschluss freigegeben.

## 🎯 Features

- **User Management**: Registrierung und Authentifizierung für Freelancer und Auftraggeber
- **Job Posting**: Unternehmen können Job-Angebote mit Budget, Anforderungen und Deadline posten
- **Applications**: Freelancer können sich auf Jobs bewerben mit Angeboten
- **Escrow Payment System**: PayPal Integration für sichere Zahlungsabwicklung
- **Rating & Reviews**: Bewertungssystem für Freelancer und Auftraggeber
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

## 🔐 Security Features

- Password Hashing mit bcryptjs
- JWT Token Authentication
- CORS Protection
- Helmet für HTTP Headers
- Input Validation

## 🚦 Nächste Schritte

- [ ] Real PayPal Integration implementieren
- [ ] Email Benachrichtigungen
- [ ] Bewertungssystem
- [ ] Chat-Funktion zwischen Auftraggeber & Freelancer
- [ ] File Upload für Portfolio
- [ ] Search & Filter Optimierung
- [ ] Admin Dashboard
- [ ] Mobile App

## 📝 Lizenz

MIT

## 👥 Support

Kontakt: support@creavo.de
