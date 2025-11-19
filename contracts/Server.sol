pragma solidity ^0.8.0;

contract ServerManager {
    struct Server {
        string name;
        address owner;
        address[] members;
    }

    mapping(uint256 => Server) public servers;
    uint256 public serverCount;

    function createServer(string calldata name) external {
        servers[serverCount].name = name;
        servers[serverCount].owner = msg.sender;
        servers[serverCount].members.push(msg.sender);

        serverCount++;
    }

    function joinServer(uint256 serverId) external {
        servers[serverId].members.push(msg.sender);
    }
}
