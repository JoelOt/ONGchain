import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from '../../../services/web3.service';

@Component({
  selector: 'app-wallet-connect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.scss']
})
export class WalletConnectComponent {
  private web3Service = inject(Web3Service);

  walletState = this.web3Service.walletState;
  connecting = signal(false);
  error = signal<string | null>(null);

  formattedAddress = () => {
    const address = this.walletState().address;
    return address ? this.web3Service.formatAddress(address) : '';
  };

  networkName = () => {
    const chainId = this.walletState().chainId;
    if (chainId === 11155111) return 'Sepolia';
    if (chainId === 1) return 'Mainnet';
    return `Chain ${chainId}`;
  };

  isWrongNetwork = () => {
    const chainId = this.walletState().chainId;
    return chainId !== null && chainId !== 11155111; // Sepolia
  };

  async connect() {
    this.connecting.set(true);
    this.error.set(null);

    try {
      if (!this.web3Service.isMetaMaskInstalled()) {
        throw new Error('MetaMask no está instalado. Por favor instala MetaMask para continuar.');
      }

      await this.web3Service.connectWallet();
    } catch (err: any) {
      console.error('Error conectando wallet:', err);
      this.error.set(err.message || 'Error al conectar la wallet');
    } finally {
      this.connecting.set(false);
    }
  }

  disconnect() {
    this.web3Service.disconnectWallet();
    this.error.set(null);
  }
}
