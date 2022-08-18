const { expect } = require("chai");
const { ethers } = require("hardhat");

let owner, addr1, addr2;
let myNFT;
let hardhatMyNFT;

beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    myToken = await ethers.getContractFactory("Token");
    hardhatToken = await myToken.deploy();
});

describe("Token Contract", function () {
  it("Deployment", async function() {
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1000);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
  });

  it("Mint", async function() {
    await hardhatToken.mintToken(owner.address, 100);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1100);
  });

  it("Transfer", async function() {
    await hardhatToken.transfer(addr1.address, 100);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(900);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);
  });
});
