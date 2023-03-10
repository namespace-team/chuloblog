---
layout: pages
title: Deploying smart contract in testnet
date: 2022-08-10
author: rabinshrestha3
tag: Blockchain
fullname: Rabin Shrestha
---

Testnet is an instance of a blockchain underlying the same or newer version of the actual network. As it's name suggests, testnet is used for deploying and testing smart contracts before deploying them to actual network. For example: Goerli testnet can be used as testnet before deploying to the ethereum network. The entire purpose of testnet is to create a free testing environment for developers.

We will require few ether for deploying any smart contract. For that, we can go to the respective faucet to get some test ether. In our case, we will visit the [goerli faucet](https://goerlifaucet.com/) and get some ether.

In our `hardhat.config.js`, we can add the following code. Do not forget to add `GOERLI_ALCHEMY_KEY` and `GOERLI_ACCOUNT_PRIVATE_KEY` to the `.env` file.

```
goerli: {
  url: `https://eth-goerli.g.alchemy.com/v2/${process.env.GOERLI_ALCHEMY_KEY}`,
  gas: 2100000,
  gasPrice: 8000000000,
  accounts: [process.env.GOERLI_ACCOUNT_PRIVATE_KEY]
},
```

We will need to write a migration as below. Replace `Contract` with your actual contract name.

```
// 1_deploy_contract.js
async function main() {
  const ContractFactory = await ethers.getContractFactory('Contract');
  const Contract = await ContractFactory.deploy('Contract', 'Collectible', marketplaceAddress);
  await Contract.deployed();

  console.log(`Collectible contract address: ${Contract.address}`)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err);
  });
```

Run the script in console by writing `npx hardhat run ./scripts/1_deploy_contract.js --network goerli`.
The deployed contract address should appear in the console itself.


        