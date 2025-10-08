@echo off
REM Run Auth Service Migration
cd backend\services\auth-service
npx prisma migrate dev

REM Run Shared Migration and Seed
cd ..\..\..\shared
npx prisma migrate dev
node seed.js

REM Start all services with PM2
cd ..
pm2 start ecosystem.config.js