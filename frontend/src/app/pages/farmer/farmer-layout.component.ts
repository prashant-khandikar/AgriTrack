import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Farmer } from '../../models/models';

@Component({
  selector: 'app-farmer-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="page-layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <div class="sidebar-logo">🌾</div>
          <div>
            <div class="sidebar-brand">AgriTrack</div>
            <div class="sidebar-role">Farmer Portal</div>
          </div>
        </div>

        <div class="user-info">
          <div class="user-avatar">{{ farmer?.name?.charAt(0) || 'F' }}</div>
          <div>
            <div class="user-name">{{ farmer?.name }}</div>
            <div class="user-email">{{ farmer?.email }}</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/farmer/dashboard" routerLinkActive="active" (click)="sidebarOpen=false">
            <i class="fa-solid fa-gauge"></i>
            <span>Dashboard</span>
          </a>
          <a class="nav-item" routerLink="/farmer/crops" routerLinkActive="active" (click)="sidebarOpen=false">
            <i class="fa-solid fa-seedling"></i>
            <span>My Crops</span>
          </a>
          <a class="nav-item" routerLink="/farmer/products" routerLinkActive="active" (click)="sidebarOpen=false">
            <i class="fa-solid fa-store"></i>
            <span>Products</span>
          </a>
          <a class="nav-item" routerLink="/farmer/orders" routerLinkActive="active" (click)="sidebarOpen=false">
            <i class="fa-solid fa-box"></i>
            <span>Orders</span>
          </a>
          <a class="nav-item" routerLink="/farmer/profit" routerLinkActive="active" (click)="sidebarOpen=false">
            <i class="fa-solid fa-chart-line"></i>
            <span>Profit Report</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button class="nav-item logout-btn" (click)="logout()">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Hamburger (mobile) -->
      <button class="hamburger" (click)="sidebarOpen = !sidebarOpen">
        <i class="fa-solid" [class.fa-bars]="!sidebarOpen" [class.fa-xmark]="sidebarOpen"></i>
      </button>

      <!-- Backdrop -->
      <div class="sidebar-backdrop" *ngIf="sidebarOpen" (click)="sidebarOpen=false"></div>

      <!-- Main -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      background: #1a4731;
      color: white;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      z-index: 100;
      display: flex; flex-direction: column;
      transition: transform 0.3s ease;
    }
    .sidebar-header {
      display: flex; align-items: center; gap: 12px;
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .sidebar-logo { font-size: 1.8rem; }
    .sidebar-brand {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.2rem; font-weight: 700;
    }
    .sidebar-role { font-size: 0.72rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.08em; }
    .user-info {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px;
      background: rgba(255,255,255,0.06);
      margin: 12px;
      border-radius: 10px;
    }
    .user-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: #52b788;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1rem;
      flex-shrink: 0;
    }
    .user-name { font-weight: 600; font-size: 0.88rem; }
    .user-email { font-size: 0.75rem; opacity: 0.6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px; }
    .sidebar-nav { flex: 1; padding: 8px 12px; overflow-y: auto; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 14px;
      border-radius: 8px;
      color: rgba(255,255,255,0.7);
      font-size: 0.9rem; font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 2px;
      text-decoration: none;
      border: none; background: none; width: 100%; text-align: left;
    }
    .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
    .nav-item.active { background: #2d6a4f; color: white; font-weight: 600; }
    .nav-item i { width: 18px; text-align: center; }
    .sidebar-footer { padding: 12px; border-top: 1px solid rgba(255,255,255,0.1); }
    .logout-btn { color: rgba(255,255,255,0.5); }
    .logout-btn:hover { background: rgba(220,38,38,0.2); color: #fca5a5; }
    .main-content { margin-left: 240px; min-height: 100vh; }
    .hamburger {
      display: none;
      position: fixed; top: 16px; left: 16px;
      z-index: 200;
      background: #1a4731; color: white;
      border: none; border-radius: 8px;
      width: 40px; height: 40px;
      font-size: 1rem; cursor: pointer;
      align-items: center; justify-content: center;
    }
    .sidebar-backdrop {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 99;
    }
    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
      .main-content { margin-left: 0; }
      .hamburger { display: flex; }
      .sidebar-backdrop { display: block; }
    }
  `]
})
export class FarmerLayoutComponent {
  sidebarOpen = false;
  farmer: Farmer | null;

  constructor(private auth: AuthService, private router: Router) {
    this.farmer = this.auth.getFarmer();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
