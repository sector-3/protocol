// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import './Sector3DAOPriority.sol';

/**
 * When deployed, an instance of this smart contract 
 * represents a new DAO added to the Sector#3 protocol.
 */
contract Sector3DAO {

  /**
   * The smart contract version.
   */
  uint8 public constant version = 2;

  /**
   * The smart contract owner.
   */
  address public owner;

  /**
   * The name of the DAO.
   */
  string public name;

  /**
   * The purpose of the DAO.
   */
  string public purpose;

  /**
   * The priorities added by this DAO.
   */
  Sector3DAOPriority[] public priorities;

  constructor(string memory name_, string memory purpose_) {
    name = name_;
    purpose = purpose_;
    owner = msg.sender;
  }

  /**
   * Updates the DAO's name.
   */
  function setName(string calldata name_) public {
    require(msg.sender == owner, "You aren't the owner");
    name = name_;
  }

  /**
   * Updates the DAO's purpose.
   */
  function setPurpose(string calldata purpose_) public {
    require(msg.sender == owner, "You aren't the owner");
    purpose = purpose_;
  }

  function deployPriority(string calldata title, address rewardToken, uint16 epochDurationInDays, uint256 epochBudget) public {
    require(msg.sender == owner, "You aren't the owner");
    Sector3DAOPriority priority = new Sector3DAOPriority(address(this), title, rewardToken, epochDurationInDays, epochBudget);
    priorities.push(priority);
  }

  function getPriorityCount() public view returns (uint16) {
    return uint16(priorities.length);
  }
}
