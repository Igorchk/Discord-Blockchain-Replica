pragma solidity ^0.8.0;

contract MessageBatch {
    struct Batch {
        string cid;
        string previousCid;
        uint256 timestamp;
        address sender;
    }

    mapping(uint256 => Batch[]) public serverBatches;

    function storeBatch(
        uint256 serverId,
        string calldata cid,
        string calldata previousCid
    ) external {
        serverBatches[serverId].push(Batch({
            cid: cid,
            previousCid: previousCid,
            timestamp: block.timestamp,
            sender: msg.sender
        }));
    }
}
