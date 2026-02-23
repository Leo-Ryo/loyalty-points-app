# Loyalty & Rewards System

A native desktop loyalty and rewards application built with Electron, Vue 3, Node.js, and PostgreSQL.

## Tech Stack

**Frontend (Desktop App):**
- Electron
- Vue 3 (Composition API)
- Pinia (State Management)
- Tailwind CSS

**Backend API:**
- Node.js
- Express
- Prisma ORM

**Database:**
- PostgreSQL

## Project Structure

Loyalty Recording/
│
├── backend/                      # Backend API (Node.js + Prisma)
│   ├── prisma/                   # Database schema & migrations
│   ├── src/                      # Application source code
│   └── package.json              # Backend dependencies & scripts
│
├── frontend/                     # Electron + Vue 3 desktop app
│   ├── electron/                 # Electron main process
│   ├── src/                      # Vue 3 application source
│   └── package.json              # Frontend dependencies & scripts
│
└── docs/                         # Project documentation
    ├── PHASES.md                 # Development roadmap & phases
    ├── DATABASE_SETUP.md         # PostgreSQL setup guide
    └── ARCHITECTURE.md           # System architecture documentation

    
## Current Status

**Phase 1: Database Schema** ✅ In Progress

See [PHASES.md](docs/PHASES.md) for full development roadmap.

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

### Database Setup

1. Install PostgreSQL (see [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md))
2. Create database and user:
   ```sql
   CREATE USER loyalty_app_user WITH PASSWORD 'your_password';
   CREATE DATABASE loyalty_dev WITH OWNER = loyalty_app_user;

### Backend Setup

    cd backend
    npm install

Create .env file:
    DATABASE_URL="postgresql://loyalty_app_user:your_password@localhost:5432/loyalty_dev?schema=public"

Run migrations:
    npx prisma generate
    npx prisma migrate dev --name init
    npx prisma db seed

Frontend Setup (Coming in Phase 3)

cd frontend
npm install
npm run dev

Development Phases
✅ Phase 1: Define Database Schema
⏳ Phase 2: Build Backend API
⏳ Phase 3: Build Admin App
⏳ Phase 4: Test Full Data Lifecycle
⏳ Phase 5: Build Customer App
Features
Admin Features
Dashboard with analytics
Customer management
Rewards catalog management
Inventory tracking
Promotions & advertisements
Settings & configuration
Customer Features
View points balance
Browse rewards catalog
Redeem points for rewards
Transaction history
Tier progression