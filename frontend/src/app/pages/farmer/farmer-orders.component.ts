import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/api.service';
import { Order } from '../../models/models';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-farmer-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Orders Received 📦</h1>
      <p class="page-subtitle">Manage orders placed by buyers for your products</p>
    </div>
    <div class="page-body">
      <!-- Summary -->
      <div class="stats-grid" style="margin-bottom:20px">
        <div class="stat-card">
          <div class="stat-icon amber"><i class="fa-solid fa-clock"></i></div>
          <div><div class="stat-label">Pending</div><div class="stat-value">{{ countByStatus('PENDING') }}</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fa-solid fa-truck"></i></div>
          <div><div class="stat-label">Shipped</div><div class="stat-value">{{ countByStatus('SHIPPED') }}</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="fa-solid fa-circle-check"></i></div>
          <div><div class="stat-label">Delivered</div><div class="stat-value">{{ countByStatus('DELIVERED') }}</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon earth"><i class="fa-solid fa-list"></i></div>
          <div><div class="stat-label">Total</div><div class="stat-value">{{ orders.length }}</div></div>
        </div>
      </div>

      <div class="card">
        <div *ngIf="loading" style="padding:40px;text-align:center"><div class="spinner" style="margin:auto"></div></div>

        <div *ngIf="!loading && orders.length === 0" class="empty-state">
          <i class="fa-solid fa-box-open"></i>
          <p>No orders received yet</p>
        </div>

        <div class="table-wrapper" *ngIf="!loading && orders.length > 0">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Buyer</th>
                <th>Qty (kg)</th>
                <th>Total (₹)</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of orders; let i = index">
                <td>{{ i + 1 }}</td>
                <td>
                  <div style="font-weight:600">{{ o.product?.name || 'N/A' }}</div>
                  <div style="font-size:0.78rem;color:#9090aa">₹{{ o.product?.price }}/kg</div>
                </td>
                <td>{{ o.buyer?.name || 'N/A' }}</td>
                <td>{{ o.quantity }}</td>
                <td style="font-weight:600;color:#2d6a4f">₹{{ (o.quantity * (o.product?.price || 0)).toFixed(2) }}</td>
                <td>{{ o.orderDate | date:'mediumDate' }}</td>
                <td><span class="badge" [class]="getBadge(o.status)">{{ o.status }}</span></td>
                <td>
                  <select class="status-select" [value]="o.status" (change)="updateStatus(o, $any($event.target).value)">
                    <option value="PENDING">Pending</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-select {
      padding: 5px 8px; border: 1.5px solid #e2e8f0;
      border-radius: 6px; font-size: 0.82rem;
      cursor: pointer; outline: none;
      font-family: 'DM Sans', sans-serif;
    }
    .status-select:focus { border-color: #52b788; }
  `]
})
export class FarmerOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(
    private auth: AuthService,
    private orderSvc: OrderService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = this.auth.getFarmer()?.id!;
    this.orderSvc.getByFarmer(id).subscribe({
      next: o => { this.orders = o; this.loading = false; },
      error: () => this.loading = false
    });
  }

  countByStatus(s: string) { return this.orders.filter(o => o.status === s).length; }

  updateStatus(order: Order, status: string) {
    this.orderSvc.updateStatus(order.id!, status).subscribe({
      next: updated => {
        order.status = updated.status;
        this.toast.success(`Order status updated to ${status}`);
      },
      error: () => this.toast.error('Failed to update status')
    });
  }

  getBadge(s: string) {
    const m: Record<string, string> = { PENDING: 'badge-amber', SHIPPED: 'badge-blue', DELIVERED: 'badge-green' };
    return m[s] || 'badge-gray';
  }
}
