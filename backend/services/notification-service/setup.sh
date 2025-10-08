#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Notification Service Setup${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found. Please run this script from the notification-service directory.${NC}"
  exit 1
fi

echo -e "\n${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to install dependencies${NC}"
  exit 1
fi

echo -e "\n${YELLOW}Step 2: Checking environment variables...${NC}"

if [ ! -f ".env" ]; then
  echo -e "${YELLOW}No .env file found. Creating from .env.example...${NC}"
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "${GREEN}.env file created. Please update it with your Firebase credentials.${NC}"
  else
    echo -e "${RED}.env.example not found${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}.env file exists${NC}"
fi

echo -e "\n${YELLOW}Step 3: Checking Prisma schema...${NC}"

# Navigate to shared prisma directory
SHARED_PRISMA_DIR="../../shared/prisma"

if [ -d "$SHARED_PRISMA_DIR" ]; then
  echo -e "${GREEN}Shared Prisma directory found${NC}"
  
  echo -e "\n${YELLOW}Running Prisma generate...${NC}"
  cd "$SHARED_PRISMA_DIR"
  npx prisma generate
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Prisma client generated successfully${NC}"
  else
    echo -e "${RED}Failed to generate Prisma client${NC}"
    exit 1
  fi
  
  cd - > /dev/null
else
  echo -e "${RED}Shared Prisma directory not found at $SHARED_PRISMA_DIR${NC}"
  exit 1
fi

echo -e "\n${YELLOW}Step 4: Compiling TypeScript...${NC}"
npm run build

if [ $? -eq 0 ]; then
  echo -e "${GREEN}TypeScript compiled successfully${NC}"
else
  echo -e "${RED}TypeScript compilation failed${NC}"
  exit 1
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Update .env file with your Firebase credentials"
echo -e "2. Ensure your database is running and accessible"
echo -e "3. Run 'npm run dev' to start the service in development mode"
echo -e "4. The service will be available at http://localhost:3004"
echo -e "\n${YELLOW}Important:${NC}"
echo -e "- Get Firebase credentials from: https://console.firebase.google.com/"
echo -e "- Go to Project Settings > Service Accounts"
echo -e "- Generate new private key and extract the credentials"
echo ""
