pragma solidity ^0.8.0;

contract User {
    struct UserData {
        string username;
        bool registered;
    }

    mapping(address => UserData) public users;

    event UserRegistered(address indexed user, string username);

    function registerUser(string calldata name) external {
        require(!users[msg.sender].registered, "Already registered");

        users[msg.sender] = UserData({
            username: name,
            registered: true
        });

        emit UserRegistered(msg.sender, name);
    }

    function isRegistered(address account) external view returns (bool) {
        return users[account].registered;
    }

    function getUsername(address account) external view returns (string memory) {
        require(users[account].registered, "Not registered");
        return users[account].username;
    }
}
