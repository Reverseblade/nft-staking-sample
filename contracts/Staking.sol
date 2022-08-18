// contract Staking.sol
//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IToken is IERC20 {
    function mintToken (address adminAddress, uint256 amount) external;
}

contract Staking is ERC721Holder, Ownable  {
    IERC721 public nft;
    IToken private token;

    mapping(uint256 => address) public NFTOwnerOf;
    mapping(uint256 => uint256) public NFTStakedAt;
    address public tokenContractAddress;
    uint256 private tokenRate = 10;

    constructor(address _nft, address _token) {
        nft = IERC721(_nft);
        token = IToken(_token);
    }

    function stake(uint256 tokenId) external {
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        NFTOwnerOf[tokenId] = msg.sender;
        NFTStakedAt[tokenId] = block.timestamp;
    }

    function unstake(uint256 tokenId) external {
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        delete NFTOwnerOf[tokenId];
        delete NFTStakedAt[tokenId];
    }

    function claim(uint256 tokenId) external {
        require(NFTOwnerOf[tokenId] == msg.sender, "Not the NFT owner, you are NGMI");
        uint256 claimableAmount = _determineYield(tokenId);
        token.mintToken(address(this), claimableAmount);
        token.transfer(msg.sender, claimableAmount);
    }

    function _determineYield(uint256 tokenId) private returns(uint256 claimableAmount) {
        return tokenRate * (block.timestamp - NFTStakedAt[tokenId]) / 1 days;
    }
}
