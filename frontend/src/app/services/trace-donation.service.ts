import { Injectable } from '@angular/core';
import { Contract } from 'ethers';
import { Web3Service } from './web3.service';
import { environment } from '../../environments/environment';
import { TokenData } from '../contracts/interfaces/contracts.interface';
import TraceDonationABI from '../contracts/abis/TraceDonation.abi.json';

@Injectable({
    providedIn: 'root'
})
export class TraceDonationService {
    private contract: Contract | null = null;

    constructor(private web3Service: Web3Service) { }

    /**
     * Inicializa el contrato
     */
    private async getContract(): Promise<Contract> {
        if (this.contract) {
            return this.contract;
        }

        const signer = await this.web3Service.getSigner();
        this.contract = new Contract(
            environment.contracts.traceDonation,
            TraceDonationABI,
            signer
        );
        return this.contract;
    }

    /**
     * Obtiene la dirección del owner del contrato
     */
    async getOwner(): Promise<string> {
        const contract = await this.getContract();
        return await contract.owner();
    }

    /**
     * Verifica si una dirección es una ONG autorizada
     */
    async isONGAutorizada(address: string): Promise<boolean> {
        const contract = await this.getContract();
        return await contract.ongAutorizada(address);
    }

    /**
     * Autoriza una ONG (solo owner)
     */
    async autorizarONG(ongAddress: string): Promise<string> {
        const contract = await this.getContract();
        const tx = await contract.autorizarONG(ongAddress);
        await tx.wait();
        return tx.hash;
    }

    /**
     * Revoca la autorización de una ONG (solo owner)
     */
    async revocarONG(ongAddress: string): Promise<string> {
        const contract = await this.getContract();
        const tx = await contract.revocarONG(ongAddress);
        await tx.wait();
        return tx.hash;
    }

    /**
     * Emite un nuevo token de donación (solo ONG autorizada)
     */
    async emitirToken(
        donantAddress: string,
        descripcion: string,
        location: string,
        expiration: bigint
    ): Promise<{ txHash: string; tokenId?: bigint }> {
        const contract = await this.getContract();
        const tx = await contract.emitirToken(donantAddress, descripcion, location, expiration);
        const receipt = await tx.wait();

        // Buscar el evento de creación del token para obtener el tokenId
        // El evento viene del contrato DonationItem
        let tokenId: bigint | undefined;
        if (receipt.logs && receipt.logs.length > 0) {
            // El tokenId se puede extraer de los logs del evento Transfer
            // Por ahora lo dejamos como opcional
        }

        return {
            txHash: tx.hash,
            tokenId
        };
    }

    /**
     * Obtiene los datos de un token
     */
    async getTokenData(tokenId: bigint): Promise<TokenData> {
        const contract = await this.getContract();
        const [description, locations, expiration] = await contract.getTokenData(tokenId);

        return {
            description,
            locations: locations.map((loc: any) => ({
                location: loc.location,
                timestamp: loc.timestamp,
                used: loc.used
            })),
            expiration
        };
    }

    /**
     * Marca un token como usado y agrega una nueva ubicación (solo ONG autorizada)
     */
    async useToken(
        tokenId: bigint,
        location: string,
        used: boolean
    ): Promise<string> {
        const contract = await this.getContract();
        const tx = await contract.useToken(tokenId, location, used);
        await tx.wait();
        return tx.hash;
    }

    /**
     * Verifica si el usuario actual es el owner
     */
    async isCurrentUserOwner(): Promise<boolean> {
        const walletState = this.web3Service.walletState();
        if (!walletState.address) {
            return false;
        }

        const owner = await this.getOwner();
        return owner.toLowerCase() === walletState.address.toLowerCase();
    }

    /**
     * Verifica si el usuario actual es una ONG autorizada
     */
    async isCurrentUserAuthorizedONG(): Promise<boolean> {
        const walletState = this.web3Service.walletState();
        if (!walletState.address) {
            return false;
        }

        return await this.isONGAutorizada(walletState.address);
    }

    /**
     * Obtiene la lista de tokens (NFTs) del usuario actual
     */
    async getNFTlist(): Promise<bigint[]> {
        const contract = await this.getContract();
        const tokens = await contract.getNFTlist();
        return tokens.map((token: any) => BigInt(token.toString()));
    }
}
