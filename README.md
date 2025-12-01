## Prerequisites
- Ubuntu (Preferably v24.04)
or
- WSL with Ubuntu

---

## How to Install/Setup Project
Navigate to your chosen project directory, and run the following commands:
```bash
git clone https://github.com/Igorchk/Discord-Blockchain-Replica
cd Discord-Blockchain-Replica
```

You will need to give executable permissions to our scripts:
```bash
chmod +x scripts/*.sh
```

Run our setup script, this downloads:
- NPM (package manager for JavaScript)
- NodeJS (lightweight JavaScript runtime for building server-side applications)
- Ganache (local Ethereum blockchain)
- Truffle (Contract development framework)
- IPFS (Decentralized file storage and sharing)
- TMUX (Linux session manager)
```bash
./scripts/setup.sh
```
---
## Running the Application
Now that the environment has been setup, start all services with:
```bash
./scripts/start.sh
```
This will put you in a TMUX session with these 3 windows, respectively:
- Ganache
- IPFS
- Frontend

Deploy the contracts, open a new terminal window and run:
```bash
./scripts/deploy.sh
```

Only thing left is to now copy and paste your Ganache private keys into you MetaMask Wallet. 

---
## Obtaining Ganache Private Keys
By default you cannot scroll in TMUX session, so lets enable that real quick:
```bash
tmux set -g mouse on
```

Now, navigate back to the TMUX session, either by going back to the terminal window or opening that TMUX session with:
```bash
tmux attach -t discord-blockchain
```

Withing the session there will be 3 windows you can navigate as mentioned above. To navigate press:
`CRTL + B` and then on of the following numbers:
- `1` for Ganache
- `2` for IPFS
- `3` for Frontend

Press `1` and scroll all the way up until you see "Private Keys", copy on of the keys by highlighting the key and pressing right mouse button.

Now go to your MetaMask Wallet and paste it in. YOU'RE DONE!

---
## Project Structure
```
Discord-Blockchain-Replica
├── README.md
├── contracts
│   ├── DirectMessages.sol
│   ├── Message.sol
│   ├── Server.sol
│   └── User.sol
├── jsconfig.json
├── migrations
│   └── 1_deploy_contracts.js
├── package-lock.json
├── package.json
├── scripts
│   ├── deploy.sh
│   ├── setup.sh
│   ├── start-frontend.sh
│   ├── start-ganache.sh
│   ├── start-ipfs.sh
│   ├── start.sh
│   └── stop.sh
├── src
│   ├── app
│   │   ├── dashboard
│   │   │   ├── AddChannel.jsx
│   │   │   ├── AddFriend.jsx
│   │   │   ├── AddServer.jsx
│   │   │   ├── DirectMessages.jsx
│   │   │   ├── ServerMessages.jsx
│   │   │   ├── layout.js
│   │   │   └── page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── register
│   │       └── page.js
│   ├── contexts
│   │   └── Web3Context.jsx
│   └── lib
│       └── contracts.js
└── truffle-config.js
```
