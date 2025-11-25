pragma solidity ^0.8.0;

contract User {
    struct UserData {
        string username;
        bool registered;
        uint256 registrationTime;
    }

    mapping(address => UserData) public users;
    mapping(string => bool) private takenUsernames;
    mapping(string => address) private usernameToAddress;
    
    uint256 public totalUsers;
    
    uint256 public constant MIN_USERNAME_LENGTH = 3;
    uint256 public constant MAX_USERNAME_LENGTH = 32;

    event UserRegistered(address indexed user, string username, uint256 timestamp);

    function registerUser(string calldata name) external {
        require(!users[msg.sender].registered, "Already registered");
        require(bytes(name).length >= MIN_USERNAME_LENGTH, "Username too short");
        require(bytes(name).length <= MAX_USERNAME_LENGTH, "Username too long");
        require(!takenUsernames[name], "Username already taken");
        require(_isValidUsername(name), "Invalid username format");

        users[msg.sender] = UserData({
            username: name,
            registered: true,
            registrationTime: block.timestamp
        });

        takenUsernames[name] = true;
        usernameToAddress[name] = msg.sender;
        totalUsers++;

        emit UserRegistered(msg.sender, name, block.timestamp);
    }

    function isRegistered(address account) external view returns (bool) {
        return users[account].registered;
    }

    function getUsername(address account) external view returns (string memory) {
        require(users[account].registered, "User not registered");
        return users[account].username;
    }

    function getAddress(string calldata username) external view returns (address) {
        require(takenUsernames[username], "Username not found");
        return usernameToAddress[username];
    }

    function isUsernameAvailable(string calldata username) external view returns (bool) {
        return !takenUsernames[username];
    }

    function getUserData(address account) 
        external 
        view 
        returns (
            string memory username,
            bool registered,
            uint256 registrationTime
        ) 
    {
        UserData storage user = users[account];
        return (user.username, user.registered, user.registrationTime);
    }

    function _isValidUsername(string calldata name) private pure returns (bool) {
        bytes memory b = bytes(name);
        
        for (uint256 i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            
            if (!(
                (char >= 0x30 && char <= 0x39) ||
                (char >= 0x41 && char <= 0x5A) ||
                (char >= 0x61 && char <= 0x7A) ||
                (char == 0x5F)
            )) {
                return false;
            }
        }
        
        return true;
    }
}
