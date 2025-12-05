import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TraceDonationService } from '../services/trace-donation.service';
import { Web3Service } from '../services/web3.service';

export const ownerGuard: CanActivateFn = async (route, state) => {
    const web3Service = inject(Web3Service);
    const traceDonationService = inject(TraceDonationService);
    const router = inject(Router);

    const walletState = web3Service.walletState();

    if (!walletState.connected) {
        alert('Por favor conecta tu wallet primero');
        router.navigate(['/']);
        return false;
    }

    try {
        const isOwner = await traceDonationService.isCurrentUserOwner();

        if (!isOwner) {
            alert('Solo el owner del contrato puede acceder a esta sección');
            router.navigate(['/']);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verificando owner:', error);
        router.navigate(['/']);
        return false;
    }
};
