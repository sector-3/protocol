// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Enums.sol";
import "./Structs.sol";

interface IPriority {

  /**
   * Add a contribution for the current epoch.
   */
  function addContribution(Contribution memory contribution) external;

  /**
   * Claim reward for contributions made in a past epoch.
   */
  function claimReward(uint16 epochNumber) external;
}
