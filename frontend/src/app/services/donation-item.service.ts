import { Injectable } from '@angular/core';
import { Contract } from 'ethers';
import { Web3Service } from './web3.service';
import { environment } from '../../environments/environment';
import DonationItemABI from '../contracts/abis/DonationItem.abi.json';

@Injectable({
    providedIn: 'root'
})
export class DonationItemService {
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
            environment.contracts.donationItem,
            DonationItemABI,
            signer
        );
        return this.contract;
    }

    /**
     * Obtiene el owner de un token específico
     */
    async ownerOf(tokenId: bigint): Promise<string> {
        const contract = await this.getContract();
        return await contract.ownerOf(tokenId);
    }

    /**
     * Verifica si un token existe
     */
    async exists(tokenId: bigint): Promise<boolean> {
        const contract = await this.getContract();
        return await contract.exists(tokenId);
    }

    /**
     * Verifica si un token está usado
     */
    async isUsed(tokenId: bigint): Promise<boolean> {
        const contract = await this.getContract();
        try {
            await contract.isUsed(tokenId);
            return false; // Si no lanza error, no está usado
        } catch {
            return true; // Si lanza error "Fet servir", está usado
        }
    }

    /**
     * Verifica si un token está expirado
     */
    async isExpired(tokenId: bigint): Promise<boolean> {
        const contract = await this.getContract();
        return await contract.isExpired(tokenId);
    }

    /**
     * Obtiene todos los tokens de un owner
     * Nota: Esta es una función auxiliar que requiere iterar
     */
    async getTokensOfOwner(ownerAddress: string): Promise<bigint[]> {
        // En un contrato ERC721 estándar, necesitaríamos un método balanceOf
        // y tokenOfOwnerByIndex, o usar eventos Transfer
        // Por ahora retornamos un array vacío y se puede implementar
        // escuchando eventos o agregando funciones al contrato
        return [];
    }
}
