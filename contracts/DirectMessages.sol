pragma solidity ^0.8.0;

contract DirectMessages {
    struct MessageBatch {
        address sender;
        address receiver;
        string cid;
        bytes32 batchHash;
        uint256 timestamp;
    }

    mapping(address => mapping(address => MessageBatch[])) public conversations;

    event MessageBatchStored(
        address indexed sender,
        address indexed receiver,
        string cid,
        bytes32 batchHash,
        uint256 timestamp
    );

    function storeMessageBatch(
        address receiver,
        string calldata cid,
        bytes32 batchHash
    ) external {
        conversations[msg.sender][receiver].push(
            MessageBatch({
                sender: msg.sender,
                receiver: receiver,
                cid: cid,
                batchHash: batchHash,
                timestamp: block.timestamp
            })
        );

        emit MessageBatchStored(msg.sender, receiver, cid, batchHash, block.timestamp);
    }

    function getConversation(address user1, address user2)
        external
        view
        returns (MessageBatch[] memory)
    {
        return conversations[user1][user2];
    }
}
