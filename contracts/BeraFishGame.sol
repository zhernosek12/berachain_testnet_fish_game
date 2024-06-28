// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BeraFishGame {
    struct User {
        uint256 fishes;
        uint256 nextHarvestTime;
    }

    mapping(address => User) public users;
    address[] public userList;
    address public owner;
    uint256 public endDate;

    event Harvested(address indexed user, uint256 fishes);
    event ResetFishes();
    event EndDateUpdated(uint256 newEndDate);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier beforeEndDate() {
        require(block.timestamp <= endDate, "The harvesting period has ended");
        _;
    }

    constructor(uint256 _endDate) {
        owner = msg.sender;
        endDate = _endDate;
    }

    function harvestSmall() external beforeEndDate {
        require(block.timestamp >= users[msg.sender].nextHarvestTime, "You cannot harvest yet");
        if (users[msg.sender].fishes == 0) {
            userList.push(msg.sender);
        }
        users[msg.sender].fishes += 10;
        users[msg.sender].nextHarvestTime = block.timestamp + 12 hours;
        emit Harvested(msg.sender, 10);
    }

    function harvestMedium() external beforeEndDate {
        require(block.timestamp >= users[msg.sender].nextHarvestTime, "You cannot harvest yet");
        if (users[msg.sender].fishes == 0) {
            userList.push(msg.sender);
        }
        users[msg.sender].fishes += 15;
        users[msg.sender].nextHarvestTime = block.timestamp + 24 hours;
        emit Harvested(msg.sender, 15);
    }

    function harvestLarge() external beforeEndDate {
        require(block.timestamp >= users[msg.sender].nextHarvestTime, "You cannot harvest yet");
        if (users[msg.sender].fishes == 0) {
            userList.push(msg.sender);
        }
        users[msg.sender].fishes += 2;
        users[msg.sender].nextHarvestTime = block.timestamp + 48 hours;
        emit Harvested(msg.sender, 2);
    }

    function getEndDate() external view returns (uint256) {
        return endDate;
    }

    function getFishes(address user) external view returns (uint256) {
        return users[user].fishes;
    }

    function getNextHarvestTime(address user) external view returns (uint256) {
        return users[user].nextHarvestTime;
    }

    function getAllUsers() external view returns (address[] memory) {
        return userList;
    }

    function resetFishes() external onlyOwner {
        for (uint256 i = 0; i < userList.length; i++) {
            users[userList[i]].fishes = 0;
            users[userList[i]].nextHarvestTime = 0;
        }
        emit ResetFishes();
    }

    function updateEndDate(uint256 newEndDate) external onlyOwner {
        endDate = newEndDate;
        emit EndDateUpdated(newEndDate);
    }
}
