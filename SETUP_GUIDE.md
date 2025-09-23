# Rural Healthcare Platform - Complete Setup Guide

## Project Structure Created ✅

```
rural-healthcare-platform/
├── frontend/                    # React frontend with TypeScript
├── backend/
│   ├── api-gateway/            # Central API Gateway (Port 3000)
│   └── services/
│       ├── auth-service/       # Authentication service (Port 3001)
│       ├── profile-service/    # Profile management (Port 3002)
│       ├── chat-service/       # AI Chat service (Port 3003)
│       └── appointment-service/ # Appointment booking (Port 3004)
├── shared/                     # Shared Prisma schema
└── docs/                      # Documentation
```

## 🚀 Complete Setup Commands

### 1. Frontend Setup (React + TypeScript + Vite)
```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install

# Core dependencies
npm install react-router-dom @reduxjs/toolkit react-redux
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-i18next i18next-browser-languagedetector
npm install react-hook-form @hookform/resolvers zod
npm install axios jwt-decode
npm install react-hot-toast @heroicons/react
npm install workbox-webpack-plugin

# UI and styling
npm install -D tailwindcss postcss autoprefixer @types/node
npx tailwindcss init -p

# Development tools
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-plugin-react eslint-plugin-react-hooks
```

### 2. API Gateway Setup
```bash
cd backend/api-gateway
npm install

# Core dependencies
npm install express cors helmet morgan compression express-rate-limit
npm install jsonwebtoken bcryptjs dotenv axios

# TypeScript and development
npm install -D @types/express @types/cors @types/node @types/jsonwebtoken @types/bcryptjs
npm install -D @types/morgan @types/compression
npm install -D typescript ts-node nodemon
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

# Copy environment file
cp .env.example .env
```

### 3. Auth Service Setup
```bash
cd backend/services/auth-service
npm install

# Core dependencies
npm install express cors helmet morgan
npm install prisma @prisma/client @prisma/extension-accelerate
npm install jsonwebtoken bcryptjs zod dotenv

# TypeScript and development
npm install -D @types/express @types/cors @types/node @types/jsonwebtoken @types/bcryptjs
npm install -D @types/morgan typescript ts-node nodemon prisma
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier
npm install -D jest @types/jest

# Link to shared schema
ln -s ../../../shared/prisma ./prisma
```

### 4. Profile Service Setup
```bash
cd backend/services/profile-service
npm install

# Same dependencies as auth-service
npm install express cors helmet morgan
npm install prisma @prisma/client @prisma/extension-accelerate
npm install jsonwebtoken zod dotenv

npm install -D @types/express @types/cors @types/node @types/jsonwebtoken
npm install -D @types/morgan typescript ts-node nodemon prisma
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

# Link to shared schema
ln -s ../../../shared/prisma ./prisma
```

### 5. Chat Service Setup
```bash
cd backend/services/chat-service
npm install

# Chat-specific dependencies
npm install express cors helmet morgan
npm install prisma @prisma/client @prisma/extension-accelerate
npm install openai jsonwebtoken zod dotenv

npm install -D @types/express @types/cors @types/node @types/jsonwebtoken
npm install -D typescript ts-node nodemon prisma
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

# Link to shared schema
ln -s ../../../shared/prisma ./prisma
```

### 6. Appointment Service Setup
```bash
cd backend/services/appointment-service
npm install

# Same dependencies as other services
npm install express cors helmet morgan
npm install prisma @prisma/client @prisma/extension-accelerate
npm install jsonwebtoken zod dotenv

npm install -D @types/express @types/cors @types/node @types/jsonwebtoken
npm install -D typescript ts-node nodemon prisma
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

# Link to shared schema
ln -s ../../../shared/prisma ./prisma
```

### 7. Shared Database Setup
```bash
cd shared
npm install
npm install prisma @prisma/client @prisma/extension-accelerate
npm install -D typescript ts-node @types/node bcryptjs @types/bcryptjs

# Setup Prisma
npx prisma init
cp .env.example .env

# Configure your database URL in .env, then:
npx prisma generate
npx prisma db push
npm run db:seed
```

## 🔧 Environment Configuration

### Database Setup (PostgreSQL + Prisma Accelerate)
1. Create a PostgreSQL database
2. Sign up for Prisma Accelerate at https://console.prisma.io
3. Get your Prisma Accelerate connection string
4. Update `.env` files in all services

### API Keys Required
- OpenAI API key for chat functionality
- Prisma Accelerate API key
- JWT secret for authentication

## 🏃‍♂️ Running the Application

### Development Mode (Run all services)
```bash
# Terminal 1 - API Gateway
cd backend/api-gateway && npm run dev

# Terminal 2 - Auth Service  
cd backend/services/auth-service && npm run dev

# Terminal 3 - Profile Service
cd backend/services/profile-service && npm run dev

# Terminal 4 - Chat Service
cd backend/services/chat-service && npm run dev

# Terminal 5 - Appointment Service
cd backend/services/appointment-service && npm run dev

# Terminal 6 - Frontend
cd frontend && npm run dev
```

### Using Process Manager (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem file (see ecosystem.config.js)
pm2 start ecosystem.config.js
pm2 logs
```

## 🌐 Service URLs
- Frontend: http://localhost:5173
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- Profile Service: http://localhost:3002
- Chat Service: http://localhost:3003
- Appointment Service: http://localhost:3004

## 📱 Key Features Implemented

### Backend Services
✅ **API Gateway**: Rate limiting, CORS, routing, auth middleware
✅ **Authentication**: JWT-based auth, user/doctor roles, registration/login
✅ **Profile Management**: User profiles, demographics, pregnancy data
✅ **Database Schema**: Complete PostgreSQL schema with Prisma
✅ **Error Handling**: Standardized error responses across services

### Frontend (To be implemented)
🔄 **React Setup**: Vite, TypeScript, Tailwind CSS
🔄 **State Management**: Redux Toolkit, React Query
🔄 **Internationalization**: react-i18next (English, Hindi, Tamil)
🔄 **UI Components**: Rural India-optimized design
🔄 **PWA Support**: Offline capabilities, service worker

### Rural India Optimizations
- Low-bandwidth design considerations
- Mobile-first responsive design
- Multilingual support (Hindi, Tamil)
- Large touch-friendly buttons
- High contrast colors
- Cultural sensitivity in UI elements

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

### Backend (Heroku/Railway)
```bash
# For each service, configure Procfile and deploy
# Example for Heroku:
heroku create rural-healthcare-api-gateway
git subtree push --prefix backend/api-gateway heroku main
```

## 🔒 Security Features
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT token authentication
- Input validation with Zod
- Password hashing with bcrypt

## 📚 Next Steps
1. Implement remaining frontend components
2. Set up CI/CD pipelines
3. Add comprehensive testing
4. Configure monitoring and logging
5. Set up domain and SSL certificates
6. Implement push notifications
7. Add analytics and user tracking

## 🤝 Contributing
See CONTRIBUTING.md for development guidelines and coding standards.

## 📄 License
MIT License - see LICENSE file for details.
