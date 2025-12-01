pragma solidity ^0.8.0;

contract Server {
    struct ServerData {
        string name;
        address owner;
        address[] members;
        bool exists;
        uint256 channelCount;
    }

    struct Channel {
        string name;
        bool exists;
    }

    mapping(uint256 => ServerData) public servers;
    mapping(uint256 => mapping(address => bool)) private membershipMap;
    mapping(uint256 => mapping(uint256 => Channel)) public channels;
    uint256 public serverCount;
    
    uint256 public constant MAX_NAME_LENGTH = 100;

    event ServerCreated(uint256 indexed serverId, string name, address indexed owner);
    event MemberJoined(uint256 indexed serverId, address indexed member);
    event MemberLeft(uint256 indexed serverId, address indexed member);
    event ChannelCreated(uint256 indexed serverId, uint256 indexed channelId, string name);

    function createServer(string calldata name) external {
        require(bytes(name).length > 0, "Server name cannot be empty");
        require(bytes(name).length <= MAX_NAME_LENGTH, "Server name too long");

        uint256 serverId = serverCount;
        
        servers[serverId].name = name;
        servers[serverId].owner = msg.sender;
        servers[serverId].exists = true;
        servers[serverId].members.push(msg.sender);
        servers[serverId].channelCount = 0;
        membershipMap[serverId][msg.sender] = true;

        channels[serverId][0] = Channel("general", true);
        servers[serverId].channelCount = 1;

        emit ServerCreated(serverId, name, msg.sender);
        emit ChannelCreated(serverId, 0, "general");
        
        serverCount++;
    }

    function createChannel(uint256 serverId, string calldata channelName) external {
        require(serverId < serverCount, "Invalid server ID");
        require(servers[serverId].exists, "Server does not exist");
        require(servers[serverId].owner == msg.sender, "Only owner can create channels");
        require(bytes(channelName).length > 0, "Channel name cannot be empty");
        require(bytes(channelName).length <= MAX_NAME_LENGTH, "Channel name too long");

        uint256 channelId = servers[serverId].channelCount;
        channels[serverId][channelId] = Channel(channelName, true);
        servers[serverId].channelCount++;

        emit ChannelCreated(serverId, channelId, channelName);
    }

    function getChannel(uint256 serverId, uint256 channelId) 
        external 
        view 
        returns (string memory name, bool exists) 
    {
        require(serverId < serverCount, "Invalid server ID");
        require(servers[serverId].exists, "Server does not exist");
        require(channelId < servers[serverId].channelCount, "Invalid channel ID");
        
        Channel storage channel = channels[serverId][channelId];
        return (channel.name, channel.exists);
    }

    function getChannelCount(uint256 serverId) external view returns (uint256) {
        require(serverId < serverCount, "Invalid server ID");
        require(servers[serverId].exists, "Server does not exist");
        return servers[serverId].channelCount;
    }

    function getAllChannels(uint256 serverId) 
        external 
        view 
        returns (uint256[] memory ids, string[] memory names) 
    {
        require(serverId < serverCount, "Invalid server ID");
        require(servers[serverId].exists, "Server does not exist");
        
        uint256 count = servers[serverId].channelCount;
        ids = new uint256[](count);
        names = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            if (channels[serverId][i].exists) {
                ids[i] = i;
                names[i] = channels[serverId][i].name;
            }
        }

        return (ids, names);
    }

    function isMember(uint256 serverId, address user) public view returns (bool) {
        require(servers[serverId].exists, "Server does not exist");
        return membershipMap[serverId][user];
    }

    function joinServer(uint256 serverId) external {
        require(serverId < serverCount, "Invalid server ID");
        require(servers[serverId].exists, "Server does not exist");
        require(!membershipMap[serverId][msg.sender], "Already a member");

        servers[serverId].members.push(msg.sender);
        membershipMap[serverId][msg.sender] = true;

        emit MemberJoined(serverId, msg.sender);
    }

    function getServer(uint256 serverId)
        external
        view
        returns (string memory name, address owner, address[] memory members)
    {
        require(serverId < serverCount, "Invalid server ID");
        require(servers[serverId].exists, "Server does not exist");
        
        ServerData storage s = servers[serverId];
        return (s.name, s.owner, s.members);
    }
}
