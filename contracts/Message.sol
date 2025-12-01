pragma solidity ^0.8.0;

interface IServer {
    function isMember(uint256 serverId, address user) external view returns (bool);
    function getChannelCount(uint256 serverId) external view returns (uint256);
}


interface IUser {
     function isRegistered(address account) external view returns (bool);
}

contract Message {
    struct MessageBatch {
        string cid;
        bytes32 batchHash;
        string previousCid;
        uint256 timestamp;
        address sender;
    }

    IServer public server;
    IUser public user;

    mapping(uint256 => mapping(uint256 => MessageBatch[])) public batches;

    event BatchStored(
        uint256 indexed serverId,
        uint256 indexed channelId,
        string cid,
        bytes32 batchHash,
        string previousCid,
        address uploader
    );

    constructor(address serverContract, address userContract) {
        server = IServer(serverContract);
        user = IUser(userContract);
    }

    function storeBatch(
        uint256 serverId,
        uint256 channelId,
        string calldata cid,
        bytes32 batchHash,
        string calldata previousCid
    ) external {
        require(server.isMember(serverId, msg.sender), "Not a member");
        require(channelId < server.getChannelCount(serverId), "Invalid channel");
        require(bytes(cid).length != 0, "Empty CID");
        require(batchHash != bytes32(0), "Empty hash");
        require(user.isRegistered(msg.sender), "User not registered");

        batches[serverId][channelId].push(MessageBatch({
            cid: cid,
            batchHash: batchHash,
            previousCid: previousCid,
            timestamp: block.timestamp,
            sender: msg.sender
        }));

        emit BatchStored(serverId, channelId, cid, batchHash, previousCid, msg.sender);
    }

    function getBatches(uint256 serverId, uint256 channelId) 
        external 
        view 
        returns (MessageBatch[] memory) 
    {
        return batches[serverId][channelId];
    }
}
