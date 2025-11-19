pragma solidity ^0.8.0;

contract UserRegistry {
    struct User {
        string username;
        string description;
        string profilePicHash;  // IPFS CID
        bool registered;
    }

    mapping(address => User) public users;

    function registerUser(string calldata username) external {
        require(!users[msg.sender].registered, "Already registered");

        users[msg.sender] = User({
            username: username,
            description: "",
            profilePicHash: "",
            registered: true
        });
    }

    function updateProfile(string calldata desc, string calldata picHash) external {
        require(users[msg.sender].registered, "Not registered");

        users[msg.sender].description = desc;
        users[msg.sender].profilePicHash = picHash;
    }
}
