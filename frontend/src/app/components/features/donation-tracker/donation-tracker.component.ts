import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TraceDonationService } from '../../../services/trace-donation.service';
import { TokenData } from '../../../contracts/interfaces/contracts.interface';

@Component({
  selector: 'app-donation-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation-tracker.component.html',
  styleUrls: ['./donation-tracker.component.scss']
})
export class DonationTrackerComponent {
  tokenId: number = 0;
  tokenData = signal<TokenData | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private traceDonationService: TraceDonationService) { }

  async searchToken() {
    if (this.tokenId === null || this.tokenId === undefined) {
      this.error.set('Por favor ingresa un ID de token válido');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.tokenData.set(null);

    try {
      const data = await this.traceDonationService.getTokenData(BigInt(this.tokenId));
      this.tokenData.set(data);
    } catch (err: any) {
      console.error('Error buscando token:', err);
      this.error.set(err.message || 'Error al buscar el token. Verifica que el ID sea correcto.');
    } finally {
      this.loading.set(false);
    }
  }

  formatDate(timestamp: bigint): string {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTimestamp(timestamp: bigint): string {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isExpired(): boolean {
    if (!this.tokenData()) return false;
    const now = BigInt(Math.floor(Date.now() / 1000));
    return now > this.tokenData()!.expiration;
  }

  getStatus(): string {
    if (!this.tokenData()) return '';

    const locations = this.tokenData()!.locations;
    const lastLocation = locations[locations.length - 1];

    if (lastLocation.used) return '✓ Usado';
    if (this.isExpired()) return '⚠️ Expirado';
    return '🟢 Activo';
  }
}
