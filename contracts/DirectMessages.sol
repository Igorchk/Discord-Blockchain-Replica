pragma solidity ^0.8.0;


contract DirectMessages {
    struct MessageBatch {
        address sender;
        address receiver;
        string cid;
        bytes32 batchHash;
        uint256 timestamp;
    }

    mapping(address => mapping(address => MessageBatch[])) private conversations;

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
        require(receiver != address(0), "Invalid receiver address");
        require(receiver != msg.sender, "Cannot send DM to yourself");
        require(bytes(cid).length > 0, "CID cannot be empty");
        require(batchHash != bytes32(0), "Hash cannot be empty");

        address user1 = msg.sender < receiver ? msg.sender : receiver;
        address user2 = msg.sender < receiver ? receiver : msg.sender;

        conversations[user1][user2].push(
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
        require(user1 != address(0) && user2 != address(0), "Invalid addresses");
        
        address lower = user1 < user2 ? user1 : user2;
        address higher = user1 < user2 ? user2 : user1;
        
        return conversations[lower][higher];
    }

    function getConversationLength(address user1, address user2)
        external
        view
        returns (uint256)
    {
        require(user1 != address(0) && user2 != address(0), "Invalid addresses");
        
        address lower = user1 < user2 ? user1 : user2;
        address higher = user1 < user2 ? user2 : user1;
        
        return conversations[lower][higher].length;
    }

    function getBatchAt(address user1, address user2, uint256 index)
        external
        view
        returns (MessageBatch memory)
    {
        require(user1 != address(0) && user2 != address(0), "Invalid addresses");
        
        address lower = user1 < user2 ? user1 : user2;
        address higher = user1 < user2 ? user2 : user1;
        
        require(index < conversations[lower][higher].length, "Index out of bounds");
        
        return conversations[lower][higher][index];
    }
}
