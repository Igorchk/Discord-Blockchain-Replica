import { ethers } from "ethers";

import UserABI from "../../build/contracts/User.json";
import ServerABI from "../../build/contracts/Server.json";
import MessageABI from "../../build/contracts/Message.json";
import DirectMessagesABI from "../../build/contracts/DirectMessages.json";

const CONTRACTS = {
  User: "0x68cCe90e4208c72F20Ce6011f0dA9F5f2651223f",
  Server: "0xe9AD25D0b6e5fd5395D619bD480f48dc752667A1",
  Message: "0x00024932A86D6Ec9900725E4cCDf2f650f38A26F",
  DirectMessages: "0x29fE333D0dd43140fE00eE9D90a33ABaf210616d",
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
    return await this.contract.isRegistered(address);
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

  async getAddress(username) {
    return await this.contract.getAddress(username);
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
