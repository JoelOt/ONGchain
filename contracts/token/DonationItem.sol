
// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract DonationItem is ERC721, ERC721Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;
    struct TokenData {
        string description;  //que es? Ex: Paquet Arròs 1 Kg
        uint256 expiration;  //si es menjar, quan caduca
        bool used;  //si s'ha gastat o no el producte/donació
    }
    mapping(uint256 => TokenData) public tokenData;
    
    constructor(address defaultAdmin, address minter) ERC721("DonationItem", "DITEM") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
    }


    function safeMint(address to, string memory description, uint256 expiration) public onlyRole(MINTER_ROLE) returns (uint256) {  //func per crear un token
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        
        tokenData[tokenId] = TokenData({
        description: description,
        expiration: expiration,
        used: false
        });

        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    //custom
    function markAsUsed(uint256 tokenId) public onlyRole(MINTER_ROLE) {
        require(tokenExists(tokenId), "Token no existe");
        require(!tokenData[tokenId].used, "Ya usado");
        tokenData[tokenId].used = true;
    }

    function tokenExists(uint256 tokenId) internal view returns (bool) {  //auxiliar
        try this.ownerOf(tokenId) returns (address) {
            return true;
        } catch {
            return false;
        }
    }


    function isExpired(uint256 tokenId) public view returns (bool) {
        return block.timestamp > tokenData[tokenId].expiration;
}
}
