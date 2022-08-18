const { expect } = require("chai");
const { ethers } = require("hardhat");
const { helpers } = require("@nomicfoundation/hardhat-network-helpers");

let owner, addr1, addr2;
let myNFT;
let hardhatMyNFT;
let hardhatToken;

beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    myNFT = await ethers.getContractFactory("NFT");
    hardhatMyNFT = await myNFT.deploy();

    myToken = await ethers.getContractFactory("Token");
    hardhatToken = await myToken.deploy();

    myStaking = await ethers.getContractFactory("Staking");
    hardhatStaking = await myStaking.deploy(hardhatMyNFT.address, hardhatToken.address);
});

describe("Staking Contract", function () {
  it("Deployment", async function() {
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1000);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
  });

  it("Stake", async function () {
    await hardhatMyNFT.setApprovalForAll(hardhatStaking.address, true)

    await hardhatStaking.stake(0);
    expect(await hardhatMyNFT.ownerOf(0)).to.equal(hardhatStaking.address);
  });

  it("Unstake", async function () {
    await hardhatMyNFT.setApprovalForAll(hardhatStaking.address, true)
    await hardhatStaking.stake(0);

    await hardhatStaking.unstake(0);
    expect(await hardhatMyNFT.ownerOf(0)).to.equal(owner.address);
  });

  it("Claim", async function () {
    await hardhatMyNFT.setApprovalForAll(hardhatStaking.address, true)
    await hardhatStaking.stake(0);

    const sevenDays = 7 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [sevenDays]);
    await ethers.provider.send('evm_mine');

    await hardhatToken.setAdminAddresses(hardhatStaking.address, true);
    await hardhatStaking.claim(0);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1070);
  });
});
