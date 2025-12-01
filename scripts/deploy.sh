#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Deploying Contracts${NC}"

if ! nc -z localhost 8545 2>/dev/null; then
    echo -e "${RED}Ganache not running!${NC}"
    exit 1
fi

truffle compile
truffle migrate --reset

USER_ADDRESS=$(grep -oP '"address":\s*"\K0x[a-fA-F0-9]{40}' build/contracts/User.json | head -1)
SERVER_ADDRESS=$(grep -oP '"address":\s*"\K0x[a-fA-F0-9]{40}' build/contracts/Server.json | head -1)
MESSAGE_ADDRESS=$(grep -oP '"address":\s*"\K0x[a-fA-F0-9]{40}' build/contracts/Message.json | head -1)
DM_ADDRESS=$(grep -oP '"address":\s*"\K0x[a-fA-F0-9]{40}' build/contracts/DirectMessages.json | head -1)

echo ""
echo -e "${GREEN}Addresses:${NC}"
echo "User: $USER_ADDRESS"
echo "Server: $SERVER_ADDRESS"
echo "Message: $MESSAGE_ADDRESS"
echo "DirectMessages: $DM_ADDRESS"

cat > deployed-addresses.txt << ENDFILE
User=$USER_ADDRESS
Server=$SERVER_ADDRESS
Message=$MESSAGE_ADDRESS
DirectMessages=$DM_ADDRESS
ENDFILE

if [ -f "src/lib/contracts.js" ]; then
    sed -i "s/User: \"[^\"]*\"/User: \"$USER_ADDRESS\"/" src/lib/contracts.js
    sed -i "s/Server: \"[^\"]*\"/Server: \"$SERVER_ADDRESS\"/" src/lib/contracts.js
    sed -i "s/Message: \"[^\"]*\"/Message: \"$MESSAGE_ADDRESS\"/" src/lib/contracts.js
    sed -i "s/DirectMessages: \"[^\"]*\"/DirectMessages: \"$DM_ADDRESS\"/" src/lib/contracts.js
    echo -e "${GREEN}Updated src/lib/contracts.js${NC}"
fi

echo -e "${GREEN}Done!${NC}"