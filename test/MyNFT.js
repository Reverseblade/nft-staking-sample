const { expect } = require("chai");
const { ethers } = require("hardhat");

let owner, addr1, addr2;
let myNFT;
let hardhatMyNFT;

beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    myNFT = await ethers.getContractFactory("MyNFT");
    hardhatMyNFT = await myNFT.deploy();
});

describe("NFT Contract", function () {
  it("Deployment", async function() {
    expect(await hardhatMyNFT.ownerOf(0)).to.equal(owner.address);
  });

  it("Mint", async function() {
    const newNFT = await hardhatMyNFT.connect(addr1).mintNFT();
    expect(await hardhatMyNFT.ownerOf(1)).to.equal(addr1.address);
  });
});

describe("Staking Contract", function () {
  it("Deployment", async function() {
    Token = await ethers.getContractFactory("Staking");
    hardhatToken = await Token.deploy(hardhatMyNFT.address);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1000);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
  });

  it("Transfer", async function () {
    Token = await ethers.getContractFactory("Staking");
    hardhatToken = await Token.deploy(hardhatMyNFT.address);
    await hardhatToken.transfer(addr1.address, 100);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(900);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);
  });

  it("Stake", async function () {
    Token = await ethers.getContractFactory("Staking");
    hardhatToken = await Token.deploy(hardhatMyNFT.address);
    expect(await hardhatMyNFT.ownerOf(0)).to.equal(owner.address);
    await hardhatMyNFT.setApprovalForAll(hardhatToken.address, true)
    //await hardhatToken.connect(addr1).stake();
    await hardhatToken.stake(0);
    expect(await hardhatMyNFT.ownerOf(0)).to.equal(hardhatToken.address);
    console.log(await hardhatToken.tokenOwnerOf(0));
  });
});
