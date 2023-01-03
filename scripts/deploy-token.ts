import { ethers } from "hardhat";

async function main() {
  console.log('Deploying token/SECTOR3.sol')
  
  console.log('process.env.DEPLOYER_PRIVATE_KEY exists:', process.env.DEPLOYER_PRIVATE_KEY != undefined)
  console.log('process.env.ETHERSCAN_API_KEY exists:', process.env.ETHERSCAN_API_KEY != undefined)
  
  const SECTOR3 = await ethers.getContractFactory("SECTOR3");
  const sector3 = await SECTOR3.deploy();

  await sector3.deployed();

  console.log(`SECTOR3 deployed to ${sector3.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
