# 📦 PennyWise Tracker - Installation

Quick setup guide to get PennyWise Tracker running locally.

## Prerequisites

- Node.js 18+
- Docker Desktop
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/correia-jilson/pennywise-tracker.git
   cd pennywise-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   ```

4. **Start database**
   ```bash
   docker-compose up -d
   ```

5. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## Access

- **Application**: http://localhost:3000
- **Database GUI**: http://localhost:8080 (user: `pennywise`, password: `password123`)

## Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npx prisma studio    # Open database viewer
npm run db:seed      # Add sample data
docker-compose ps    # Check database status
```

## Troubleshooting

- **Port 3000 busy**: App will auto-use port 3001
- **Database errors**: Run `docker-compose restart postgres`
- **Build errors**: Run `rm -rf .next && npm run dev`
- **Dependency errors**: Run `npm install --legacy-peer-deps --force`

That's it! Visit http://localhost:3000 to start using PennyWise Tracker. 🚀