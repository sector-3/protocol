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

```shell
npx hardhat coverage
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
