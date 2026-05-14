import { Routes } from '@angular/router';
import { farmerGuard, buyerGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup.component').then(m => m.SignupComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'farmer',
    loadComponent: () => import('./pages/farmer/farmer-layout.component').then(m => m.FarmerLayoutComponent),
    canActivate: [farmerGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/farmer/farmer-dashboard.component').then(m => m.FarmerDashboardComponent)
      },
      {
        path: 'crops',
        loadComponent: () => import('./pages/farmer/crops.component').then(m => m.CropsComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/farmer/farmer-products.component').then(m => m.FarmerProductsComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/farmer/farmer-orders.component').then(m => m.FarmerOrdersComponent)
      },
      {
        path: 'profit',
        loadComponent: () => import('./pages/farmer/profit.component').then(m => m.ProfitComponent)
      }
    ]
  },
  {
    path: 'buyer',
    loadComponent: () => import('./pages/buyer/buyer-layout.component').then(m => m.BuyerLayoutComponent),
    canActivate: [buyerGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/buyer/buyer-dashboard.component').then(m => m.BuyerDashboardComponent)
      },
      {
        path: 'marketplace',
        loadComponent: () => import('./pages/buyer/marketplace.component').then(m => m.MarketplaceComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/buyer/buyer-orders.component').then(m => m.BuyerOrdersComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
