// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./token/DonationItem.sol";

contract TraceDonation {
    DonationItem public token;
    address public owner;

    mapping(address => bool) public ongAutorizada;

    constructor(address tokenAddress) {
        token = DonationItem(tokenAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "No autorizado");
        _;
    }

    modifier soloONG() { //rol perque sols pugui crear NFTs les ONG
        require(ongAutorizada[msg.sender], "ONG no autorizada");
        _;
    }

    // -------------------------
    // Gestión de ONGs
    // -------------------------
    function autorizarONG(address ong) public onlyOwner {
        ongAutorizada[ong] = true;
    }

    function revocarONG(address ong) public onlyOwner {
        ongAutorizada[ong] = false;
    }


    function emitirToken(address donant, string memory descripcion, string memory location, uint256 expiration) public soloONG returns (uint256) {  //crea un NFT assignat al donant
        return token.safeMint(donant, descripcion, expiration, location);
    }

    // -------------------------
    // Usar token
    // -------------------------

    function getTokenData(uint256 tokenId) public view returns (string memory, DonationItem.Location[] memory, uint256){
        return token.getTokenData(tokenId);
    }

    function useToken(uint256 tokenId, string memory location, bool used) public soloONG {
        require(token.exists(tokenId), "No existeix");
        require(!token.isUsed(tokenId), "Fet servir");
        require(!token.isExpired(tokenId), "Expirat");
        
        token.markAsUsed(tokenId, location, used);
    }

}


/* 
1- ONG crea NFT i li envia al Client (location inicial, timestamp, not used)
2- ONG marca els moviments que es realitzen al producte afegint una location + timestamp com a "Not used". (usarToken(tokenId, false, location))
3- Client pot veure el estat del producte fent getTokenData(tokenId)
4- ONG al entregar finalment marca used amb usarToken(tokenId, true, location)

*/
