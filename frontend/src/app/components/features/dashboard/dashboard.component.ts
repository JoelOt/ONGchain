import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Web3Service } from '../../../services/web3.service';
import { TraceDonationService } from '../../../services/trace-donation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private web3Service = inject(Web3Service);
  private traceDonationService = inject(TraceDonationService);

  walletState = this.web3Service.walletState;
  isOwner = signal(false);
  isAuthorizedONG = signal(false);

  async ngOnInit() {
    if (this.walletState().connected) {
      await this.checkUserRole();
    }
  }

  async checkUserRole() {
    try {
      const [owner, authorized] = await Promise.all([
        this.traceDonationService.isCurrentUserOwner(),
        this.traceDonationService.isCurrentUserAuthorizedONG()
      ]);
      this.isOwner.set(owner);
      this.isAuthorizedONG.set(authorized);
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  }

  userRole(): string {
    if (this.isOwner()) return '👑 Owner';
    if (this.isAuthorizedONG()) return '🏢 ONG Autorizada';
    return '👤 Usuario';
  }

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
