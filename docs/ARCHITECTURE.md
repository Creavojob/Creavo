# Creavo Projektstruktur

## Verzeichnisübersicht

```
Creavojob/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # Sequelize/PostgreSQL Config
│   │   │   └── paypal.js         # PayPal SDK Config
│   │   ├── models/
│   │   │   ├── User.js           # Benutzer Modell
│   │   │   ├── Job.js            # Job Posting Modell
│   │   │   ├── Application.js    # Bewerbung Modell
│   │   │   └── Payment.js        # Zahlung/Escrow Modell
│   │   ├── routes/
│   │   │   ├── auth.js           # Auth Endpoints
│   │   │   ├── jobs.js           # Job Endpoints
│   │   │   ├── applications.js   # Bewerbung Endpoints
│   │   │   └── payments.js       # Zahlungs-Endpoints
│   │   ├── controllers/          # Business Logic
│   │   ├── services/
│   │   │   ├── authService.js    # Auth Logik
│   │   │   ├── jobService.js     # Job Logik
│   │   │   ├── applicationService.js
│   │   │   └── paymentService.js # PayPal & Escrow
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT & Role Check
│   │   ├── utils/                # Hilfsfunktionen
│   │   └── index.js              # Main Entry Point
│   ├── .env.example              # Env Variablen Template
│   ├── .env                       # (lokal, nicht im Repo)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navigation.js     # Main Navigation
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── JobsListPage.js
│   │   │   └── CreateJobPage.js
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth State Management
│   │   ├── services/
│   │   │   └── api.js            # API Client (Axios)
│   │   ├── styles/
│   │   ├── App.js                # Main Router
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── docs/
│   ├── API.md                    # API Dokumentation
│   ├── ARCHITECTURE.md           # System Architektur
│   └── DATABASE.md               # DB Schema
│
├── .github/
│   └── copilot-instructions.md
│
└── README.md                      # Projektübersicht
```

## Workflow

### 1. Registrierung/Login
- Benutzer registriert sich als Freelancer oder Client
- JWT Token wird generiert und gespeichert
- AuthContext verwaltet globalen Auth-State

### 2. Job Posting (Clients)
- Client erstellt neuen Job mit Details
- Job wird in DB gespeichert
- Freelancer können Job sehen und sich bewerben

### 3. Bewerbung (Freelancer)
- Freelancer reicht Angebot mit Preis ein
- Application wird erstellt und ist "pending"
- Client sieht alle Bewerbungen

### 4. Ausführung & Zahlungen (Escrow)
- Client akzeptiert Bewerbung
- Geld wird über PayPal in Escrow gehalten
- Freelancer führt Job aus
- Client bestätigt Completion
- Geld wird an Freelancer ausgezahlt

## Key Features

### Security
- Passwörter mit bcryptjs gehashed
- JWT für API Authentication
- Role-based Access Control (Freelancer vs Client)
- CORS & Helmet für HTTP Security

### Payment System
- PayPal Sandbox/Live Integration
- Escrow-Modell: Geld wird bis Ende des Projekts einbehalten
- Nur Client kann Zahlung freigeben
- Refund-Möglichkeiten

### User Experience
- Responsive React UI
- Echtzeit Auth State
- API Error Handling
- Loading States
