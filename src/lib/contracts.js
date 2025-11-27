import { ethers } from "ethers";

import UserABI from "../../build/contracts/User.json";
import ServerABI from "../../build/contracts/Server.json";
import MessageABI from "../../build/contracts/Message.json";
import DirectMessagesABI from "../../build/contracts/DirectMessages.json";

const CONTRACTS = {
  User: "0xBBfC6615745C44BE8f13019fF15Cd415F88e85A4",
  Server: "0x662F226Bb95C85018d07de273eC3AC74967a742E",
  Message: "0x92449bFbad97685983235d2A577985c2e8C00639",
  DirectMessages: "0xA74CC605b37A7e97475a086B698FB926bDa771A1",
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

  async isUsernameAvailable(username) {
    return await this.contract.isUsernameAvailable(username);
  }

  async getUserData(address) {
    return await this.contract.getUserData(address);
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

  async leaveServer(serverId) {
    const tx = await this.contract.leaveServer(serverId);
    const receipt = await tx.wait();
    return receipt;
  }

  async getServer(serverId) {
    return await this.contract.getServer(serverId);
  }

  async isMember(serverId, address) {
    return await this.contract.isMember(serverId, address);
  }

  async getMemberCount(serverId) {
    const count = await this.contract.getMemberCount(serverId);
    return Number(count);
  }

  async getServerCount() {
    const count = await this.contract.serverCount();
    return Number(count);
  }

  async getAllServers() {
    return await this.contract.getAllServers();
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

  async storeBatch(serverId, cid, batchHash, previousCid = "") {
    const tx = await this.contract.storeBatch(
      serverId,
      cid,
      batchHash,
      previousCid
    );
    const receipt = await tx.wait();
    return receipt;
  }

  async getBatches(serverId) {
    return await this.contract.getBatches(serverId);
  }

  async getBatchCount(serverId) {
    const count = await this.contract.getBatchCount(serverId);
    return Number(count);
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

  async getConversationLength(user1, user2) {
    const length = await this.contract.getConversationLength(user1, user2);
    return Number(length);
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
