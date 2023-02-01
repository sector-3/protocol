// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IPriority.sol";
import "./Enums.sol";
import "./Structs.sol";

contract Sector3DAOPriority is IPriority {
  using SafeERC20 for IERC20;

  address public dao;
  string public title;
  IERC20 public rewardToken;
  uint256 public startTime;
  EpochDuration public epochDuration;
  uint256 public epochBudget;
  Contribution[] contributions;

  event ContributionAdded(Contribution contribution);
  event RewardClaimed(uint16 epochIndex, address contributor, uint256 amount);

  error EpochNotYetEnded();
  error NoRewardForEpoch();

  constructor(address dao_, string memory title_, address rewardToken_, EpochDuration epochDuration_, uint256 epochBudget_) {
    dao = dao_;
    title = title_;
    rewardToken = IERC20(rewardToken_);
    startTime = block.timestamp;
    epochDuration = epochDuration_;
    epochBudget = epochBudget_;
  }

    /**
   * Calculates the current epoch index based on the `Priority`'s start time and epoch duration.
   */
  function getEpochIndex() public view returns (uint16) {
    uint256 timePassedSinceStart = block.timestamp - startTime;
    uint256 epochDurationInSeconds = 0;
    if (epochDuration == EpochDuration.Weekly) {
      epochDurationInSeconds = 1 weeks;
    } else if (epochDuration == EpochDuration.Biweekly) {
      epochDurationInSeconds = 2 weeks;
    } else if (epochDuration == EpochDuration.Monthly) {
      epochDurationInSeconds = 4 weeks;
    }
    return uint16(timePassedSinceStart / epochDurationInSeconds);
  }

  function addContribution(Contribution memory contribution) public {
    contribution.epochIndex = getEpochIndex();
    contribution.contributor = msg.sender;
    contributions.push(contribution);
    emit ContributionAdded(contribution);
  }

  function getContributionCount() public view returns (uint16) {
    return uint16(contributions.length);
  }

  function getContribution(uint16 index) public view returns (Contribution memory) {
    return contributions[index];
  }

  /**
   * Claims a contributor's reward for contributions made in a given epoch.
   * 
   * @param epochIndex The index of an epoch that has ended.
   */
  function claimReward(uint16 epochIndex) public {
    if (epochIndex >= getEpochIndex()) {
      revert EpochNotYetEnded();
    }
    uint256 epochReward = getEpochReward(epochIndex);
    if (epochReward == 0) {
      revert NoRewardForEpoch();
    }
    rewardToken.transfer(msg.sender, epochReward);
    emit RewardClaimed(epochIndex, msg.sender, epochReward);
  }

  /**
   * Calculates a contributor's token allocation of the budget for a given epoch.
   * 
   * @param epochIndex The index of an epoch.
   */
  function getEpochReward(uint16 epochIndex) public view returns (uint256) {
    uint8 allocationPercentage = getAllocationPercentage(epochIndex);
    return epochBudget * allocationPercentage / 100;
  }

  /**
   * Calculates a contributor's percentage allocation of the budget for a given epoch.
   * 
   * @param epochIndex The index of an epoch.
   */
  function getAllocationPercentage(uint16 epochIndex) public view returns (uint8) {
    uint16 hoursSpentContributor = 0;
    uint16 hoursSpentAllContributors = 0;
    for (uint16 i = 0; i < contributions.length; i++) {
      Contribution memory contribution = contributions[i];
      if (contribution.epochIndex == epochIndex) {
        if (contribution.contributor == msg.sender) {
          hoursSpentContributor += contribution.hoursSpent;
        }
        hoursSpentAllContributors += contribution.hoursSpent;
      }
    }
    return uint8(hoursSpentContributor * 100 / hoursSpentAllContributors);
  }
}
