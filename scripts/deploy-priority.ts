import { ethers } from "hardhat";

async function main() {
  console.log('Deploying protocol/Sector3DAOPriority.sol')
  
  console.log('process.env.DEPLOYER_PRIVATE_KEY exists:', process.env.DEPLOYER_PRIVATE_KEY != undefined)
  console.log('process.env.ETHERSCAN_API_KEY exists:', process.env.ETHERSCAN_API_KEY != undefined)
  
  const Sector3DAOPriority = await ethers.getContractFactory("Sector3DAOPriority");
  const dao = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";  // Sector#3
  const title = "<priority title>";
  const rewardToken = "0x942d6e75465C3c248Eb8775472c853d2b56139fE";  // Sector#3
  const epochDurationInDays = 7;  // Weekly
  const epochBudget = (2.049 * 1e18).toString();  // 2.049 = "2049000000000000000"
  const gatingNFT = ethers.constants.AddressZero;
  const sector3DAOPriority = await Sector3DAOPriority.deploy(dao, title, rewardToken, epochDurationInDays, epochBudget, gatingNFT);

  await sector3DAOPriority.deployed();

  console.log(`Sector3DAOPriority deployed to ${sector3DAOPriority.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
