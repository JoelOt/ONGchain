
// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DonationItem is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;

    struct Location  {
        string location;    //traçat de la localització del item, la 1a es la creació
        uint256 timestamp;  //dates de modificació, la 1a es la creació
        bool used; //si s'ha gastat o no el producte/donació
    }

    struct TokenData {
        string description;  //que es? Ex: Paquet Arròs 1 Kg
        Location[] locations;   
        uint256 expiration;  //si es menjar, quan caduca
    }
    mapping(uint256 => TokenData) public tokenData;
    
    constructor(address defaultAdmin, address minter) ERC721("DonationItem", "DITEM") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
    }


    function safeMint(address to, string memory description, uint256 expiration, string memory initialLocation) public onlyRole(MINTER_ROLE) returns (uint256) {  //func per crear un token
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);  //el to es el donant


        TokenData storage td = tokenData[tokenId];
        td.description = description;
        td.expiration = expiration;

        td.locations.push(Location({
            location: initialLocation,
            timestamp: block.timestamp,
            used: false
        }));

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
    function markAsUsed(uint256 tokenId, string memory location, bool used) public onlyRole(MINTER_ROLE) {
        
            tokenData[tokenId].locations.push(Location({
                location: location,
                timestamp: block.timestamp,
                used: used
            }));
    }

    function isUsed(uint256 tokenId) public view returns (bool) {  //auxiliar
        Location memory loc = tokenData[tokenId].locations[tokenData[tokenId].locations.length - 1];
        require(!loc.used, "Fet servir");
    }
    function exists(uint256 tokenId) public view returns (bool){
        try this.ownerOf(tokenId) returns (address) {
            return true;
        } catch {
            return false;
        }
    }

    function isExpired(uint256 tokenId) public view returns (bool) {
        return block.timestamp > tokenData[tokenId].expiration;
    }

    function getTokenData(uint256 tokenId) public view returns (string memory description, Location[] memory locations, uint256 expiration){
    
        TokenData memory data = tokenData[tokenId];
        return (data.description, data.locations, data.expiration);
    }

}
