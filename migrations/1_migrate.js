const User = artifacts.require("User");
const Server = artifacts.require("Server");
const Message = artifacts.require("Message");

module.exports = function (deployer) {
  deployer.deploy(User);
  deployer.deploy(Server);
  deployer.deploy(Message);
};
