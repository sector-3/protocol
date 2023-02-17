// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Sector3DAO.sol";

contract Sector3DAOFactory is ReentrancyGuard {
    event DAOCreated(address dao);

    function createDAO(string memory name, string memory purpose) external nonReentrant returns (address dao) {
        dao = address(new Sector3DAO(name, purpose));
        emit DAOCreated(dao);
        return dao;
    }
}
