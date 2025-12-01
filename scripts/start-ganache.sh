#!/bin/bash

# Start Ganache CLI

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Starting Ganache CLI${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

echo -e "${GREEN}Configuration:${NC}"
echo "  Port:      8545"
echo "  Gas Limit: 10,000,000"
echo "  Accounts:  10"
echo ""

echo -e "${YELLOW}Starting Ganache...${NC}"
echo ""

# Start Ganache with configuration
ganache-cli \
  --port 8545 \
  --gasLimit 10000000 \
  --accounts 10 \
  --defaultBalanceEther 100 \
  --networkId 1337 \

# If Ganache exits, show message
echo ""
echo -e "${YELLOW}Ganache stopped${NC}"
