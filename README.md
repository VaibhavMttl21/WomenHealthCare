# Rural Healthcare Platform

A comprehensive web platform designed for rural healthcare assistance in India, specifically targeting pregnant women and healthcare providers.

## Architecture

This project follows a microservices architecture with:
- **Frontend**: React.js with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js microservices with TypeScript and Express.js
- **Database**: PostgreSQL with Prisma ORM and Prisma Accelerate
- **API Gateway**: Centralized routing and authentication

## Project Structure

```
rural-healthcare-platform/
├── frontend/                 # React frontend application
├── backend/
│   ├── api-gateway/         # API Gateway service
│   └── services/
│       ├── auth-service/    # Authentication & authorization
│       ├── profile-service/ # User profile management
│       ├── chat-service/    # AI chat functionality
│       └── appointment-service/ # Appointment scheduling
├── shared/                  # Shared utilities and types
└── docs/                   # Documentation
```

## Features

- 🔐 Multi-role authentication (Patients/Doctors)
- 👤 User profile management with rural-specific data
- 🤖 AI-powered health consultation chat
- 📅 Appointment scheduling system
- 🌍 Multi-language support (English, Hindi, Tamil)
- 📱 Progressive Web App (PWA) with offline support
- 🎨 Rural India-optimized UI design
- 🔔 Real-time notifications

## Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Git

### Setup Commands

1. **Clone and setup the project:**
   ```bash
   cd "/home/vaibhav/Documents/Women Healthcare/rural-healthcare-platform"
   ```

2. **Setup Frontend:**
   ```bash
   cd frontend
   npm create vite@latest . -- --template react-ts
   npm install
   npm install -D tailwindcss postcss autoprefixer @types/node
   npm install react-router-dom @reduxjs/toolkit react-redux
   npm install @tanstack/react-query @tanstack/react-query-devtools
   npm install react-i18next i18next-browser-languagedetector
   npm install react-hook-form @hookform/resolvers zod
   npm install axios jwt-decode
   npm install react-hot-toast @heroicons/react
   npm install workbox-webpack-plugin
   npx tailwindcss init -p
   ```

3. **Setup API Gateway:**
   ```bash
   cd ../backend/api-gateway
   npm init -y
   npm install express cors helmet morgan compression express-rate-limit
   npm install jsonwebtoken bcryptjs dotenv
   npm install -D @types/express @types/cors @types/node @types/jsonwebtoken @types/bcryptjs
   npm install -D typescript ts-node nodemon
   npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   npm install -D prettier
   ```

4. **Setup Microservices (repeat for each service):**
   ```bash
   cd ../services/auth-service
   npm init -y
   npm install express cors helmet morgan
   npm install prisma @prisma/client @prisma/extension-accelerate
   npm install jsonwebtoken bcryptjs zod
   npm install -D @types/express @types/node @types/jsonwebtoken @types/bcryptjs
   npm install -D typescript ts-node nodemon prisma
   ```

5. **Setup Database:**
   ```bash
   cd ../../../shared
   npm init -y
   npm install prisma @prisma/client @prisma/extension-accelerate
   npm install -D typescript
   npx prisma init
   ```

### Environment Setup

Create `.env` files in each service directory with appropriate configurations.

### Development

Run all services concurrently:
```bash
# In root directory
npm run dev
```

## Deployment

- **Frontend**: Vercel/Netlify
- **Backend Services**: Heroku/Railway
- **Database**: Prisma Accelerate with PostgreSQL

## Contributing

Please read our contributing guidelines and code of conduct before submitting PRs.

## License

MIT License - see LICENSE file for details.
