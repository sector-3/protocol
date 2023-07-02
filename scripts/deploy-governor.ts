import { ethers } from "hardhat";

async function main() {
  console.log('Deploying governance/Sector3Governor.sol')
  
  console.log('process.env.DEPLOYER_PRIVATE_KEY exists:', process.env.DEPLOYER_PRIVATE_KEY != undefined)
  console.log('process.env.ETHERSCAN_API_KEY exists:', process.env.ETHERSCAN_API_KEY != undefined)
  
  const Sector3Governor = await ethers.getContractFactory("Sector3Governor");
  const sector3Governor = await Sector3Governor.deploy('0xe5ec44dd7d49e6edf31878e55dec12eb79bd10ae');

  await sector3Governor.deployed();

  console.log(`Sector3Governor deployed to ${sector3Governor.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
