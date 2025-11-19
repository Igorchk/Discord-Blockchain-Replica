pragma solidity ^0.8.0;

contract Server {
    struct ServerData {
        string name;
        address owner;
        address[] members;
    }

    mapping(uint256 => ServerData) public servers;
    uint256 public serverCount;

    event ServerCreated(uint256 serverId, string name, address owner);

    function createServer(string calldata name) external {
        servers[serverCount].name = name;
        servers[serverCount].owner = msg.sender;
        servers[serverCount].members.push(msg.sender);

        emit ServerCreated(serverCount, name, msg.sender);

        serverCount++;
    }

    function joinServer(uint256 serverId) external {
        servers[serverId].members.push(msg.sender);
    }

    function getServer(uint256 serverId)
        external
        view
        returns (string memory, address, address[] memory)
    {
        ServerData storage s = servers[serverId];
        return (s.name, s.owner, s.members);
    }
}
