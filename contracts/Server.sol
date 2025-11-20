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

    function isMember(uint256 serverId, address user) public view returns (bool) {
        address[] storage m = servers[serverId].members;
        for (uint256 i = 0; i < m.length; i++) {
            if (m[i] == user) return true;
        }
        return false;
    }

    function joinServer(uint256 serverId) external {
        require(serverId < serverCount, "Invalid server");
        require(!isMember(serverId, msg.sender), "Already joined");
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
