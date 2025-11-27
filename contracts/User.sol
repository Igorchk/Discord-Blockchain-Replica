pragma solidity ^0.8.0;

contract User {
    struct UserData {
        address userAddress;
        string username;
        bool isRegistered;
    }

    mapping(address => UserData) public users;
    mapping(string => bool) private usernameTaken;
    mapping(string => address) public usernameToAddress;

    event UserRegistered(address indexed userAddress, string username);

    function registerUser(string memory _username) public {
        require(!users[msg.sender].isRegistered, "Already registered");
        require(!usernameTaken[_username], "Username taken");
        
        users[msg.sender] = UserData(msg.sender, _username, true);
        usernameTaken[_username] = true;
        usernameToAddress[_username] = msg.sender;
        
        emit UserRegistered(msg.sender, _username);
    }

    function isRegistered(address _address) public view returns (bool) {
        return users[_address].isRegistered;
    }

    function getUsername(address _address) public view returns (string memory) {
        require(users[_address].isRegistered, "User not registered");
        return users[_address].username;
    }

    function getUserAddress(string memory _username) public view returns (address) {
        return usernameToAddress[_username];
    }
}