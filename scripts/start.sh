#!/bin/bash

# This script will start all required services in separate terminal windows:
# 1. Ganache CLI (blockchain)
# 2. IPFS Daemon
# 3. Next.js Frontend

# Colrs for text
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN} $1${NC}"
}

print_error() {
    echo -e "${RED} $1${NC}"
}

print_info() {
    echo -e "${BLUE} $1${NC}"
}

print_header "Starting All Services"

PROJECT_DIR=$(pwd)

# DETECT if ther is a terminal emulator
print_info "Detecting terminal emulator"

if command -v gnome-terminal &> /dev/null; then
    TERMINAL="gnome-terminal"
    TERMINAL_CMD="gnome-terminal --tab --title"
elif command -v xterm &> /dev/null; then
    TERMINAL="xterm"
    TERMINAL_CMD="xterm -title"
else
    print_error "No compatible terminal found. Using tmux instead"
    TERMINAL="tmux"
fi

    print_info "Using tmux for session management"
    
    # Check if tmux is installed
    if ! command -v tmux &> /dev/null; then
        print_error "tmux is not installed. Installing"
        sudo apt-get update && sudo apt-get install -y tmux
    fi
    
    tmux kill-session -t discord-blockchain 2>/dev/null || true
    
    print_info "Creating tmux session 'discord-blockchain'"
    
    tmux new-session -d -s discord-blockchain -n ganache "cd $PROJECT_DIR && ./scripts/start-ganache.sh; bash"
    
    tmux new-window -t discord-blockchain -n ipfs "cd $PROJECT_DIR && ./scripts/start-ipfs.sh; bash"
    
    tmux new-window -t discord-blockchain -n frontend "cd $PROJECT_DIR && sleep 5 && ./scripts/start-frontend.sh; bash"
    
    tmux select-window -t discord-blockchain:0
    
    print_success "Tmux session created!"
    echo ""
    print_info "Services starting in tmux session 'discord-blockchain'"
    echo ""
    echo "To view services:"
    echo "  ${GREEN}tmux attach -t discord-blockchain${NC}"
    echo ""
    echo "Tmux commands:"
    echo "  ${YELLOW}Ctrl+B then D${NC}        - Detach from session"
    echo "  ${YELLOW}Ctrl+B then [0/1/2]${NC}  - Switch between windows"
    echo "  ${YELLOW}Ctrl+B then ,${NC}        - Rename window"
    echo "  ${YELLOW}exit${NC}                 - Close current window"
    echo ""
    echo "To stop all services:"
    echo "  ${GREEN}./scripts/stop.sh${NC}"
    echo ""
    
    sleep 3
    
    print_info "Attaching to tmux session in 2 seconds"
    sleep 2
    tmux attach -t discord-blockchain

# DISPLAY STATUS
echo ""
print_header "Service Status"
echo ""
echo "Services should be running at:"
echo "  ${GREEN}Ganache:${NC}   http://localhost:8545"
echo "  ${GREEN}IPFS API:${NC}  http://localhost:5001"
echo "  ${GREEN}IPFS Gateway:${NC} http://localhost:8080"
echo "  ${GREEN}Frontend:${NC}  http://localhost:3000"
echo ""
print_info "Wait 10-15 seconds for all services to fully start"
echo ""
print_info "To deploy contracts: ${GREEN}./scripts/deploy.sh${NC}"
print_info "To stop all services: ${GREEN}./scripts/stop.sh${NC}"
echo ""
