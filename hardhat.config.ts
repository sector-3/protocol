require('dotenv').config()
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: "https://rpc.ankr.com/eth_sepolia",
      accounts: [ String(process.env.DEPLOYER_PRIVATE_KEY) ]
    },
    optimisticEthereum: {
      url: "https://rpc.ankr.com/optimism",
      accounts: [ String(process.env.DEPLOYER_PRIVATE_KEY) ]
    },
    mainnet: {
      url: "https://rpc.ankr.com/eth",
      accounts: [ String(process.env.DEPLOYER_PRIVATE_KEY) ]
    }
  },
  etherscan: {
    apiKey: {
      sepolia: String(process.env.ETHERSCAN_API_KEY),
      optimisticEthereum: String(process.env.ETHERSCAN_API_KEY),
      mainnet: String(process.env.ETHERSCAN_API_KEY)
    }
  }
};

export default config;
