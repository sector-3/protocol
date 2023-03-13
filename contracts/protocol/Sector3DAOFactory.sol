// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import './Sector3DAO.sol';

contract Sector3DAOFactory {

  address public owner;

  address[] public daos;

  constructor() {
    owner = msg.sender;
  }

  function setOwner(address owner_) public {
    require(msg.sender == owner, "You aren't the owner");
    owner = owner_;
  }

  function getDAOs() public view returns (address[] memory) {
    return daos;
  }

  function deployDAO(string calldata name, string calldata purpose, address token) public returns (address) {
    Sector3DAO dao = new Sector3DAO(name, purpose, token);
    daos.push(address(dao));
    return address(dao);
  }

  function removeDAO(address dao) public {
    require(msg.sender == owner, "You aren't the owner");
    address[] memory daosAfterRemoval = new address[](daos.length - 1);
    uint16 daosIndex = 0;
    for (uint16 i = 0; i < daosAfterRemoval.length; i++) {
      if (dao == daos[daosIndex]) {
        daosIndex++;
      }
      daosAfterRemoval[i] = daos[daosIndex];
      daosIndex++;
    }
    daos = daosAfterRemoval;
  }
}
