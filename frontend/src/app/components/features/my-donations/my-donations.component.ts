import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraceDonationService } from '../../../services/trace-donation.service';
import { TokenData } from '../../../contracts/interfaces/contracts.interface';

interface DonationToken {
  tokenId: bigint;
  data?: TokenData;
  loading: boolean;
  error?: string;
}

@Component({
  selector: 'app-my-donations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-donations.component.html',
  styleUrls: ['./my-donations.component.scss']
})
export class MyDonationsComponent implements OnInit {
  tokens: DonationToken[] = [];
  loading = false;
  error: string | null = null;

  constructor(private traceDonationService: TraceDonationService) { }

  ngOnInit(): void {
    this.loadMyDonations();
  }

  /**
   * Carga todos los tokens del usuario actual
   */
  async loadMyDonations(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const tokens = await this.traceDonationService.getNFTlist();

      if (tokens.length === 0) {
        this.tokens = [];
        this.loading = false;
        return;
      }

      // Inicializar tokens con estado de carga
      this.tokens = tokens.map(tokenId => ({
        tokenId,
        loading: true
      }));

      // Cargar datos de cada token
      await Promise.all(
        this.tokens.map(token => this.loadTokenData(token))
      );

    } catch (err: any) {
      console.error('Error cargando donaciones:', err);
      this.error = err.message || 'Error al cargar las donaciones';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Carga los datos de un token específico
   */
  private async loadTokenData(token: DonationToken): Promise<void> {
    try {
      token.data = await this.traceDonationService.getTokenData(token.tokenId);
      token.loading = false;
    } catch (err: any) {
      console.error(`Error cargando datos del token ${token.tokenId}:`, err);
      token.error = 'Error al cargar datos';
      token.loading = false;
    }
  }

  /**
   * Formatea una fecha desde timestamp
   */
  formatDate(timestamp: bigint): string {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Verifica si un token está expirado
   */
  isExpired(expiration: bigint): boolean {
    return Date.now() > Number(expiration) * 1000;
  }

  /**
   * Verifica si un token está usado
   */
  isUsed(data: TokenData): boolean {
    if (!data.locations || data.locations.length === 0) {
      return false;
    }
    return data.locations[data.locations.length - 1].used;
  }

  /**
   * Obtiene el estado del token
   */
  getTokenStatus(data: TokenData): string {
    if (this.isUsed(data)) {
      return 'Utilizado';
    }
    if (this.isExpired(data.expiration)) {
      return 'Expirado';
    }
    return 'Activo';
  }

  /**
   * Obtiene la clase CSS según el estado
   */
  getStatusClass(data: TokenData): string {
    if (this.isUsed(data)) {
      return 'status-used';
    }
    if (this.isExpired(data.expiration)) {
      return 'status-expired';
    }
    return 'status-active';
  }
}