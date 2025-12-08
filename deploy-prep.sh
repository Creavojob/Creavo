#!/bin/bash

# Creavo - Quick Deploy Script
# Bereitet Code für GitHub vor und zeigt nächste Schritte

echo "🚀 Creavo Deployment Vorbereitung"
echo "=================================="
echo ""

# Prüfe ob git initialisiert ist
if [ ! -d .git ]; then
    echo "📦 Initialisiere Git Repository..."
    git init
    git branch -M main
else
    echo "✅ Git Repository existiert bereits"
fi

# Prüfe ob .gitignore existiert
if [ ! -f .gitignore ]; then
    echo "❌ .gitignore fehlt!"
    exit 1
fi

echo ""
echo "📝 Nächste Schritte:"
echo ""
echo "1️⃣  Erstelle GitHub Repository:"
echo "    → https://github.com/new"
echo "    → Name: creavojob"
echo ""
echo "2️⃣  Pushe Code zu GitHub:"
echo "    git add ."
echo "    git commit -m 'Initial commit - Creavo Job Board'"
echo "    git remote add origin https://github.com/DEIN-USERNAME/creavojob.git"
echo "    git push -u origin main"
echo ""
echo "3️⃣  Deploye auf Render:"
echo "    → https://render.com"
echo "    → Folge DEPLOYMENT.md"
echo ""
echo "4️⃣  Deploye Frontend auf Vercel:"
echo "    → https://vercel.com"
echo "    → Import creavojob Repository"
echo ""
echo "5️⃣  Richte Wachhaltedienst ein:"
echo "    → https://uptimerobot.com"
echo ""
echo "📖 Vollständige Anleitung: siehe DEPLOYMENT.md"
echo ""
