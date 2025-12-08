# Creavo - Deployment Guide

## Render Free Tier Setup (€0/Monat)

### 1. GitHub Repository erstellen

1. Gehe zu https://github.com/new
2. Name: `creavojob`
3. Private oder Public (deine Wahl)
4. Erstelle Repository

### 2. Code zu GitHub pushen

```bash
cd /Users/mariodasilva/Documents/Creavojob
git init
git add .
git commit -m "Initial commit - Creavo Job Board"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/creavojob.git
git push -u origin main
```

### 3. Render Account erstellen

1. Gehe zu https://render.com
2. Sign up with GitHub
3. Autorisiere Render für dein Repository

### 4. PostgreSQL Datenbank erstellen

1. Dashboard → "New +" → "PostgreSQL"
2. Name: `creavo-db`
3. Database: `creavo`
4. User: `creavo`
5. Region: `Frankfurt` (am nächsten zu dir)
6. Plan: **Free**
7. Create Database
8. **Kopiere die "Internal Database URL"** (brauchst du gleich)

### 5. Backend deployen

1. Dashboard → "New +" → "Web Service"
2. Connect Repository: `creavojob`
3. Name: `creavo-backend`
4. Region: `Frankfurt`
5. Branch: `main`
6. Root Directory: `backend`
7. Runtime: `Node`
8. Build Command: `npm install`
9. Start Command: `node src/index.js`
10. Plan: **Free**

**Environment Variables hinzufügen:**
```
NODE_ENV=production
PORT=10000
DB_HOST=<aus Internal Database URL>
DB_PORT=5432
DB_NAME=creavo
DB_USER=creavo
DB_PASSWORD=<aus Internal Database URL>
JWT_SECRET=dein-super-geheimer-jwt-secret-hier-mindestens-32-zeichen-lang
JWT_EXPIRE=7d
FRONTEND_URL=https://creavo.vercel.app
PAYPAL_CLIENT_ID=<dein-paypal-client-id>
PAYPAL_CLIENT_SECRET=<dein-paypal-secret>
```

11. Create Web Service

### 6. Frontend auf Vercel deployen

1. Gehe zu https://vercel.com
2. Sign up with GitHub
3. "Add New..." → "Project"
4. Import `creavojob` Repository
5. Framework Preset: `Create React App`
6. Root Directory: `frontend`

**Environment Variables:**
```
REACT_APP_API_URL=https://creavo-backend.onrender.com/api
```

7. Deploy

### 7. Admin-User erstellen

Nach Backend-Deployment:

```bash
# Lokal verbinde zu Render PostgreSQL
DATABASE_URL="<External Database URL von Render>" node backend/src/seeds/createAdmin.js
```

Oder über Render Shell:
1. Backend Service → "Shell"
2. `node src/seeds/createAdmin.js`

### 8. Wachhaltedienst einrichten (kostenlos)

1. Gehe zu https://uptimerobot.com
2. Sign up kostenlos
3. Add New Monitor:
   - Type: `HTTP(s)`
   - Friendly Name: `Creavo Backend`
   - URL: `https://creavo-backend.onrender.com/api/health`
   - Monitoring Interval: `5 minutes`
4. Create Monitor

**Fertig!** Deine App läuft jetzt 24/7 kostenlos!

## URLs nach Deployment:

- **Frontend**: https://creavo.vercel.app
- **Backend**: https://creavo-backend.onrender.com
- **Admin Login**: https://creavo.vercel.app/auth

## Nächste Schritte:

1. Eigene Domain verbinden (später)
2. SSL ist automatisch aktiviert
3. Monitoring via Render Dashboard
4. Logs ansehen: Render Dashboard → Service → Logs

## Kosten:

- Render PostgreSQL Free: €0
- Render Backend Free: €0
- Vercel Frontend: €0
- UptimeRobot: €0
- **Total: €0/Monat** 🎉

## Upgrade später (wenn nötig):

- Render Paid: €7/Monat → keine Aufwachzeit
- Eigene Domain: ~€10/Jahr
- PayPal Business Account: kostenlos
