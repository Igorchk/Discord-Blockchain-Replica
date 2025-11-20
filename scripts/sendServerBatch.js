const fs = require("fs");
const path = require("path");
const { create } = require("ipfs-http-client");
const { ethers } = require("ethers");

const MESSAGE_JSON = "./build/contracts/Message.json";
const GANACHE_URL = "http://127.0.0.1:8545";

async function main() {
  const serverId = process.argv[2];
  const serverIdNum = parseInt(serverId, 10);
  const batchFile = process.argv[3];
  if (!serverId || !batchFile) {
    console.error("Usage: node sendServerBatch.js <serverId> <batchFileName>");
    process.exit(1);
  }

  const filePath = path.join("message_batches", batchFile);
  const fileBuffer = fs.readFileSync(filePath);
  const batchHash = ethers.keccak256(fileBuffer);
  console.log("Hash:", batchHash);

  const ipfs = create({ host: "127.0.0.1", port: "5001", protocol: "http" });
  const added = await ipfs.add(fileBuffer);
  const cid = added.cid.toString();
  console.log("CID:", cid);

  const previousCid = ""; // optional

  const contractJson = JSON.parse(fs.readFileSync(MESSAGE_JSON));
  const networkId = Object.keys(contractJson.networks)[0];
  const contractAddress = contractJson.networks[networkId].address;

  const provider = new ethers.JsonRpcProvider(GANACHE_URL);
  const signer = await provider.getSigner(0);
  const contract = new ethers.Contract(contractAddress, contractJson.abi, signer);

  const tx = await contract.storeBatch(serverIdNum, cid, batchHash, previousCid);
  console.log("Tx:", tx.hash);
  await tx.wait();
  console.log("Server batch stored");
}

main().catch(err => console.error(err));
