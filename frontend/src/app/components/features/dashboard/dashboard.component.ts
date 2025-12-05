import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Web3Service } from '../../../services/web3.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private web3Service = inject(Web3Service);

  walletState = this.web3Service.walletState;

  /**
   * Nota: No verificamos roles en el frontend.
   * El smart contract validará los permisos cuando se intenten ejecutar transacciones.
   * Esto es más seguro y simplifica el código.
   */

  networkName(): string {
    const chainId = this.walletState().chainId;
    if (chainId === 11155111) return 'Sepolia Testnet';
    if (chainId === 1) return 'Ethereum Mainnet';
    return `Chain ${chainId}`;
  }

  formattedAddress(): string {
    const address = this.walletState().address;
    return address ? this.web3Service.formatAddress(address) : '';
  }
}
