// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Enums.sol";

struct Contribution {
  uint16 epochIndex;
  address contributor;
  string description;
  Alignment alignment;
  uint8 hoursSpent;
}
