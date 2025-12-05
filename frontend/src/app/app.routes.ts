import { Routes } from '@angular/router';
import { DashboardComponent } from './components/features/dashboard/dashboard.component';
import { DonationTrackerComponent } from './components/features/donation-tracker/donation-tracker.component';
import { OngManagementComponent } from './components/features/ong-management/ong-management.component';

/**
 * Nota: No usamos guards para validar permisos.
 * El smart contract validará los permisos cuando se intenten ejecutar transacciones.
 * Esto es más seguro y simplifica el código.
 */
export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'track',
        component: DonationTrackerComponent
    },
    {
        path: 'ong-management',
        component: OngManagementComponent
    },
    {
        path: 'create-donation',
        loadComponent: () => import('./components/features/create-donation/create-donation.component')
            .then(m => m.CreateDonationComponent)
    },
    {
        path: 'update-location',
        loadComponent: () => import('./components/features/update-location/update-location.component')
            .then(m => m.UpdateLocationComponent)
    },
    {
        path: 'my-donations',
        loadComponent: () => import('./components/features/my-donations/my-donations.component')
            .then(m => m.MyDonationsComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
