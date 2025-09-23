#!/bin/bash

# Rural Healthcare Platform - Complete Setup Script
# This script will set up the entire project with all dependencies

set -e

echo "🏥 Setting up Rural Healthcare Platform..."
echo "============================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Create root package.json for workspace management
echo "📦 Creating workspace package.json..."
cat > package.json << 'EOF'
{
  "name": "rural-healthcare-platform",
  "version": "1.0.0",
  "description": "Healthcare platform for rural India",
  "private": true,
  "workspaces": [
    "frontend",
    "backend/api-gateway",
    "backend/services/*",
    "shared"
  ],
  "scripts": {
    "dev": "pm2 start ecosystem.config.js",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:api-gateway": "cd backend/api-gateway && npm run dev",
    "dev:auth": "cd backend/services/auth-service && npm run dev",
    "dev:profile": "cd backend/services/profile-service && npm run dev",
    "dev:chat": "cd backend/services/chat-service && npm run dev",
    "dev:appointment": "cd backend/services/appointment-service && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "npm run build:api-gateway && npm run build:services",
    "build:api-gateway": "cd backend/api-gateway && npm run build",
    "build:services": "cd backend/services/auth-service && npm run build && cd ../profile-service && npm run build && cd ../chat-service && npm run build && cd ../appointment-service && npm run build",
    "db:setup": "cd shared && npm run db:generate && npm run db:push && npm run db:seed",
    "lint": "npm run lint:frontend && npm run lint:backend",
    "lint:frontend": "cd frontend && npm run lint",
    "lint:backend": "cd backend/api-gateway && npm run lint && cd ../services/auth-service && npm run lint",
    "install:all": "./scripts/install-all.sh",
    "clean": "npm run clean:deps && npm run clean:build",
    "clean:deps": "rm -rf node_modules frontend/node_modules backend/*/node_modules backend/services/*/node_modules shared/node_modules",
    "clean:build": "rm -rf frontend/dist backend/*/dist backend/services/*/dist"
  },
  "devDependencies": {
    "pm2": "^5.3.0",
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
EOF

# Install root dependencies
echo "📦 Installing workspace dependencies..."
npm install

# Setup Frontend
echo "🎨 Setting up Frontend (React + TypeScript + Vite)..."
cd frontend

# Check if Vite project exists, if not create it
if [ ! -f "package.json" ]; then
    npm create vite@latest . -- --template react-ts --yes
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install additional frontend packages
npm install react-router-dom @reduxjs/toolkit react-redux
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-i18next i18next-browser-languagedetector
npm install react-hook-form @hookform/resolvers zod
npm install axios jwt-decode
npm install react-hot-toast @heroicons/react
npm install workbox-webpack-plugin

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer @types/node
npm install -D @tailwindcss/forms
npx tailwindcss init -p --yes

# Install development tools
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-plugin-react eslint-plugin-react-hooks
npm install -D vite-plugin-pwa

cd ..

# Setup API Gateway
echo "🚪 Setting up API Gateway..."
cd backend/api-gateway

npm install
npm install express cors helmet morgan compression express-rate-limit
npm install jsonwebtoken bcryptjs dotenv axios
npm install -D @types/express @types/cors @types/node @types/jsonwebtoken @types/bcryptjs
npm install -D @types/morgan @types/compression
npm install -D typescript ts-node nodemon
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
fi

cd ../..

# Setup Auth Service
echo "🔐 Setting up Auth Service..."
cd backend/services/auth-service

npm install
npm install express cors helmet morgan
npm install prisma @prisma/client @prisma/extension-accelerate
npm install jsonwebtoken bcryptjs zod dotenv
npm install -D @types/express @types/cors @types/node @types/jsonwebtoken @types/bcryptjs
npm install -D @types/morgan typescript ts-node nodemon
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier
npm install -D jest @types/jest

# Create TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Link to shared Prisma schema
if [ ! -L "prisma" ]; then
    ln -sf ../../../shared/prisma ./prisma
fi

cd ../../..

# Setup other services similarly
echo "👤 Setting up Profile Service..."
cd backend/services/profile-service

npm install
npm install express cors helmet morgan
npm install prisma @prisma/client @prisma/extension-accelerate
npm install jsonwebtoken zod dotenv
npm install -D @types/express @types/cors @types/node @types/jsonwebtoken
npm install -D @types/morgan typescript ts-node nodemon
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

# Copy TypeScript config
cp ../auth-service/tsconfig.json .

# Link to shared Prisma schema
if [ ! -L "prisma" ]; then
    ln -sf ../../../shared/prisma ./prisma
fi

cd ../../..

# Setup Chat Service
echo "💬 Setting up Chat Service..."
cd backend/services/chat-service

# Create package.json for chat service
cat > package.json << 'EOF'
{
  "name": "chat-service",
  "version": "1.0.0",
  "description": "Chat Service for Rural Healthcare Platform",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "prisma": "^5.7.1",
    "@prisma/client": "^5.7.1",
    "@prisma/extension-accelerate": "^0.6.2",
    "openai": "^4.24.1",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.5",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/morgan": "^1.9.9",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.15.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "prettier": "^3.1.1"
  }
}
EOF

npm install

# Copy TypeScript config
cp ../auth-service/tsconfig.json .

# Link to shared Prisma schema
if [ ! -L "prisma" ]; then
    ln -sf ../../../shared/prisma ./prisma
fi

cd ../../..

# Setup Appointment Service
echo "📅 Setting up Appointment Service..."
cd backend/services/appointment-service

# Create package.json for appointment service
cat > package.json << 'EOF'
{
  "name": "appointment-service",
  "version": "1.0.0",
  "description": "Appointment Service for Rural Healthcare Platform",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "prisma": "^5.7.1",
    "@prisma/client": "^5.7.1",
    "@prisma/extension-accelerate": "^0.6.2",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.5",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/morgan": "^1.9.9",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.15.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "prettier": "^3.1.1"
  }
}
EOF

npm install

# Copy TypeScript config
cp ../auth-service/tsconfig.json .

# Link to shared Prisma schema
if [ ! -L "prisma" ]; then
    ln -sf ../../../shared/prisma ./prisma
fi

cd ../../..

# Setup Shared Database
echo "🗄️ Setting up Shared Database..."
cd shared

npm install

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Please update the database connection string in shared/.env"
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "1. Update database connection strings in shared/.env"
echo "2. Set up Prisma Accelerate (optional but recommended)"
echo "3. Get OpenAI API key for chat functionality"
echo "4. Run 'npm run db:setup' to initialize database"
echo "5. Run 'npm run dev' to start all services"
echo ""
echo "🌐 Service URLs:"
echo "- Frontend: http://localhost:5173"
echo "- API Gateway: http://localhost:3000"
echo "- Auth Service: http://localhost:3001"
echo "- Profile Service: http://localhost:3002"
echo "- Chat Service: http://localhost:3003"
echo "- Appointment Service: http://localhost:3004"
echo ""
echo "📚 See SETUP_GUIDE.md for detailed documentation"
echo ""
echo "🚀 Happy coding!"
