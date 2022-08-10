---
layout: pages
title: Building a simple NFT minting project
date: 2022-08-10
author: parashagrawal1
tag: Blockchain
fullname: Parash Agrawal
---

NFTs (Non-fungible Tokens) are crypto assets which are unique to each other. Digital assets, art and collectibles are it's major components. NFT standard is defined as [ERC721](https://eips.ethereum.org/EIPS/eip-721) in ethereum network.

No two NFTs are the same unlike 2 coins of the same crypto currency. Example: 2 bitcoins have the same value and inter changeable with each other. But two NFTs (e.g: [cryptokitties](https://www.cryptokitties.co/)) are not the same and do not have equal value.

Openzeppelin is a community standard for securing blockchain applications. It provides blueprint for developing decentralized applications as mentioned in the ERC standards. So, we will be importing the required openzeppelin files directly from [github](https://github.com/OpenZeppelin/openzeppelin-contracts).

We will need to import [ERC721URIStorage](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol). We will store a JSON content IPFS URL as the tokenURI associated with token IDs. Other ERC721 methods are imported inside the ERC721URIStorage file.

At First, we go to [remix IDE](https://remix.ethereum.org/) which is an online web IDE for ethereum development. Then, we can create a new file inside the `contracts` folder. The filename extension must be `.sol`.

We import required the openzeppelin standards in the newly created file
```
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
```

Then, we write down a simple contract structure extending the ERC721URIStorage
```
```

Below is the code to implement a simple NFT minting project.
```
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFTProject is ERC721URIStorage {
    uint private tokenIds = 1;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) { }

    function mintToken(string memory tokenURI)
    external
    {
        tokenIds++;
        uint256 newItemId = tokenIds - 1;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
    }
}
```
        