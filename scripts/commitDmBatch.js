#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { create } = require("ipfs-http-client");
const { ethers } = require("ethers");

const dmArtifact = require(path.join(__dirname, "..", "build", "contracts", "DirectMessages.json"));

function getDeployedAddress(artifact, chainId) {
  if (artifact.networks && artifact.networks[String(chainId)]?.address) {
    return artifact.networks[String(chainId)].address;
  }
  const nets = artifact.networks ? Object.values(artifact.networks) : [];
  if (!nets.length) throw new Error("DirectMessages not deployed. Run `truffle migrate --reset`.");
  return nets[nets.length - 1].address;
}

(async () => {
  const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
  const ipfsApiUrl = process.env.IPFS_API_URL || "http://127.0.0.1:5001";
  const batchPath = process.env.BATCH_JSON || "message_batches/batch_dm_example.json";
  const receiver = process.env.RECEIVER;

  if (!receiver) throw new Error("Set RECEIVER in .env");

  // Ethers 
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const net = await provider.getNetwork();

  const pk = process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.trim();
  if (!pk) throw new Error("Set PRIVATE_KEY in .env (use a Ganache account PK).");
  const wallet = new ethers.Wallet(pk, provider);

  const dmAddress = getDeployedAddress(dmArtifact, net.chainId);
  const dm = new ethers.Contract(dmAddress, dmArtifact.abi, wallet);

  // Read JSON EXACTLY as stored and then hash over UTF-8 bytes
  const jsonString = fs.readFileSync(batchPath, "utf8");
  const bytes = ethers.toUtf8Bytes(jsonString);
  const batchHash = ethers.keccak256(bytes);

  // IPFS
  const ipfs = create({ url: ipfsApiUrl });
  const added = await ipfs.add({ path: path.basename(batchPath), content: jsonString }, { wrapWithDirectory: false });

  const cid = added.cid.toString();
  console.log("IPFS CID:", cid);
  console.log("keccak256:", batchHash);

  // Store on-chain
  const tx = await dm.storeMessageBatch(receiver, cid, batchHash);
  console.log("TX sent:", tx.hash);
  const rcpt = await tx.wait();
  console.log("Mined in block:", rcpt.blockNumber);

  const convoLen = await dm.getConversationLength(await wallet.getAddress(), receiver);
  console.log("Conversation length now:", convoLen.toString());
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
