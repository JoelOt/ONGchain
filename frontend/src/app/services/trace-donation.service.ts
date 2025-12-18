import { Injectable } from '@angular/core';
import { Contract } from 'ethers';
import { Web3Service } from './web3.service';
import { environment } from '../../environments/environment';
import { TokenData } from '../contracts/interfaces/contracts.interface';
import { bigIntArrayFromContract } from '../utils/bigint.utils';
import TraceDonationABI from '../contracts/abis/TraceDonation.abi.json';

@Injectable({
    providedIn: 'root'
})
export class TraceDonationService {
    private contract: Contract | null = null;

    constructor(private web3Service: Web3Service) { }

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

    async autorizarONG(ongAddress: string): Promise<string> {
        const contract = await this.getContract();
        const tx = await contract.autorizarONG(ongAddress);
        await tx.wait();
        return tx.hash;
    }

    async revocarONG(ongAddress: string): Promise<string> {
        const contract = await this.getContract();
        const tx = await contract.revocarONG(ongAddress);
        await tx.wait();
        return tx.hash;
    }

    async emitirToken(
        donantAddress: string,
        descripcion: string,
        location: string,
        expiration: bigint
    ): Promise<string> {
        const contract = await this.getContract();
        const tx = await contract.emitirToken(donantAddress, descripcion, location, expiration);
        await tx.wait();
        return tx.hash;
    }

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

    async getNFTlist(): Promise<bigint[]> {
        const contract = await this.getContract();
        const tokens = await contract.getNFTlist();
        return bigIntArrayFromContract(tokens);
    }
}
