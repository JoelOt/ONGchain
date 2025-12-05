import { Routes } from '@angular/router';
import { DashboardComponent } from './components/features/dashboard/dashboard.component';
import { DonationTrackerComponent } from './components/features/donation-tracker/donation-tracker.component';
import { OngManagementComponent } from './components/features/ong-management/ong-management.component';
import { ownerGuard } from './guards/owner.guard';
import { authorizedOngGuard } from './guards/authorized-ong.guard';

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
        component: OngManagementComponent,
        canActivate: [ownerGuard]
    },
    {
        path: 'create-donation',
        loadComponent: () => import('./components/features/create-donation/create-donation.component')
            .then(m => m.CreateDonationComponent),
        canActivate: [authorizedOngGuard]
    },
    {
        path: 'update-location',
        loadComponent: () => import('./components/features/update-location/update-location.component')
            .then(m => m.UpdateLocationComponent),
        canActivate: [authorizedOngGuard]
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
