import { ethers } from "ethers";

import UserABI from "../../build/contracts/User.json";
import ServerABI from "../../build/contracts/Server.json";
import MessageABI from "../../build/contracts/Message.json";
import DirectMessagesABI from "../../build/contracts/DirectMessages.json";

const CONTRACTS = {
  User: "0x8924292b0502F0FC16cc3cc288d35E0eFA8e2A20",
  Server: "0xd4B6B4C0DE60ce101ba32baaAEb9aeB0b982c38b",
  Message: "0x744B6a431140816A5d0b1b8607AB2EF9261e51C7",
  DirectMessages: "0x1C41275480eCEbEE611A3a4785C2BB659B117D05",
};

export class UserContract {
  constructor(signerOrProvider) {
    this.contract = new ethers.Contract(
      CONTRACTS.User,
      UserABI.abi,
      signerOrProvider
    );
  }

  async registerUser(username) {
    const tx = await this.contract.registerUser(username);
    const receipt = await tx.wait();
    return receipt;
  }

  async isRegistered(address) {
    try {
      const result = await this.contract.isRegistered(address);
      return Boolean(result);
    } catch (error) {
      console.error("isRegistered error:", error);
      return false;
    }
  }

  async getUsername(address) {
    try {
      return await this.contract.getUsername(address);
    } catch (error) {
      return null;
    }
  }

  async getUserAddress(username) {
    return await this.contract.getUserAddress(username);
  }
}

export class ServerContract {
  constructor(signerOrProvider) {
    this.contract = new ethers.Contract(
      CONTRACTS.Server,
      ServerABI.abi,
      signerOrProvider
    );
  }

  async createServer(name) {
    const tx = await this.contract.createServer(name);
    const receipt = await tx.wait();
    return receipt;
  }

  async joinServer(serverId) {
    const tx = await this.contract.joinServer(serverId);
    const receipt = await tx.wait();
    return receipt;
  }

  async getServer(serverId) {
    return await this.contract.getServer(serverId);
  }

  async isMember(serverId, address) {
    return await this.contract.isMember(serverId, address);
  }

  async getServerCount() {
    const count = await this.contract.serverCount();
    return Number(count);
  }

  async createChannel(serverId, channelName) {
    const tx = await this.contract.createChannel(serverId, channelName);
    const receipt = await tx.wait();
    return receipt;
  }

  async getChannel(serverId, channelId) {
    return await this.contract.getChannel(serverId, channelId);
  }

  async getChannelCount(serverId) {
    const count = await this.contract.getChannelCount(serverId);
    return Number(count);
  }

  async getAllChannels(serverId) {
    return await this.contract.getAllChannels(serverId);
  }
}

export class MessageContract {
  constructor(signerOrProvider) {
    this.contract = new ethers.Contract(
      CONTRACTS.Message,
      MessageABI.abi,
      signerOrProvider
    );
  }

  async storeBatch(serverId, channelId, cid, batchHash, previousCid = "") {
    const tx = await this.contract.storeBatch(
      serverId,
      channelId,
      cid,
      batchHash,
      previousCid
    );
    const receipt = await tx.wait();
    return receipt;
  }

  async getBatches(serverId, channelId) {
    return await this.contract.getBatches(serverId, channelId);
  }
}

export class DirectMessagesContract {
  constructor(signerOrProvider) {
    this.contract = new ethers.Contract(
      CONTRACTS.DirectMessages,
      DirectMessagesABI.abi,
      signerOrProvider
    );
  }

  async storeMessageBatch(receiver, cid, batchHash) {
    const tx = await this.contract.storeMessageBatch(receiver, cid, batchHash);
    const receipt = await tx.wait();
    return receipt;
  }

  async getConversation(user1, user2) {
    return await this.contract.getConversation(user1, user2);
  }
}

export function getContracts(signer) {
  return {
    user: new UserContract(signer),
    server: new ServerContract(signer),
    message: new MessageContract(signer),
    directMessages: new DirectMessagesContract(signer),
  };
}
