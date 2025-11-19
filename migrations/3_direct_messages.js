const DirectMessages = artifacts.require("DirectMessages");

module.exports = function (deployer) {
  deployer.deploy(DirectMessages);
};
