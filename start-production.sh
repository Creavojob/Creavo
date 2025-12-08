#!/bin/bash

# Creavo Production Starter mit PM2
# Läuft dauerhaft, auch nach Neustart

cd "$(dirname "$0")"

echo "🛑 Stoppe alte Prozesse..."
pkill -f 'node src/index.js' 2>/dev/null
pkill -f 'react-scripts start' 2>/dev/null

echo "🚀 Starte Creavo mit PM2..."

# PM2 über npx verwenden (keine globale Installation nötig)
npx pm2 start ecosystem.config.js

echo ""
echo "✅ Creavo läuft jetzt dauerhaft!"
echo ""
echo "📊 Status anzeigen:    npx pm2 status"
echo "📋 Logs anzeigen:      npx pm2 logs"
echo "🔄 Neu starten:        npx pm2 restart all"
echo "🛑 Stoppen:            npx pm2 stop all"
echo "❌ Komplett beenden:   npx pm2 delete all"
echo ""
echo "🔧 Auto-Start beim Booten einrichten:"
echo "   npx pm2 startup"
echo "   npx pm2 save"
echo ""
echo "Backend:  http://localhost:5001"
echo "Frontend: http://localhost:3000"
