//contracts/Token.sol
//SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20("My Token", "MTK"), Ownable {
    mapping(address => bool) adminAddresses;

    constructor() {
        _mint(msg.sender, 1000);
        adminAddresses[msg.sender] = true;
    }

    modifier onlyAdmins {
        require(adminAddresses[msg.sender] == true, "Oopes something went wrong");
        _;
    }

    function mintToken(address adminAddress, uint256 amount) external onlyAdmins {
        _mint(msg.sender, amount);
    }

    function setAdminAddresses(address adminAddress, bool state) external onlyOwner {
        adminAddresses[adminAddress] = state;
    }
}
