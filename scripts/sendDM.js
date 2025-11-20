const fs = require("fs");
const path = require("path");
const { create } = require("ipfs-http-client");
const { ethers } = require("ethers");

const DIRECT_MESSAGES_JSON = "./build/contracts/DirectMessages.json";
const GANACHE_URL = "http://127.0.0.1:8545";

async function main() {
  const receiver = process.argv[2];
  const batchFile = process.argv[3];

  if (!receiver || !batchFile) {
    console.error("Usage: node sendDM.js <receiverAddress> <batchFileName>");
    process.exit(1);
  }

  const filePath = path.join("message_batches", batchFile);

  // --- 1: Load JSON batch ---
  const fileBuffer = fs.readFileSync(filePath);
  console.log("Loaded batch:", filePath);

  // --- 2: Hash the batch ---
  const hash = ethers.keccak256(fileBuffer);
  console.log("Computed keccak hash:", hash);

  // --- 3: Upload to IPFS ---
  console.log("Adding to IPFS...");
  const ipfs = create({
    host: "127.0.0.1",
    port: "5001",
    protocol: "http",
  });

  const added = await ipfs.add(fileBuffer);
  const cid = added.cid.toString();
  console.log("Stored on IPFS with CID:", cid);
  console.log(`URL: http://127.0.0.1:8080/ipfs/${cid}`);

  // --- 4: Load DirectMessages contract ABI + address ---
  const contractJson = JSON.parse(fs.readFileSync(DIRECT_MESSAGES_JSON));
  const networkId = Object.keys(contractJson.networks)[0];
  const contractAddress = contractJson.networks[networkId].address;

  console.log("DirectMessages contract address:", contractAddress);

  // --- 5: Connect to Ganache ---
  const provider = new ethers.JsonRpcProvider(GANACHE_URL);
  const signer = await provider.getSigner(0);

  const contract = new ethers.Contract(
    contractAddress,
    contractJson.abi,
    signer
  );

  // --- 6: Send transaction ---
  console.log("Calling storeMessageBatch...");

  const tx = await contract.storeMessageBatch(
    ethers.getAddress(receiver),
    cid,
    hash
  );

  console.log("Tx sent:", tx.hash);

  // --- 7: Wait for confirmation ---
  const receipt = await tx.wait();
  console.log("Tx confirmed:", receipt.transactionHash);

  console.log("\nDM batch stored on-chain successfully!");
}

main().catch((err) => {
  console.error("Error:", err);
});
