// contract Staking.sol
//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Staking is ERC20, ERC721Holder, Ownable  {
    IERC721 public nft;

    mapping(uint256 => address) public tokenOwnerOf;
    mapping(uint256 => uint256) public tokenStakedAt;
    uint256 private tokenRate = 10;

    constructor(address _nft) ERC20("MyToken", "MTK") {
        nft = IERC721(_nft);
        _mint(msg.sender, 1000);
    }

    function stake(uint256 tokenId) external {
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        tokenOwnerOf[tokenId] = msg.sender;
        tokenStakedAt[tokenId] = block.timestamp;
    }

    function unstake(uint256 tokenId) external {
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        delete tokenOwnerOf[tokenId];
        delete tokenStakedAt[tokenId];
    }

    function claim(uint256 tokenId) external {
        require(tokenOwnerOf[tokenId] == msg.sender, "Not a token owner");
        uint256 claimableAmount = _determineYield(tokenId);
        console.log(claimableAmount);
        _mint(msg.sender, claimableAmount);
    }

    function _determineYield(uint256 tokenId) private returns(uint256 claimableAmount) {
        return tokenRate * (block.timestamp - tokenStakedAt[tokenId]) / 1 days;
    }
}
