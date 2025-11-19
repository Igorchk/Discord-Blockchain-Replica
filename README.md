## Prerequisites
- Node.js (Recommended v20.X)
    - Verify by writing: "node-v" and "npm -v"

---

## How to Install
- Navigate to your chosen project directory, and run the following commands:
```bash
git clone https://github.com/Igorchk/Discord-Blockchain-Replica
cd ./Discord-Blockchain-Replica
npm install
```

---

## How to Run the App
```bash
npm run dev
```
Open the localhost address:
<http://localhost:3000>

---

## Project Structure
```
Discord-Blockchain-Replica
├─contracts/
├─migrations/
├─src/
│   ├─ app/
│   │   ├─ layout.js
│   │   ├─ page.js
│   │   ├─ login/
│   │   │   └─ page.js
│   │   └─ api/
│   │       ├─ config/
│   │       │   └─ route.js
│   │       ├─ options/
│   │       │   └─ route.js
│   │       └─ session/
│   │           └─ sync/
│   │               └─ route.js
│   └─ lib/
│       └─ supabase/
│           ├─ client.js
│           └─ server.js
├─ .gitignore
├─ .gitattributes
├─ package.json
├─ package-lock.json
├─ truffle-config.js
├─ README.md
...
```