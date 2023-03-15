// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IPriority.sol";
import "./Structs.sol";

contract Sector3DAOPriority is IPriority {
  using SafeERC20 for IERC20;


  struct Rating {
    uint16 contributionIndex;
    address rater;
    uint8 rating;
  }

  address public immutable dao;
  string public title;
  IERC20 public immutable rewardToken;
  uint256 public immutable startTime;
  uint16 public immutable epochDuration;
  uint256 public immutable epochBudget;
  IERC721 public immutable gatingNFT;
  Contribution[] contributions;
  Rating[] ratings;
  mapping(uint16 => mapping(address => bool)) claims;
  uint256 public claimsBalance;
  uint16 public immutable coolingWindowDuration;

  event ContributionAdded(Contribution contribution);
  event RewardClaimed(uint16 epochIndex, address contributor, uint256 amount);
  event ContributionRated(uint16 contributionIndex, address rater, uint8 rating);
  event RatingUpdated(uint16 contributionIndex, address rater, uint8 newRating);

  error EpochNotYetEnded();
  error EpochNotYetFunded();
  error NoRewardForEpoch();
  error RewardAlreadyClaimed();
  error NoGatingNFTOwnership();
  error CoolingWindowNotEnded();

  constructor(address dao_, string memory title_, address rewardToken_, uint16 epochDurationInDays, uint256 epochBudget_, address gatingNFT_, uint16 coolingWindowDurationInDays) {
    dao = dao_;
    title = title_;
    rewardToken = IERC20(rewardToken_);
    startTime = block.timestamp;
    epochDuration = epochDurationInDays;
    epochBudget = epochBudget_;
    gatingNFT = IERC721(gatingNFT_);
    coolingWindowDuration = coolingWindowDurationInDays;
  }

  /**
   * Calculates the current epoch index based on the `Priority`'s start time and epoch duration.
   */
  function getEpochIndex() public view returns (uint16) {
    uint256 timePassedSinceStart = block.timestamp - startTime;
    uint256 epochDurationInSeconds = epochDuration * 1 days;
    return uint16(timePassedSinceStart / epochDurationInSeconds);
  }

  /**
   * @notice Adds a contribution to the current epoch.
   */
  function addContribution(string memory description, string memory proofURL, uint8 hoursSpent, uint8 alignmentPercentage) public {
    if (address(gatingNFT) != address(0x0)) {
      if (gatingNFT.balanceOf(msg.sender) == 0) {
        revert NoGatingNFTOwnership();
      }
    }
    Contribution memory contribution = Contribution({
      timestamp: block.timestamp,
      epochIndex: getEpochIndex(),
      contributor: msg.sender,
      description: description,
      proofURL: proofURL,
      hoursSpent: hoursSpent,
      alignmentPercentage: alignmentPercentage
    });
    contributions.push(contribution);
    emit ContributionAdded(contribution);
  }

  function getContributions() public view returns (Contribution[] memory) {
    return contributions;
  }

  function getEpochContributions(uint16 epochIndex) public view returns (Contribution[] memory) {
    uint16 count = 0;
    for (uint16 i = 0; i < contributions.length; i++) {
      if (contributions[i].epochIndex == epochIndex) {
        count++;
      }
    }
    Contribution[] memory epochContributions = new Contribution[](count);
    count = 0;
    for (uint16 i = 0; i < contributions.length; i++) {
      if (contributions[i].epochIndex == epochIndex) {
        epochContributions[count] = contributions[i];
        count++;
      }
    }
    return epochContributions;
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
    if (block.timestamp < getCoolingWindowEndTime(epochIndex)) {
      revert CoolingWindowNotEnded();
  }
    uint256 epochReward = getEpochReward(epochIndex, msg.sender);
    if (epochReward == 0) {
      revert NoRewardForEpoch();
    }
    bool epochFunded = isEpochFunded(epochIndex);
    if (!epochFunded) {
      revert EpochNotYetFunded();
    }
    bool rewardClaimed = isRewardClaimed(epochIndex, msg.sender);
    if (rewardClaimed) {
      revert RewardAlreadyClaimed();
    }
    rewardToken.transfer(msg.sender, epochReward);
    claims[epochIndex][msg.sender] = true;
    claimsBalance += epochReward;
    emit RewardClaimed(epochIndex, msg.sender, epochReward);
  }

  /**
   * Calculates a contributor's token allocation of the budget for a given epoch.
   * 
   * @param epochIndex The index of an epoch.
   */
  function getEpochReward(uint16 epochIndex, address contributor) public view returns (uint256) {
    uint8 allocationPercentage = getAllocationPercentage(epochIndex, contributor);
    return epochBudget * allocationPercentage / 100;
  }

  /**
   * Checks if a contributor's reward has been claimed for a given epoch.
   */
  function isRewardClaimed(uint16 epochIndex, address contributor) public view returns (bool) {
    return claims[epochIndex][contributor];
  }

  /**
   * Calculates a contributor's percentage allocation of the budget for a given epoch.
   * 
   * @param epochIndex The index of an epoch.
   */
  function getAllocationPercentage(uint16 epochIndex, address contributor) public view returns (uint8) {
    uint16 hoursSpentContributor = 0;
    uint16 hoursSpentAllContributors = 0;
    for (uint16 i = 0; i < contributions.length; i++) {
      Contribution memory contribution = contributions[i];
      if (contribution.epochIndex == epochIndex) {
        if (contribution.contributor == contributor) {
          hoursSpentContributor += contribution.hoursSpent;
        }
        hoursSpentAllContributors += contribution.hoursSpent;
      }
    }
    if (hoursSpentAllContributors == 0) {
      return 0;
    } else {
      return uint8(hoursSpentContributor * 100 / hoursSpentAllContributors);
    }
  }

  /**
   * @notice Checks if the smart contract has received enough funding to cover claims for a past epoch.
   * @dev Epochs without contributions are excluded from funding.
   */
  function isEpochFunded(uint16 epochIndex) public view returns (bool) {
    if (epochIndex >= getEpochIndex()) {
      revert EpochNotYetEnded();
    }
    if (getEpochContributions(epochIndex).length == 0) {
      return false;
    }
    uint16 numberOfEpochsWithContributions = 0;
    for (uint16 i = 0; i <= epochIndex; i++) {
      if (getEpochContributions(i).length > 0) {
        numberOfEpochsWithContributions++;
      }
    }
    if (numberOfEpochsWithContributions == 0) {
      return false;
    } else {
      uint256 totalBudget = epochBudget * numberOfEpochsWithContributions;
      uint256 totalFundingReceived = rewardToken.balanceOf(address(this)) + claimsBalance;
      return totalFundingReceived >= totalBudget;
    }
  }

  function rateContribution(uint16 contributionIndex, uint8 rating) public {
    require(contributionIndex < contributions.length, "Invalid contribution index");
    require(rating >= 1 && rating <= 5, "Invalid rating value");

    uint16 ratingIndex = findRatingIndex(contributionIndex, msg.sender);

    if (ratingIndex < ratings.length) {
      ratings[ratingIndex].rating = rating;
      emit RatingUpdated(contributionIndex, msg.sender, rating);
    } else {
      Rating memory newRating = Rating({
        contributionIndex: contributionIndex,
        rater: msg.sender,
        rating: rating
      });
      ratings.push(newRating);
      emit ContributionRated(contributionIndex, msg.sender, rating);
    }
  }

  function findRatingIndex(uint16 contributionIndex, address rater) internal view returns (uint16) {
    for (uint16 i = 0; i < ratings.length; i++) {
      if (ratings[i].contributionIndex == contributionIndex && ratings[i].rater == rater) {
        return i;
      }
    }
    return uint16(ratings.length);
  }

  function getContributionRating(uint16 contributionIndex) public view returns (uint8) {
    require(contributionIndex < contributions.length, "Invalid contribution index");

    uint16 totalRatings = 0;
    uint16 sumRatings = 0;

    for (uint16 i = 0; i < ratings.length; i++) {
      if (ratings[i].contributionIndex == contributionIndex) {
        totalRatings++;
        sumRatings += ratings[i].rating;
      }
    }

    if (totalRatings == 0) {
      return 0;
    } else {
      return uint8(sumRatings / totalRatings);
    }
  }

  /**
   * @notice Gets the end time of the cooling window for an epoch.
   * @dev This should be implemented based on the requirements of the DAO.
   * @param epochIndex The index of the epoch.
   */
  function getCoolingWindowEndTime(uint16 epochIndex) public view returns (uint256) {
    uint256 epochEndTime = startTime + (epochIndex + 1) * epochDuration * 1 days;
    uint256 localCoolingWindowDuration = 3 * 1 days;
    return epochEndTime + localCoolingWindowDuration;
  }
}
