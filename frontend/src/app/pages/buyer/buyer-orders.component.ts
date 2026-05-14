import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/api.service';
import { Order } from '../../models/models';

@Component({
  selector: 'app-buyer-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">My Orders 📦</h1>
      <p class="page-subtitle">Track all your purchases and order status</p>
    </div>

    <div class="page-body">

      <div class="stats-grid" *ngIf="!loading" style="margin-bottom:20px">
        <div>Total Orders: {{ orders.length }}</div>
        <div>Pending: {{ countByStatus('PENDING') }}</div>
        <div>Shipped: {{ countByStatus('SHIPPED') }}</div>
        <div>Delivered: {{ countByStatus('DELIVERED') }}</div>
      </div>

      <!-- FIXED FILTER -->
      <div>
        <button (click)="setFilter('ALL')">All</button>
        <button (click)="setFilter('PENDING')">Pending</button>
        <button (click)="setFilter('SHIPPED')">Shipped</button>
        <button (click)="setFilter('DELIVERED')">Delivered</button>
      </div>

      <div *ngIf="loading">Loading...</div>

      <div *ngIf="!loading && filteredOrders.length === 0">
        No orders found
      </div>

      <div *ngFor="let o of filteredOrders">

        <h3>#ORDER-{{ o.id }} ({{ o.status }})</h3>

        <div>
          {{ o.product?.name || 'Product' }} |
          {{ o.quantity }} kg |
          ₹{{ ((o.quantity || 0) * (o.product?.price || 0)).toFixed(2) }}
        </div>

        <!-- ✅ FIXED HERE (IMPORTANT) -->
        <div>
          &#64; ₹{{ o.product?.price || 0 }}/kg
        </div>

        <div>
          Ordered: {{ o.orderDate | date:'longDate' }}
        </div>

        <hr>
      </div>

      <!-- SUMMARY -->
      <div *ngIf="!loading && orders.length > 0">
        <h3>Summary</h3>
        <div>Total Spent: ₹{{ totalSpent.toFixed(2) }}</div>
        <div>Pending Amount: ₹{{ pendingAmount.toFixed(2) }}</div>
        <div>Avg Order: ₹{{ avgOrderValue.toFixed(2) }}</div>
      </div>

    </div>
  `
})
export class BuyerOrdersComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  activeFilter = 'ALL';
  loading = true;

  constructor(private auth: AuthService, private orderSvc: OrderService) {}

  ngOnInit() {
    const id = this.auth.getBuyer()?.id!;
    this.orderSvc.getByBuyer(id).subscribe({
      next: o => {
        this.orders = o.sort((a, b) =>
          new Date(b.orderDate || 0).getTime() - new Date(a.orderDate || 0).getTime()
        );
        this.filteredOrders = this.orders;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  setFilter(f: string) {
    this.activeFilter = f;
    this.filteredOrders =
      f === 'ALL' ? this.orders : this.orders.filter(o => o.status === f);
  }

  countByStatus(s: string) {
    return this.orders.filter(o => o.status === s).length;
  }

  get totalSpent() {
    return this.orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((s, o) => s + (o.quantity || 0) * (o.product?.price || 0), 0);
  }

  get pendingAmount() {
    return this.orders
      .filter(o => o.status === 'PENDING')
      .reduce((s, o) => s + (o.quantity || 0) * (o.product?.price || 0), 0);
  }

  get avgOrderValue() {
    if (!this.orders.length) return 0;
    const total = this.orders.reduce(
      (s, o) => s + (o.quantity || 0) * (o.product?.price || 0),
      0
    );
    return total / this.orders.length;
  }
}