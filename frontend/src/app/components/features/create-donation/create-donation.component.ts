import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TraceDonationService } from '../../../services/trace-donation.service';

@Component({
  selector: 'app-create-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-donation.component.html',
  styleUrls: ['./create-donation.component.scss']
})
export class CreateDonationComponent {
  donantAddress = '';
  description = '';
  location = '';
  expirationDate = '';
  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor(private traceDonationService: TraceDonationService) { }

  async createToken() {
    this.loading.set(true);
    this.success.set(null);
    this.error.set(null);

    try {
      const expiration = BigInt(new Date(this.expirationDate).getTime() / 1000);
      const result = await this.traceDonationService.emitirToken(
        this.donantAddress,
        this.description,
        this.location,
        expiration
      );
      this.success.set(result.txHash);
      // Reset form
      this.donantAddress = '';
      this.description = '';
      this.location = '';
      this.expirationDate = '';
    } catch (err: any) {
      this.error.set(err.message || 'Error al crear el token');
    } finally {
      this.loading.set(false);
    }
  }
}
