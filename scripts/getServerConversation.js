const fs = require("fs");
const { ethers } = require("ethers");
const axios = require("axios");

const MESSAGE_JSON = "./build/contracts/Message.json";
const GANACHE_URL = "http://127.0.0.1:8545";
const IPFS_GATEWAY = "http://127.0.0.1:8080/ipfs/";



async function main() {
  const serverId = process.argv[2];
  if (!serverId) {
    console.error("Usage: node getServerConversation.js <serverId>");
    process.exit(1);
  }

  const contractJson = JSON.parse(fs.readFileSync(MESSAGE_JSON));
  const networkId = Object.keys(contractJson.networks)[0];
  const contractAddress = contractJson.networks[networkId].address;

  const provider = new ethers.JsonRpcProvider(GANACHE_URL);
  const contract = new ethers.Contract(contractAddress, contractJson.abi, provider);

  console.log("Fetching batches for server:", serverId);
  const batches = await contract.getBatches(serverId);

  if (!batches.length) {
    console.log("No batches found.");
    return;
  }

  let allMessages = [];

  for (const [i, batch] of batches.entries()) {
    console.log(`Batch ${i}: CID ${batch.cid}`);
    try {
      const res = await axios.get(IPFS_GATEWAY + batch.cid);
      const json = res.data;
      const msgs = Array.isArray(json.messages) ? json.messages : json;
      allMessages.push(...msgs);
    } catch (err) {
      console.error("Failed to fetch IPFS batch:", err.message);
    }
  }

  allMessages.sort((a, b) => a.timestamp - b.timestamp);

  console.log("\n=== SERVER CHAT ===\n");
  allMessages.forEach((m) => {
    console.log(`[${m.timestamp}] ${m.from}: ${m.content}`);
  });
}

main().catch((err) => console.error("Error:", err));