const User = artifacts.require("User");
const Server = artifacts.require("Server");
const Message = artifacts.require("Message");
const DirectMessages = artifacts.require("DirectMessages");

module.exports = async function (deployer) {
  await deployer.deploy(User);
  const userInstance = await User.deployed();

  await deployer.deploy(Server);
  const serverInstance = await Server.deployed();

  await deployer.deploy(Message, serverInstance.address, userInstance.address);
  const messageInstance = await Message.deployed();

  deployer.deploy(DirectMessages);
  const directMessagesInstance = await DirectMessages.deployed();

  console.log(`
  const CONTRACTS = {
  User: "${userInstance.address}",
  Server: "${serverInstance.address}",
  Message: "${messageInstance.address}",
  DirectMessages: "${directMessagesInstance.address}",
};
  `);
};
