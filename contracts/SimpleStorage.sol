pragma solidity ^0.8.0;

contract SimpleStorage {
    string public message;

    function setMessage(string calldata _msg) public {
        message = _msg;
    }
}