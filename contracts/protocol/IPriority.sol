// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Enums.sol";

interface IPriority {

  /**
   * Add a contribution for the current epoch.
   */
  function addContribution(string calldata description, Alignment alignment, uint8 hoursSpent) external;

  /**
   * Claim reward for contributions made in a past epoch.
   */
  function claimReward(uint8 epochNumber) external;
}
