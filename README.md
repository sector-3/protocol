# Sector#3 Protocol

## Build

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

Deploy a smart contract to the Goerli test network:

```shell
npx hardhat run --network goerli scripts/deploy-<contract>.ts
```

Verify a contract on Etherscan:

```shell
npx hardhat verify --network <network> <contract address>
```
