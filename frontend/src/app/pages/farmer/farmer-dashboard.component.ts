import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CropService, OrderService, ExpenseService, ProductService } from '../../services/api.service';
import { Crop, Order } from '../../models/models';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h1 class="page-title">Good day, {{ farmerName }}! 🌾</h1>
      <p class="page-subtitle">Here's an overview of your farm operations</p>
    </div>

    <div class="page-body">
      <!-- Stats -->
      <div class="stats-grid" *ngIf="!loading; else loadingSkeleton">
        <div class="stat-card">
          <div class="stat-icon green"><i class="fa-solid fa-seedling"></i></div>
          <div>
            <div class="stat-label">Total Crops</div>
            <div class="stat-value">{{ crops.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber"><i class="fa-solid fa-wheat-awn"></i></div>
          <div>
            <div class="stat-label">Harvested</div>
            <div class="stat-value">{{ harvestedCount }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fa-solid fa-box"></i></div>
          <div>
            <div class="stat-label">Active Orders</div>
            <div class="stat-value">{{ pendingOrders }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon earth"><i class="fa-solid fa-store"></i></div>
          <div>
            <div class="stat-label">Products Listed</div>
            <div class="stat-value">{{ productCount }}</div>
          </div>
        </div>
      </div>

      <ng-template #loadingSkeleton>
        <div class="stats-grid">
          <div class="stat-card skeleton" *ngFor="let i of [1,2,3,4]" style="height:88px;"></div>
        </div>
      </ng-template>

      <!-- Quick Actions -->
      <div class="section-title">Quick Actions</div>
      <div class="quick-actions">
        <a routerLink="/farmer/crops" class="qa-card qa-green">
          <div class="qa-icon">🌱</div>
          <div class="qa-label">Manage Crops</div>
        </a>
        <a routerLink="/farmer/products" class="qa-card qa-amber">
          <div class="qa-icon">🛒</div>
          <div class="qa-label">List Products</div>
        </a>
        <a routerLink="/farmer/orders" class="qa-card qa-blue">
          <div class="qa-icon">📦</div>
          <div class="qa-label">View Orders</div>
        </a>
        <a routerLink="/farmer/profit" class="qa-card qa-earth">
          <div class="qa-icon">📊</div>
          <div class="qa-label">Profit Report</div>
        </a>
      </div>

      <!-- Two-column: Recent Crops + Recent Orders -->
      <div class="two-col">
        <!-- Recent Crops -->
        <div class="card">
          <div class="card-header-row">
            <div class="card-title">Recent Crops</div>
            <a routerLink="/farmer/crops" class="card-link">View all →</a>
          </div>
          <div *ngIf="crops.length === 0 && !loading" class="empty-state">
            <i class="fa-solid fa-seedling"></i>
            <p>No crops added yet</p>
          </div>
          <div *ngFor="let c of crops.slice(0,5)" class="crop-row">
            <div class="crop-row-left">
              <div class="crop-emoji">{{ getCropEmoji(c.name) }}</div>
              <div>
                <div class="crop-name">{{ c.name }}</div>
                <div class="crop-season">{{ c.season }}</div>
              </div>
            </div>
            <span class="badge" [class]="getStatusClass(c.status)">{{ c.status }}</span>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="card">
          <div class="card-header-row">
            <div class="card-title">Recent Orders</div>
            <a routerLink="/farmer/orders" class="card-link">View all →</a>
          </div>
          <div *ngIf="orders.length === 0 && !loading" class="empty-state">
            <i class="fa-solid fa-box-open"></i>
            <p>No orders received yet</p>
          </div>
          <div *ngFor="let o of orders.slice(0,5)" class="order-row">
            <div>
              <div class="order-product">{{ o.product?.name || 'Product' }}</div>
              <div class="order-meta">Qty: {{ o.quantity }} • {{ o.orderDate | date:'mediumDate' }}</div>
            </div>
            <span class="badge" [class]="getOrderBadge(o.status)">{{ o.status }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.1rem; font-weight: 600;
      color: #1a1a2e; margin-bottom: 12px; margin-top: 8px;
    }
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px; margin-bottom: 28px;
    }
    .qa-card {
      border-radius: 14px; padding: 24px 16px;
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      cursor: pointer; text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid rgba(0,0,0,0.06);
    }
    .qa-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .qa-green { background: linear-gradient(135deg,#d8f3dc,#b7e4c7); }
    .qa-amber { background: linear-gradient(135deg,#fef3c7,#fde68a); }
    .qa-blue { background: linear-gradient(135deg,#e0f2fe,#bae6fd); }
    .qa-earth { background: linear-gradient(135deg,#f5ede6,#e9d5c6); }
    .qa-icon { font-size: 2rem; }
    .qa-label { font-weight: 600; font-size: 0.88rem; color: #1a1a2e; text-align: center; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card-header-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px;
    }
    .card-link { font-size: 0.82rem; color: #2d6a4f; font-weight: 500; }
    .crop-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 0; border-bottom: 1px solid #f1f5f9;
    }
    .crop-row:last-child { border-bottom: none; }
    .crop-row-left { display: flex; align-items: center; gap: 12px; }
    .crop-emoji { font-size: 1.5rem; }
    .crop-name { font-weight: 600; font-size: 0.9rem; }
    .crop-season { font-size: 0.78rem; color: #9090aa; }
    .order-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 0; border-bottom: 1px solid #f1f5f9;
    }
    .order-row:last-child { border-bottom: none; }
    .order-product { font-weight: 600; font-size: 0.9rem; }
    .order-meta { font-size: 0.78rem; color: #9090aa; margin-top: 2px; }
    .skeleton { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 12px; }
    @keyframes shimmer { to { background-position: -200% 0; } }
    @media (max-width: 900px) { .quick-actions { grid-template-columns: 1fr 1fr; } .two-col { grid-template-columns: 1fr; } }
    @media (max-width: 500px) { .quick-actions { grid-template-columns: 1fr 1fr; } }
  `]
})
export class FarmerDashboardComponent implements OnInit {
  farmerName = '';
  crops: Crop[] = [];
  orders: Order[] = [];
  loading = true;
  productCount = 0;

  get harvestedCount() { return this.crops.filter(c => c.status === 'HARVESTED').length; }
  get pendingOrders() { return this.orders.filter(o => o.status === 'PENDING').length; }

  constructor(
    private auth: AuthService,
    private cropSvc: CropService,
    private orderSvc: OrderService,
    private productSvc: ProductService
  ) {}

  ngOnInit() {
    const farmer = this.auth.getFarmer();
    this.farmerName = farmer?.name || 'Farmer';
    const id = farmer?.id!;
    this.cropSvc.getCropsByFarmer(id).subscribe(c => { this.crops = c; });
    this.orderSvc.getByFarmer(id).subscribe(o => { this.orders = o; });
    this.productSvc.getByFarmer(id).subscribe(p => { this.productCount = p.length; this.loading = false; });
  }

  getCropEmoji(name: string) {
    const map: Record<string, string> = {
      wheat: '🌾', rice: '🌾', corn: '🌽', tomato: '🍅', potato: '🥔',
      onion: '🧅', sugarcane: '🎋', cotton: '🪴', soybean: '🫘', default: '🌱'
    };
    return map[name?.toLowerCase()] || map['default'];
  }

  getStatusClass(s: string) {
    const m: Record<string, string> = { SOWN: 'badge-blue', GROWING: 'badge-green', HARVESTED: 'badge-amber' };
    return m[s] || 'badge-gray';
  }

  getOrderBadge(s: string) {
    const m: Record<string, string> = { PENDING: 'badge-amber', SHIPPED: 'badge-blue', DELIVERED: 'badge-green' };
    return m[s] || 'badge-gray';
  }
}
