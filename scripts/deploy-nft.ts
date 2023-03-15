import { ethers } from "hardhat";

async function main() {
  console.log('Deploying token/S3DOVE.sol')
  
  console.log('process.env.DEPLOYER_PRIVATE_KEY exists:', process.env.DEPLOYER_PRIVATE_KEY != undefined)
  console.log('process.env.ETHERSCAN_API_KEY exists:', process.env.ETHERSCAN_API_KEY != undefined)
  
  const S3DOVE = await ethers.getContractFactory("S3DOVE");
  const s3Dove = await S3DOVE.deploy();

  await s3Dove.deployed();

  console.log(`S3DOVE deployed to ${s3Dove.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
