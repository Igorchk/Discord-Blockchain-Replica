#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
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

print_error() {
    echo -e "${RED} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW} $1${NC}"
}

print_info() {
    echo -e "${BLUE} $1${NC}"
}

print_header "Discord Blockchain Replica - Setup"

# Install Node.js 20
if ! command -v node &> /dev/null; then
    print_warning "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_success "Node.js installed"
fi

node --version
npm --version

# Install IPFS
if ! command -v ipfs &> /dev/null; then
    print_warning "Installing IPFS..."
    wget https://dist.ipfs.tech/kubo/v0.28.0/kubo_v0.28.0_linux-amd64.tar.gz
    tar -xvzf kubo_v0.28.0_linux-amd64.tar.gz
    cd kubo
    sudo bash install.sh
    cd ..
    rm -rf kubo kubo_v0.28.0_linux-amd64.tar.gz
    ipfs init
    print_success "IPFS installed"
fi

# Install Ganache
if ! command -v ganache-cli &> /dev/null; then
    print_warning "Installing Ganache..."
    sudo npm install -g ganache-cli
    print_success "Ganache installed"
fi

# Install Truffle
if ! command -v truffle &> /dev/null; then
    print_warning "Installing Truffle..."
    sudo npm install -g truffle
    print_success "Truffle installed"
fi

# Install project dependencies
print_info "Installing npm packages..."
npm install

# Configure IPFS CORS
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000", "http://127.0.0.1:3000"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST", "PUT"]'

print_success "Setup complete!"