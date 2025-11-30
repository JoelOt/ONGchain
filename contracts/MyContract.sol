// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./token/DonationItem.sol";

contract MyContract {
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

    modifier soloONG() {
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

    // -------------------------
    // Emisión de tokens
    // -------------------------
    function emitirToken(
        address beneficiario,
        string memory descripcion,
        uint256 expiration
    )
        public
        soloONG
        returns (uint256)
    {
        return token.safeMint(
            beneficiario,
            descripcion,
            expiration
        );
    }

    // -------------------------
    // Usar token
    // -------------------------
    function usarToken(uint256 tokenId) public soloONG {
        (string memory descripcion, uint256 expiration, bool usado) = token.tokenData(tokenId);

        require(!usado, "Token ya usado");

        if (expiration != 0) {
            require(block.timestamp <= expiration, "Token caducado");
        }

        token.markAsUsed(tokenId);
    }
}
