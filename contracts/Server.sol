pragma solidity ^0.8.0;

contract Server {
    struct ServerData {
        string name;
        address owner;
        address[] members;
        bool exists;
    }

    mapping(uint256 => ServerData) public servers;
    mapping(uint256 => mapping(address => bool)) private membershipMap;
    uint256 public serverCount;
    
    uint256 public constant MAX_MEMBERS = 1000;
    uint256 public constant MAX_NAME_LENGTH = 100;

    event ServerCreated(uint256 indexed serverId, string name, address indexed owner);
    event MemberJoined(uint256 indexed serverId, address indexed member);
    event MemberLeft(uint256 indexed serverId, address indexed member);


    function createServer(string calldata name) external {
        require(bytes(name).length > 0, "Server name cannot be empty");
        require(bytes(name).length <= MAX_NAME_LENGTH, "Server name too long");

        uint256 serverId = serverCount;
        
        servers[serverId].name = name;
        servers[serverId].owner = msg.sender;
        servers[serverId].exists = true;
        servers[serverId].members.push(msg.sender);
        membershipMap[serverId][msg.sender] = true;

        emit ServerCreated(serverId, name, msg.sender);
        
        serverCount++;
    }

    function isMember(uint256 serverId, address user) public view returns (bool) {
        require(servers[serverId].exists, "Server does not exist");
        return membershipMap[serverId][user];
    }

    function joinServer(uint256 serverId) external {
        require(serverId < serverCount, "Invalid server ID");
        require(servers[serverId].exists, "Server does not exist");
        require(!membershipMap[serverId][msg.sender], "Already a member");
        require(servers[serverId].members.length < MAX_MEMBERS, "Server is full");

        servers[serverId].members.push(msg.sender);
        membershipMap[serverId][msg.sender] = true;

        emit MemberJoined(serverId, msg.sender);
    }

    function leaveServer(uint256 serverId) external {
        require(serverId < serverCount, "Invalid server ID");
        require(servers[serverId].exists, "Server does not exist");
        require(membershipMap[serverId][msg.sender], "Not a member");
        require(servers[serverId].owner != msg.sender, "Owner cannot leave");

        membershipMap[serverId][msg.sender] = false;

        address[] storage members = servers[serverId].members;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == msg.sender) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }

        emit MemberLeft(serverId, msg.sender);
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

    function getMemberCount(uint256 serverId) external view returns (uint256) {
        require(serverId < serverCount, "Invalid server ID");
        require(servers[serverId].exists, "Server does not exist");
        
        return servers[serverId].members.length;
    }

    function getAllServers() 
        external 
        view 
        returns (
            uint256[] memory ids, 
            string[] memory names, 
            uint256[] memory memberCounts
        ) 
    {
        ids = new uint256[](serverCount);
        names = new string[](serverCount);
        memberCounts = new uint256[](serverCount);

        for (uint256 i = 0; i < serverCount; i++) {
            if (servers[i].exists) {
                ids[i] = i;
                names[i] = servers[i].name;
                memberCounts[i] = servers[i].members.length;
            }
        }

        return (ids, names, memberCounts);
    }
}
