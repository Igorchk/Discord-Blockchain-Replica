const User = artifacts.require("User");
const Server = artifacts.require("Server");
const Message = artifacts.require("Message");

module.exports = async function (deployer) {
  await deployer.deploy(User);
  const user = await User.deployed();

  await deployer.deploy(Server);
  const server = await Server.deployed();

  await deployer.deploy(Message, server.address, user.address);
};
