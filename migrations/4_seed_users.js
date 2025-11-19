const User = artifacts.require("User");

module.exports = async function (deployer, network, accounts) {
  const user = await User.deployed();

  const seedNames = ["alice", "bob", "charlie", "dave"];

  for (let i = 0; i < seedNames.length; i++) {
    await user.registerUser(seedNames[i], { from: accounts[i] });
  }

  console.log("Users seeded!");
};
