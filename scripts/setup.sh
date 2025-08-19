#!/bin/bash

# PennyWise Tracker Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up PennyWise Tracker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if PostgreSQL is running
if ! pg_isready -q 2>/dev/null; then
    echo "⚠️  PostgreSQL is not running or not installed."
    echo "Please make sure PostgreSQL is installed and running."
    echo "You can also use Docker: docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres"
fi

# Copy environment variables
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your database credentials!"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Check if database is accessible
if [ -n "$DATABASE_URL" ]; then
    echo "🗄️  Setting up database..."
    npx prisma db push
    
    echo "🌱 Seeding database..."
    npm run db:seed
else
    echo "⚠️  DATABASE_URL not set. Please configure your database connection in .env"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with the correct database credentials"
echo "2. Run 'npm run db:push' to set up your database"
echo "3. Run 'npm run db:seed' to add sample data"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "Visit http://localhost:3000 to see your expense tracker!"