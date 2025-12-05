import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TraceDonationService } from '../../../services/trace-donation.service';

@Component({
  selector: 'app-ong-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ong-management.component.html',
  styleUrls: ['./ong-management.component.scss']
})
export class OngManagementComponent {
  newOngAddress = '';
  revokeAddress = '';
  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);
  addressError = signal<string | null>(null);

  constructor(private traceDonationService: TraceDonationService) { }

  /**
   * Nota: No verificamos permisos en el frontend.
   * El smart contract validará que msg.sender sea el owner cuando se ejecuten
   * las transacciones autorizarONG() o revocarONG().
   */

  validateAddress(address: string): boolean {
    if (!address) {
      this.addressError.set('La dirección es requerida');
      return false;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      this.addressError.set('Dirección Ethereum inválida');
      return false;
    }
    this.addressError.set(null);
    return true;
  }

  async authorizeONG() {
    if (!this.validateAddress(this.newOngAddress)) {
      return;
    }

    this.loading.set(true);
    this.success.set(null);
    this.error.set(null);

    try {
      const txHash = await this.traceDonationService.autorizarONG(this.newOngAddress);
      this.success.set(`ONG autorizada exitosamente. TX: ${txHash.substring(0, 10)}...`);
      this.newOngAddress = '';
    } catch (err: any) {
      console.error('Error autorizando ONG:', err);
      this.error.set(err.message || 'Error al autorizar la ONG');
    } finally {
      this.loading.set(false);
    }
  }

  async revokeONG() {
    if (!this.validateAddress(this.revokeAddress)) {
      return;
    }

    if (!confirm('¿Estás seguro de que deseas revocar la autorización de esta ONG?')) {
      return;
    }

    this.loading.set(true);
    this.success.set(null);
    this.error.set(null);

    try {
      const txHash = await this.traceDonationService.revocarONG(this.revokeAddress);
      this.success.set(`Autorización revocada exitosamente. TX: ${txHash.substring(0, 10)}...`);
      this.revokeAddress = '';
    } catch (err: any) {
      console.error('Error revocando ONG:', err);
      this.error.set(err.message || 'Error al revocar la autorización');
    } finally {
      this.loading.set(false);
    }
  }
}
