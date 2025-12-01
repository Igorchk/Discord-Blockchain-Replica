#!/bin/bash

# Start IPFS Daemon

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Starting IPFS Daemon${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

echo -e "${GREEN}Configuration:${NC}"
echo "  API:      http://localhost:5001"
echo "  Gateway:  http://localhost:8080"
echo ""

echo -e "${YELLOW}Starting IPFS...${NC}"
echo ""

# Start IPFS daemon
ipfs daemon

# If IPFS exits, show message
echo ""
echo -e "${YELLOW}IPFS stopped${NC}"
