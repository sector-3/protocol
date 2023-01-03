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

Deploy the smart contract to the local network:

```shell
npx hardhat run --network localhost scripts/deploy.ts
```
