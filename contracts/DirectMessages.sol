pragma solidity ^0.8.0;

contract DirectMessages {
    struct MessageBatch {
        string cid;
        bytes32 batchHash;
    }

    mapping(address => mapping(address => MessageBatch[])) private conversations;

    event MessageBatchStored(address indexed user1, address indexed user2, string cid);

    function storeMessageBatch(address receiver, string memory cid, bytes32 batchHash) public {
        require(receiver != address(0), "Invalid receiver");
        require(receiver != msg.sender, "Cannot message yourself");
        require(bytes(cid).length > 0, "CID cannot be empty");
        
        address user1 = msg.sender < receiver ? msg.sender : receiver;
        address user2 = msg.sender < receiver ? receiver : msg.sender;
        
        conversations[user1][user2].push(MessageBatch(cid, batchHash));
        
        emit MessageBatchStored(user1, user2, cid);
    }

    function getConversation(address user1, address user2) public view returns (MessageBatch[] memory) {
        address lower = user1 < user2 ? user1 : user2;
        address higher = user1 < user2 ? user2 : user1;
        return conversations[lower][higher];
    }
}