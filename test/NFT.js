const { expect } = require("chai");
const { ethers } = require("hardhat");

let owner, addr1, addr2;
let myNFT;
let hardhatMyNFT;

beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    myNFT = await ethers.getContractFactory("NFT");
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
