import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TraceDonationService } from '../../../services/trace-donation.service';
import { toBigInt } from '../../../utils/bigint.utils';

@Component({
  selector: 'app-update-location',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent {
  tokenId: number = 0;
  location = '';
  markAsUsed = false;
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  constructor(private traceDonationService: TraceDonationService) { }

  async updateLocation() {
    this.loading.set(true);
    this.success.set(false);
    this.error.set(null);

    try {
      await this.traceDonationService.useToken(
        toBigInt(this.tokenId),
        this.location,
        this.markAsUsed
      );
      this.success.set(true);
      this.location = '';
      this.markAsUsed = false;
    } catch (err: any) {
      this.error.set(err.message || 'Error al actualizar ubicación');
    } finally {
      this.loading.set(false);
    }
  }
}
