// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IPriority.sol";
import "./Enums.sol";

struct Contribution {
  string description;
  Alignment alignment;
  uint8 hoursSpent;
}

contract Sector3DAOPriority is IPriority {

  address public dao;

  string public title;

  address public rewardToken;

  uint256 public startTime;

  EpochDuration public epochDuration;

  uint256 public epochBudget;

  mapping (uint8 => Contribution[]) contributionsByEpochIndex;  // 0, 1, 2, ...

  constructor(address dao_, string memory title_, address rewardToken_, EpochDuration epochDuration_, uint256 epochBudget_) {
    dao = dao_;
    title = title_;
    rewardToken = rewardToken_;
    startTime = block.timestamp;
    epochDuration = epochDuration_;
    epochBudget = epochBudget_;
  }

  function addContribution(string calldata description, Alignment alignment, uint8 hoursSpent) public {
    // TODO
  }

  function claimReward(uint8 epochIndex) public {
    // TODO
  }

  /**
   * Calculates the current epoch index based on the priority's start time and epoch duration.
   */
  function getEpochIndex() public view returns (uint8) {
    uint256 timePassedSinceStart = block.timestamp - startTime;
    uint256 epochDurationInSeconds = 0;
    if (epochDuration == EpochDuration.Weekly) {
      epochDurationInSeconds = 1 weeks;
    } else if (epochDuration == EpochDuration.Biweekly) {
      epochDurationInSeconds = 2 weeks;
    } else if (epochDuration == EpochDuration.Monthly) {
      epochDurationInSeconds = 4 weeks;
    }
    return uint8(timePassedSinceStart / epochDurationInSeconds);
  }
}
