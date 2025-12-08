# Creavo - Development Guidelines

## Project Overview
Creavo ist eine Full-Stack Job-Börse für die Medienbranche mit:
- Express.js Backend mit PostgreSQL
- React Frontend
- PayPal Escrow Payment System
- JWT Authentication

## Tech Stack
- **Backend**: Node.js, Express, Sequelize ORM, PostgreSQL
- **Frontend**: React, React Router, Axios
- **Auth**: JWT Tokens, bcryptjs Password Hashing
- **Payments**: PayPal REST API (Escrow Model)

## Development Setup

### Backend
1. `cd backend && npm install`
2. Konfiguriere `.env` mit DB & PayPal Credentials
3. Erstelle PostgreSQL Database: `createdb creavojob`
4. `npm run dev` zum Starten (Port 5000)

### Frontend
1. `cd frontend && npm install`
2. `npm start` (Port 3000)

## Project Structure
```
backend/src/
  ├── models/      (Sequelize Models: User, Job, Application, Payment)
  ├── routes/      (API Endpoints)
  ├── services/    (Business Logic)
  ├── middleware/  (Auth, Error Handling)
  └── config/      (Database, PayPal)

frontend/src/
  ├── pages/       (LoginPage, RegisterPage, JobsListPage, CreateJobPage)
  ├── components/  (Navigation, etc)
  ├── services/    (API Client with Axios)
  └── context/     (AuthContext for State Management)
```

## Key Workflows

### Authentication
- POST `/api/auth/register` - Registrierung (Freelancer/Client)
- POST `/api/auth/login` - Login mit JWT Token
- GET `/api/auth/profile` - Profil abrufen (authentifiziert)

### Job Management
- POST `/api/jobs` - Job erstellen (Client only)
- GET `/api/jobs` - Jobs auflisten
- GET `/api/jobs/:id` - Job Details
- PUT `/api/jobs/:id` - Job bearbeiten
- DELETE `/api/jobs/:id` - Job löschen

### Applications
- POST `/api/applications` - Auf Job bewerben (Freelancer)
- GET `/api/applications` - Bewerbungen sehen
- PUT `/api/applications/:id/accept` - Bewerbung akzeptieren (Client)

### Payments (Escrow)
- Geld wird bei Bewerbung-Annahme in Escrow gehalten
- POST `/api/payments/:id/release` - Zahlung an Freelancer freigeben
- POST `/api/payments/:id/refund` - Zahlung rückgängig machen

## Security Practices
- Alle Passwörter werden mit bcryptjs gehashed
- JWT Tokens für API Authentication
- Role-based Access Control (isClient, isFreelancer Middleware)
- CORS Protection
- Helmet für HTTP Security Headers

## Database
PostgreSQL mit Sequelize ORM:
- Users: Authentifizierung, Profile
- Jobs: Jobangebote
- Applications: Bewerbungen auf Jobs
- Payments: Escrow & Zahlungs-Tracking

Siehe docs/DATABASE.md für vollständiges Schema.

## Next Steps / TODOs
- [ ] Real PayPal Integration (currently mocked)
- [ ] Email Notifications
- [ ] Rating System (für beide Seiten)
- [ ] Chat/Messaging zwischen Parteien
- [ ] File Upload für Portfolio
- [ ] Search & Filter Optimierung
- [ ] Admin Dashboard
- [ ] Mobile App (React Native)
- [ ] Dispute Resolution System
- [ ] Contract/Agreement Management

## Important Notes
- Frontend lädt `/api/` Requests automatisch zu Backend via proxy in package.json
- Auth Token wird in localStorage gespeichert
- AuthContext verwaltet globalen Auth-State in React
- Alle Backend Routes sind unter `/api/` namespaced
