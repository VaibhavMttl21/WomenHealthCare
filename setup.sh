# Run Auth Service Migration
cd backend/services/auth-service
npx prisma migrate dev
cd ../notification-service
npx prisma generate client

#Run chatbot service migration
cd ../chatbot-service
npx prisma generate client

# Run Shared Migration and Seed
cd ../../../shared
npx prisma generate client
npx prisma generate client
node seed.js

# Start all services with PM2
cd ..
pm2 start ecosystem.config.js