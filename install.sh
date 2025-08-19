#!/bin/bash

# PennyWise Tracker Installation Script
# This script installs dependencies and sets up the basic environment

set -e

echo "🚀 Installing PennyWise Tracker..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Clean install
echo "🧹 Cleaning previous installations..."
rm -rf node_modules package-lock.json 2>/dev/null || true

# Install with legacy peer deps to avoid conflicts
echo "📦 Installing dependencies (this may take a few minutes)..."
npm install --legacy-peer-deps

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your database credentials!"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with database credentials"
echo "2. Set up your PostgreSQL database"
echo "3. Run: npx prisma generate"
echo "4. Run: npx prisma db push" 
echo "5. Run: npm run db:seed"
echo "6. Run: npm run dev"
echo ""
echo "🎉 Happy expense tracking!"