#!/bin/bash

# Creavo Auto-Start Script
echo "🚀 Starte Creavo..."

# PostgreSQL prüfen
if ! docker ps | grep -q creavo-db; then
    echo "📦 Starte PostgreSQL Container..."
    cd /Users/mariodasilva/Documents/Creavojob
    docker start creavo-db || docker run -d --name creavo-db -p 5432:5432 -e POSTGRES_USER=creavo -e POSTGRES_PASSWORD=creavo123 -e POSTGRES_DB=creavo postgres:14
    sleep 3
fi

# Backend starten
echo "⚙️  Starte Backend..."
cd /Users/mariodasilva/Documents/Creavojob/backend
npm start > /tmp/creavo-backend.log 2>&1 &
sleep 4

# Frontend starten
echo "🎨 Starte Frontend..."
cd /Users/mariodasilva/Documents/Creavojob/frontend
HOST=0.0.0.0 npm start > /tmp/creavo-frontend.log 2>&1 &

echo "✅ Creavo läuft!"
echo "   Backend:  http://localhost:5001"
echo "   Frontend: http://localhost:3000"
echo "   Mobile:   http://192.168.178.116:3000"
