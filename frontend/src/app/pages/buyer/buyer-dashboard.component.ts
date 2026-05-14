import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService, ProductService } from '../../services/api.service';
import { Order, Product } from '../../models/models';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h1 class="page-title">Welcome, {{ buyerName }}! 🛒</h1>
      <p class="page-subtitle">Find fresh produce directly from farmers</p>
    </div>

    <div class="page-body">
      <!-- Stats -->
      <div class="stats-grid" *ngIf="!loading">
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fa-solid fa-bag-shopping"></i></div>
          <div>
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">{{ orders.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber"><i class="fa-solid fa-clock"></i></div>
          <div>
            <div class="stat-label">Pending</div>
            <div class="stat-value">{{ countByStatus('PENDING') }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="fa-solid fa-circle-check"></i></div>
          <div>
            <div class="stat-label">Delivered</div>
            <div class="stat-value">{{ countByStatus('DELIVERED') }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon earth"><i class="fa-solid fa-indian-rupee-sign"></i></div>
          <div>
            <div class="stat-label">Total Spent</div>
            <div class="stat-value">₹{{ totalSpent.toFixed(0) }}</div>
          </div>
        </div>
      </div>

      <!-- Skeleton loading -->
      <div class="stats-grid" *ngIf="loading">
        <div class="stat-card skeleton" *ngFor="let i of [1,2,3,4]" style="height:88px;"></div>
      </div>

      <!-- Quick Actions -->
      <div class="section-title">Quick Actions</div>
      <div class="quick-actions">
        <a routerLink="/buyer/marketplace" class="qa-card qa-blue">
          <div class="qa-icon">🌾</div>
          <div class="qa-label">Browse Marketplace</div>
          <div class="qa-sub">{{ availableProducts }} products available</div>
        </a>
        <a routerLink="/buyer/orders" class="qa-card qa-amber">
          <div class="qa-icon">📦</div>
          <div class="qa-label">Track Orders</div>
          <div class="qa-sub">{{ countByStatus('PENDING') }} pending orders</div>
        </a>
        <a routerLink="/buyer/orders" class="qa-card qa-green">
          <div class="qa-icon">📋</div>
          <div class="qa-label">Purchase History</div>
          <div class="qa-sub">{{ countByStatus('DELIVERED') }} completed</div>
        </a>
      </div>

      <!-- Two columns -->
      <div class="two-col">
        <!-- Recent Orders -->
        <div class="card">
          <div class="card-header-row">
            <div class="card-title">Recent Orders</div>
            <a routerLink="/buyer/orders" class="card-link">View all →</a>
          </div>
          <div *ngIf="orders.length === 0 && !loading" class="empty-state" style="padding:30px 20px">
            <i class="fa-solid fa-box-open"></i>
            <p>No orders placed yet</p>
          </div>
          <div *ngFor="let o of orders.slice(0,5)" class="order-row">
            <div class="order-left">
              <div class="order-emoji">{{ getEmoji(o.product?.name || '') }}</div>
              <div>
                <div class="order-product">{{ o.product?.name || 'Product' }}</div>
                <div class="order-meta">{{ o.quantity }} kg • ₹{{ ((o.quantity || 0) * (o.product?.price || 0)).toFixed(0) }}</div>
              </div>
            </div>
            <span class="badge" [class]="getBadge(o.status)">{{ o.status }}</span>
          </div>
        </div>

        <!-- Featured Products -->
        <div class="card">
          <div class="card-header-row">
            <div class="card-title">Featured Products</div>
            <a routerLink="/buyer/marketplace" class="card-link">Browse all →</a>
          </div>
          <div *ngIf="featuredProducts.length === 0 && !loading" class="empty-state" style="padding:30px 20px">
            <i class="fa-solid fa-store"></i>
            <p>No products available</p>
          </div>
          <div *ngFor="let p of featuredProducts.slice(0,5)" class="product-row">
            <div class="product-left">
              <div class="product-emoji-sm">{{ getEmoji(p.name) }}</div>
              <div>
                <div class="product-name-sm">{{ p.name }}</div>
                <div class="product-qty-sm">{{ p.quantity }} kg available</div>
              </div>
            </div>
            <div class="product-price-sm">₹{{ p.price }}/kg</div>
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
      grid-template-columns: repeat(3, 1fr);
      gap: 16px; margin-bottom: 28px;
    }
    .qa-card {
      border-radius: 14px; padding: 24px 20px;
      display: flex; flex-direction: column; gap: 8px;
      cursor: pointer; text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid rgba(0,0,0,0.06);
    }
    .qa-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .qa-blue { background: linear-gradient(135deg,#e0f2fe,#bae6fd); }
    .qa-amber { background: linear-gradient(135deg,#fef3c7,#fde68a); }
    .qa-green { background: linear-gradient(135deg,#d8f3dc,#b7e4c7); }
    .qa-icon { font-size: 2rem; }
    .qa-label { font-weight: 700; font-size: 0.95rem; color: #1a1a2e; }
    .qa-sub { font-size: 0.78rem; color: #4a4a6a; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card-header-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px;
    }
    .card-link { font-size: 0.82rem; color: #0ea5e9; font-weight: 500; }
    .order-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 0; border-bottom: 1px solid #f1f5f9;
    }
    .order-row:last-child { border-bottom: none; }
    .order-left { display: flex; align-items: center; gap: 12px; }
    .order-emoji { font-size: 1.5rem; }
    .order-product { font-weight: 600; font-size: 0.9rem; }
    .order-meta { font-size: 0.78rem; color: #9090aa; margin-top: 2px; }
    .product-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 0; border-bottom: 1px solid #f1f5f9;
    }
    .product-row:last-child { border-bottom: none; }
    .product-left { display: flex; align-items: center; gap: 10px; }
    .product-emoji-sm { font-size: 1.4rem; }
    .product-name-sm { font-weight: 600; font-size: 0.9rem; }
    .product-qty-sm { font-size: 0.78rem; color: #9090aa; }
    .product-price-sm { font-weight: 700; color: #0369a1; font-size: 0.95rem; }
    .skeleton {
      background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite; border-radius: 12px;
    }
    @keyframes shimmer { to { background-position: -200% 0; } }
    @media(max-width:900px) { .quick-actions { grid-template-columns: 1fr 1fr; } .two-col { grid-template-columns: 1fr; } }
    @media(max-width:500px) { .quick-actions { grid-template-columns: 1fr; } }
  `]
})
export class BuyerDashboardComponent implements OnInit {
  buyerName = '';
  orders: Order[] = [];
  featuredProducts: Product[] = [];
  availableProducts = 0;
  loading = true;

  get totalSpent() {
    return this.orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((s, o) => s + (o.quantity || 0) * (o.product?.price || 0), 0);
  }

  constructor(
    private auth: AuthService,
    private orderSvc: OrderService,
    private productSvc: ProductService
  ) {}

  ngOnInit() {
    const buyer = this.auth.getBuyer();
    this.buyerName = buyer?.name || 'Buyer';
    const id = buyer?.id!;

    this.orderSvc.getByBuyer(id).subscribe(o => {
      this.orders = o;
    });

    this.productSvc.getAll().subscribe(p => {
      this.featuredProducts = p;
      this.availableProducts = p.length;
      this.loading = false;
    });
  }

  countByStatus(s: string) { return this.orders.filter(o => o.status === s).length; }

  getEmoji(name: string) {
    const map: Record<string, string> = {
      wheat: '🌾', rice: '🌾', corn: '🌽', tomato: '🍅',
      potato: '🥔', onion: '🧅', sugarcane: '🎋', cotton: '🪴', soybean: '🫘'
    };
    const key = Object.keys(map).find(k => name?.toLowerCase().includes(k));
    return key ? map[key] : '🥬';
  }

  getBadge(s: string) {
    const m: Record<string, string> = {
      PENDING: 'badge-amber', SHIPPED: 'badge-blue', DELIVERED: 'badge-green'
    };
    return m[s] || 'badge-gray';
  }
}
