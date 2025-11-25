import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';

const ipfsClient = create({
  host: '127.0.0.1',
  port: '5001',
  protocol: 'http',
});

const IPFS_GATEWAY = 'http://127.0.0.1:8080/ipfs/';

export async function uploadToIPFS(data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    
    const bytes = ethers.toUtf8Bytes(jsonString);
    const hash = ethers.keccak256(bytes);
    
    const added = await ipfsClient.add(jsonString);
    const cid = added.cid.toString();
    
    console.log('Uploaded to IPFS:', cid);
    console.log('Hash:', hash);
    
    return { cid, hash };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS: ' + error.message);
  }
}

export async function fetchFromIPFS(cid) {
  try {
    const url = IPFS_GATEWAY + cid;
    console.log('Fetching from IPFS:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched from IPFS:', cid);
    
    return data;
  } catch (error) {
    console.error('IPFS fetch error:', error);
    throw new Error('Failed to fetch from IPFS: ' + error.message);
  }
}

export function createServerMessageBatch(messages) {
  return {
    messages: messages.map(msg => ({
      from: msg.from,
      content: msg.content,
      timestamp: msg.timestamp || Math.floor(Date.now() / 1000),
    })),
  };
}

export function createDMBatch(sender, receiver, messages) {
  return messages.map(msg => ({
    sender: sender,
    receiver: receiver,
    content: msg.content,
    timestamp: msg.timestamp || Math.floor(Date.now() / 1000),
  }));
}

export async function verifyMessageBatch(cid, expectedHash) {
  try {
    const data = await fetchFromIPFS(cid);
    const jsonString = JSON.stringify(data);
    const bytes = ethers.toUtf8Bytes(jsonString);
    const actualHash = ethers.keccak256(bytes);
    
    const isValid = actualHash === expectedHash;
    
    if (isValid) {
      console.log('Message batch verified');
    } else {
      console.warn('Hash mismatch - data may be corrupted');
    }
    
    return isValid;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}
