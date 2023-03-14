import { ethers } from "hardhat";

async function main() {
  console.log('Deploying token/Sector3Dove.sol')
  
  console.log('process.env.DEPLOYER_PRIVATE_KEY exists:', process.env.DEPLOYER_PRIVATE_KEY != undefined)
  console.log('process.env.ETHERSCAN_API_KEY exists:', process.env.ETHERSCAN_API_KEY != undefined)
  
  const Sector3Dove = await ethers.getContractFactory("Sector3Dove");
  const sector3Dove = await Sector3Dove.deploy();

  await sector3Dove.deployed();

  console.log(`Sector3Dove deployed to ${sector3Dove.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
