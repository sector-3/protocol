import { ethers } from "hardhat";

async function main() {
  console.log('Deploying protocol/Sector3DAOPriority.sol')
  
  console.log('process.env.DEPLOYER_PRIVATE_KEY exists:', process.env.DEPLOYER_PRIVATE_KEY != undefined)
  console.log('process.env.ETHERSCAN_API_KEY exists:', process.env.ETHERSCAN_API_KEY != undefined)
  
  const Sector3DAOPriority = await ethers.getContractFactory("Sector3DAOPriority");
  const dao = "0x96Bf89193E2A07720e42bA3AD736128a45537e63";  // Sector#3
  const title = "<priority title>";
  const rewardToken = "0x942d6e75465C3c248Eb8775472c853d2b56139fE";  // Sector#3
  const epochDurationInDays = 7;  // Weekly
  const epochBudget = (2.049 * 1e18).toString();  // 2.049 = "2049000000000000000"
  const sector3DAOPriority = await Sector3DAOPriority.deploy(dao, title, rewardToken, epochDurationInDays, epochBudget);

  await sector3DAOPriority.deployed();

  console.log(`Sector3DAOPriority deployed to ${sector3DAOPriority.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
