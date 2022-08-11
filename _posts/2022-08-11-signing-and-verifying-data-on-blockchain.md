---
layout: pages
title: Signing and verifying data on blockchain
date: 2022-08-11
author: rabinshrestha3
tag: Blockchain
fullname: Rabin Shrestha
---

A digital signature is a mathematical algorithm routinely used to validate the authenticity and integrity of a message. Digital signature includes the concept of public and private keys.

Generally, a message hash is signed by an address, then the signed message is transacted on behalf of the user by someone else. The real use case of digital signature in blockchain is to verify if the transaction was authroized by the user or not.

In blockchain, we use [ECDSA](https://www.encryptionconsulting.com/education-center/what-is-ecdsa/) algorithm to sign a message (data in our case).

A set of data is prepared in the frontend. The data is then converted to hash using [web3-utils](https://www.npmjs.com/package/web3-utils) like below. We pass all the values to hash in the `soliditySha3` method. 

```
const { soliditySha3 } = require("web3-utils");
let hashedMessage = web3.utils.soliditySha3(
	4,
	7,
	1
)
```

We will then receive some hash like `0x597f5f99524e9dfde89054758e759ecaea48dffb5d1d2e944e7ddedc03edd085`. The signer is supposed to sign the hash that we receive. 

In case, we need to pass string, we will have to convert the string to bytes like `web3.utils.soliditySha3(str).substring(0, 10)`. We prefer to use bytes in solidity rather than string due to some drawbacks like we can not compare two strings to each other. The full code should look like:

```
const { soliditySha3 } = require("web3-utils");
let hashedMessage = web3.utils.soliditySha3(
	4,
	7,
	web3.utils.soliditySha3("Hello")
)
```

We ask the user for signature using metamask with the use of `web3.eth.personal.sign(hashedMessage, signer_address);` method. This will complete the signature process in the frontend which will give us the `signedMessage`.

Now, we will be looking at how to verify the signature.

Firstly, we will pass the `hashedMessage` and `signedMessage` in a method in solidity. There is a library [ECDSAUpgradeable](https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/utils/cryptography/ECDSAUpgradeable.sol) by openzeppelin which has a `recoverSigner` method. This method will return the signer address when we pass `hashedMessage` and `signedMessage` in it. Example: `ECDSAUpgradeable.recover(hashedMessage, signedMessage)`. We can finally compare the original signer address and the returned signer from `recover` method. If both the addresses match, the signer has signed the message and vice versa.

For futher security, we can pass the original message to solidity and hash it there. In solidity, we can hash the message like
```
bytes32 hashedMessage = keccak256(abi.encodePacked(param1, param2, param3))
bytes32 ethHashedMessage = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashedMessage))
```

The second part of eth hashing is done automatically by `soliditySha3` in the frontend. Then, continue using `ECDSAUpgradeable.recover` and the comparision logic.

        