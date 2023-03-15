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
