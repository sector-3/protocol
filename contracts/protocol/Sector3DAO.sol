// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * When deployed, an instance of this smart contract 
 * represents a new DAO added to the Sector#3 protocol.
 */
contract Sector3DAO {

  /**
   * The smart contract version.
   */
  uint8 public version = 1;

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
}
