const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const axios = require("axios");

const DIRECT_MESSAGES_JSON = "./build/contracts/DirectMessages.json";
const GANACHE_URL = "http://127.0.0.1:8545";
const IPFS_GATEWAY = "http://127.0.0.1:8080/ipfs/";

async function main() {
  const sender = process.argv[2];
  const receiver = process.argv[3];

  if (!sender || !receiver) {
    console.error("Usage: node getDMConversation.js <sender> <receiver>");
    process.exit(1);
  }

  console.log("Sender:   ", sender);
  console.log("Receiver: ", receiver);

  // --- 1: Load contract ---
  const contractJson = JSON.parse(fs.readFileSync(DIRECT_MESSAGES_JSON));
  const networkId = Object.keys(contractJson.networks)[0];
  const contractAddress = contractJson.networks[networkId].address;

  const provider = new ethers.JsonRpcProvider(GANACHE_URL);

  const contract = new ethers.Contract(
    contractAddress,
    contractJson.abi,
    provider
  );

  console.log("DirectMessages contract:", contractAddress);

  // --- 2: Load stored conversation batches ---
  console.log("\nFetching batches from chain...");
  const batches = await contract.getConversation(sender, receiver);

  if (batches.length === 0) {
    console.log("No message batches found.");
    return;
  }

  console.log(`Found ${batches.length} batch(es).\n`);

  let allMessages = [];

  // --- 3: For each batch, fetch JSON from IPFS ---
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const cid = batch.cid;

    console.log(`Batch ${i}: CID = ${cid}`);

    const url = IPFS_GATEWAY + cid;
    console.log("Fetching:", url);

    try {
      const response = await axios.get(url);
      const messages = response.data;

      console.log(`Loaded ${messages.length} messages from IPFS.\n`);

      allMessages.push(...messages);
    } catch (err) {
      console.error("Error fetching IPFS batch:", err.message);
    }
  }

  // --- 4: Sort messages by timestamp ---
  allMessages.sort((a, b) => {
    const t1 = a.timestamp || a.time;
    const t2 = b.timestamp || b.time;
    return t1 - t2;
  });

  // --- 5: Print final conversation ---
  console.log("===============================");
  console.log("FULL DM CONVERSATION");
  console.log("===============================\n");

  allMessages.forEach((msg) => {
    const sender = msg.sender || msg.from;
    const content = msg.text || msg.content || msg.message;
    const timestamp = msg.timestamp || msg.time;

    console.log(`[${timestamp}] ${sender}: ${content}`);
  });

  console.log("\nConversation loaded successfully.\n");
}

main().catch((err) => console.error("Error:", err));
