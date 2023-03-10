import { ethers } from "hardhat";

async function main() {
  console.log('Deploying protocol/Sector3DAOFactory.sol')
  
  console.log('process.env.DEPLOYER_PRIVATE_KEY exists:', process.env.DEPLOYER_PRIVATE_KEY != undefined)
  console.log('process.env.ETHERSCAN_API_KEY exists:', process.env.ETHERSCAN_API_KEY != undefined)
  
  const Sector3DAOFactory = await ethers.getContractFactory("Sector3DAOFactory");
  const sector3DAOFactory = await Sector3DAOFactory.deploy();

  await sector3DAOFactory.deployed();

  console.log(`Sector3DAOFactory deployed to ${sector3DAOFactory.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
