#!/bin/bash

# Start Next.js Frontend

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Starting Next.js Frontend${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

echo -e "${GREEN}Configuration:${NC}"
echo "  URL: http://localhost:3000"
echo ""

echo -e "${YELLOW}Starting development server...${NC}"
echo ""

# Clear Next.js cache and start
rm -rf .next
npm run dev

# If frontend exits, show message
echo ""
echo -e "${YELLOW}Frontend stopped${NC}"
