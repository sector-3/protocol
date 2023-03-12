// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import './Sector3DAO.sol';

contract Sector3DAOFactory {

  address public owner;

  address[] public daos;

  constructor() {
    owner = msg.sender;
    // // daos.push(0x5FbDB2315678afecb367f032d93F642f64180aa3); // localhost
    // daos.push(0xEa98D59e4EF83822393AF87e587713c2674eD4FD); // Sector#3 DAO (v0)
    // daos.push(0x2D624a0bA38b40B4f7bE2bfeb56B6B0dD81Be6A1); // Nation3 (v0)
    // daos.push(0x9741B82017485759c9Bcc13FeA10c1105f82d25C); // Bankless Africa (v0)
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
