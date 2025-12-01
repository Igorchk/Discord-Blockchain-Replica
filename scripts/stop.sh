#!/bin/bash

# Stop All Services Script

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN} $1${NC}"
}

print_info() {
    echo -e "${BLUE} $1${NC}"
}

print_header "Stopping All Services"

# STOP TMUX SESSION
if tmux has-session -t discord-blockchain 2>/dev/null; then
    print_info "Stopping tmux session"
    tmux kill-session -t discord-blockchain
    print_success "Tmux session stopped"
fi

# STOP ganache
print_info "Stopping Ganache"
pkill -f "ganache-cli" || true
print_success "Ganache stopped"

# STOP ipfs
print_info "Stopping IPFS"
pkill -f "ipfs daemon" || true
print_success "IPFS stopped"

# STOP nextjs
print_info "Stopping Next.js"
pkill -f "next dev" || true
pkill -f "node.*next" || true
print_success "Next.js stopped"

# Force kill any remaining processes on ports
print_info "Cleaning up ports"

# Ganache
fuser -k 8545/tcp 2>/dev/null || true
# IPFS API
fuser -k 5001/tcp 2>/dev/null || true
# IPFS Gateway
fuser -k 8080/tcp 2>/dev/null || true
# Next.js
fuser -k 3000/tcp 2>/dev/null || true

print_success "Ports cleaned"

print_header "All Services Stopped"
echo ""
print_success "All services have been stopped cleanly"
echo ""
print_info "To start services again: ${GREEN}./scripts/start.sh${NC}"
echo ""
