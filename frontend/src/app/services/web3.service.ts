import { Injectable, signal } from '@angular/core';
import { BrowserProvider, Contract, Eip1193Provider } from 'ethers';
import { environment } from '../../environments/environment';
import { WalletState } from '../contracts/interfaces/contracts.interface';

declare global {
    interface Window {
        ethereum?: Eip1193Provider & {
            isMetaMask?: boolean;
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on: (event: string, callback: (...args: any[]) => void) => void;
            removeListener: (event: string, callback: (...args: any[]) => void) => void;
        };
    }
}

@Injectable({
    providedIn: 'root'
})
export class Web3Service {
    private provider: BrowserProvider | null = null;

    walletState = signal<WalletState>({
        address: null,
        chainId: null,
        connected: false,
        isOwner: false,
        isAuthorizedONG: false
    });

    constructor() {
        this.initializeListeners();
    }

    /**
     * Verifica si MetaMask está instalado
     */
    isMetaMaskInstalled(): boolean {
        return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask === true;
    }

    /**
     * Conecta la wallet del usuario
     */
    async connectWallet(): Promise<void> {
        if (!this.isMetaMaskInstalled()) {
            throw new Error('MetaMask no está instalado. Por favor instala MetaMask para continuar.');
        }

        try {
            const accounts = await window.ethereum!.request({
                method: 'eth_requestAccounts'
            });

            this.provider = new BrowserProvider(window.ethereum!);
            const network = await this.provider.getNetwork();

            // Verificar que estamos en la red correcta
            if (Number(network.chainId) !== environment.network.chainId) {
                await this.switchNetwork();
            }

            await this.updateWalletState(accounts[0]);
        } catch (error: any) {
            console.error('Error conectando wallet:', error);
            throw new Error(error.message || 'Error al conectar la wallet');
        }
    }

    /**
     * Desconecta la wallet
     */
    disconnectWallet(): void {
        this.provider = null;
        this.walletState.set({
            address: null,
            chainId: null,
            connected: false,
            isOwner: false,
            isAuthorizedONG: false
        });
    }

    /**
     * Obtiene el provider actual
     */
    getProvider(): BrowserProvider | null {
        return this.provider;
    }

    async getSigner() {
        if (!this.provider) {
            throw new Error('Wallet no conectada');
        }
        return await this.provider.getSigner();
    }

    /**
     * Cambia a la red configurada
     */
    private async switchNetwork(): Promise<void> {
        try {
            await window.ethereum!.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${environment.network.chainId.toString(16)}` }],
            });
        } catch (error: any) {
            if (error.code === 4902) {
                await this.addNetwork();
            } else {
                throw error;
            }
        }
    }

    private async addNetwork(): Promise<void> {
        await window.ethereum!.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: `0x${environment.network.chainId.toString(16)}`,
                chainName: environment.network.name,
                rpcUrls: [environment.network.rpcUrl],
                blockExplorerUrls: [environment.network.blockExplorer]
            }],
        });
    }

    private async updateWalletState(address: string): Promise<void> {
        if (!this.provider) return;

        const network = await this.provider.getNetwork();

        this.walletState.set({
            address: address,
            chainId: Number(network.chainId),
            connected: true,
            isOwner: false,
            isAuthorizedONG: false
        });
    }


    private initializeListeners(): void {
        if (!window.ethereum) return;

        window.ethereum.on('accountsChanged', async (accounts: string[]) => {
            if (accounts.length === 0) {
                this.disconnectWallet();
            } else {
                await this.updateWalletState(accounts[0]);
            }
        });

        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    }

    /**
     * Solo para mostrarla 
     */
    formatAddress(address: string): string {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    async getBalance(address: string): Promise<string> {
        if (!this.provider) {
            throw new Error('Wallet no conectada');
        }
        const balance = await this.provider.getBalance(address);
        return balance.toString();
    }
}
