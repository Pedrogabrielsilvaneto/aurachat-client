#!/bin/bash

# Aura Chatbot - Start Script

echo "🚀 Starting Aura CRM..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️ .env file not found. Creating default..."
    cp .env.example .env 2>/dev/null || echo "GEMINI_KEY=" > .env
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "✅ Backend ready."
echo "▶️  Starting Backend on port 3001..."
node index.js
