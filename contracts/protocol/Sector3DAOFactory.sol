// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import './Sector3DAO.sol';

contract Sector3DAOFactory {

  address public immutable owner;

  address[] public daos;

  event DAODeployed(address dao);

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "You aren't the owner");
    _;
  }

  function getDAOs() public view returns (address[] memory) {
    return daos;
  }

  function deployDAO(string calldata name, string calldata purpose, address token) public  returns (address) {
    Sector3DAO dao = new Sector3DAO(name, purpose, token);
    daos.push(address(dao));
    return address(dao);
  }

  function removeDAO(address dao) public onlyOwner {
    uint256 indexToRemove = daos.length;

    for (uint256 i = 0; i < daos.length; i++) {
      if (dao == daos[i]) {
        indexToRemove = i;
        break;
      }
    }

    require(indexToRemove < daos.length, "DAO not found");
    
    // Use the "delete-and-swap" technique to save gas.
    daos[indexToRemove] = daos[daos.length - 1];
    daos.pop();
  }
}
