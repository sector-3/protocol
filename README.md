# Sector#3 Protocol

## Build

Set environment variables:

```shell
cp .env.sample .env
```

Install dependencies, and compile source code:

```shell
npm install
npx hardhat clean
npx hardhat compile
```

## Test

```shell
export REPORT_GAS=true
npx hardhat test
```

## Coverage

[![codecov](https://codecov.io/gh/sector-3/protocol/branch/main/graph/badge.svg)](https://codecov.io/gh/sector-3/protocol)

```shell
npx hardhat coverage
open coverage/index.html
```

Check if coverage threshold has been met:

```
npx istanbul check-coverage --lines 90
```

## Deploy

Start a local node:

```shell
npx hardhat node
```

Deploy a smart contract to the local network:

```shell
npx hardhat run --network localhost scripts/deploy-<contract>.ts
```

Deploy a smart contract to the Sepolia test network:

```shell
npx hardhat run --network sepolia scripts/deploy-<contract>.ts
```

Verify a contract on Etherscan:

```shell
npx hardhat verify --network <network> <contract address> <constructor parameters>
```

## Deployments

### Governance

- Optimism: https://optimistic.etherscan.io/address/0x8087dE46076212A21EA5cD8b4368BCbd826d7B32
- Mainnet: https://etherscan.io/address/0x1c9a7ced4cadb9c5a65e564e73091912aaec7494

### Protocol V1

- Testnet: https://sepolia.etherscan.io/address/0x293aEF46130ca53868b27E3716D1DB653918d137
- Optimism: https://optimistic.etherscan.io/address/0x942d6e75465C3c248Eb8775472c853d2b56139fE
- Mainnet: https://etherscan.io/address/0x7d480f3a2B5F8f45CbAbe8c0833924549dd1eB12

### Token

- Optimism: https://optimistic.etherscan.io/token/0xe5ec44dd7d49e6edf31878e55dec12eb79bd10ae
- Mainnet: https://etherscan.io/token/0x610210aa5d51bf26cbce146a5992d2feebc27db1
