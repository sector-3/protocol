// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

struct Contribution {
  uint256 timestamp;
  uint16 epochIndex;
  address contributor;
  string description;
  string proofURL;
  uint8 hoursSpent;
  uint8 alignmentPercentage;
}
