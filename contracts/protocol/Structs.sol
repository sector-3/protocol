// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Enums.sol";

struct Contribution {
  uint256 timestamp;
  uint16 epochIndex;
  address contributor;
  string description;
  string proofURL;
  Alignment alignment;
  uint8 alignmentPercentage;
  uint8 hoursSpent;
}
