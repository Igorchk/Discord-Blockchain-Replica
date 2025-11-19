pragma solidity ^0.8.0;

contract Message {
    struct MessageBatch {
        string cid;
        string previousCid;
        uint256 timestamp;
        address sender;
    }

    mapping(uint256 => MessageBatch[]) public batches;

    event BatchStored(uint256 indexed serverId, string cid, string previousCid, address uploader);

    function storeBatch(
        uint256 serverId,
        string calldata cid,
        string calldata previousCid
    ) external {
        batches[serverId].push(MessageBatch({
            cid: cid,
            previousCid: previousCid,
            timestamp: block.timestamp,
            sender: msg.sender
        }));

        emit BatchStored(serverId, cid, previousCid, msg.sender);
    }

    function getBatches(uint256 serverId) external view returns (MessageBatch[] memory) {
        return batches[serverId];
    }
}
