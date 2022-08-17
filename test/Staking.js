const { expect } = require("chai");
const { ethers } = require("hardhat");
const { helpers } = require("@nomicfoundation/hardhat-network-helpers");

let owner, addr1, addr2;
let myNFT;
let hardhatMyNFT;
let hardhatToken;

beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    myNFT = await ethers.getContractFactory("MyNFT");
    hardhatMyNFT = await myNFT.deploy();

    Token = await ethers.getContractFactory("Staking");
    hardhatToken = await Token.deploy(hardhatMyNFT.address);
});

describe("Staking Contract", function () {
  it("Deployment", async function() {
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1000);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
  });

  it("Transfer", async function () {
    await hardhatToken.transfer(addr1.address, 100);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(900);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);
  });

  it("Stake", async function () {
    await hardhatMyNFT.setApprovalForAll(hardhatToken.address, true)
    //await hardhatToken.connect(addr1).stake();
    await hardhatToken.stake(0);
    expect(await hardhatMyNFT.ownerOf(0)).to.equal(hardhatToken.address);
  });

  it("Unstake", async function () {
    await hardhatMyNFT.setApprovalForAll(hardhatToken.address, true)
    await hardhatToken.stake(0);

    await hardhatToken.unstake(0);
    expect(await hardhatMyNFT.ownerOf(0)).to.equal(owner.address);
  });

  it("Claim", async function () {
    await hardhatMyNFT.setApprovalForAll(hardhatToken.address, true)
    await hardhatToken.stake(0);

    const sevenDays = 7 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [sevenDays]);
    await ethers.provider.send('evm_mine');

    await hardhatToken.claim(0);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1070);
  });
});
