#!/bin/bash
# Creavo Quick Start - Backend + Frontend

echo "🚀 Starting Creavo..."

# Kill old processes
pkill -f "node src/index.js" 2>/dev/null
pkill -f "react-scripts start" 2>/dev/null
sleep 1

# Start Backend
echo "⚙️  Starting Backend on port 5001..."
cd /Users/mariodasilva/Documents/Creavojob/backend
npm start > /tmp/creavo-backend-live.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend
sleep 3

# Start Frontend
echo "🎨 Starting Frontend on port 3000..."
cd /Users/mariodasilva/Documents/Creavojob/frontend
BROWSER=none npm start > /tmp/creavo-frontend-live.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

sleep 2

echo ""
echo "✅ Creavo is running!"
echo "   Backend:  http://localhost:5001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Logs:"
echo "   Backend:  tail -f /tmp/creavo-backend-live.log"
echo "   Frontend: tail -f /tmp/creavo-frontend-live.log"
echo ""
echo "To stop: pkill -f 'node src/index.js' && pkill -f 'react-scripts start'"
