import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CropService, ExpenseService, OrderService } from '../../services/api.service';
import { Crop, Expense, Order } from '../../models/models';
import { ToastService } from '../../services/toast.service';

declare const Chart: any;

interface CropProfit { crop: Crop; profit: number; expenses: number; revenue: number; }

@Component({
  selector: 'app-profit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Profit Report 📊</h1>
      <p class="page-subtitle">Financial overview of all your crops</p>
    </div>
    <div class="page-body">
      <div *ngIf="loading" class="spinner-overlay"><div class="spinner"></div></div>

      <!-- Summary Cards -->
      <div class="stats-grid" *ngIf="!loading">
        <div class="stat-card">
          <div class="stat-icon green"><i class="fa-solid fa-arrow-trend-up"></i></div>
          <div>
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value">₹{{ totalRevenue.toFixed(0) }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber"><i class="fa-solid fa-arrow-trend-down"></i></div>
          <div>
            <div class="stat-label">Total Expenses</div>
            <div class="stat-value">₹{{ totalExpenses.toFixed(0) }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" [class]="netProfit >= 0 ? 'blue' : 'earth'">
            <i class="fa-solid fa-indian-rupee-sign"></i>
          </div>
          <div>
            <div class="stat-label">Net Profit</div>
            <div class="stat-value" [style.color]="netProfit >= 0 ? '#2d6a4f' : '#dc2626'">
              ₹{{ netProfit.toFixed(0) }}
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="fa-solid fa-percent"></i></div>
          <div>
            <div class="stat-label">Profit Margin</div>
            <div class="stat-value">{{ margin.toFixed(1) }}%</div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-row" *ngIf="!loading && cropProfits.length > 0">
        <div class="card">
          <div class="card-title">Revenue vs Expenses by Crop</div>
          <canvas #barChart></canvas>
        </div>
        <div class="card">
          <div class="card-title">Profit Distribution</div>
          <canvas #pieChart></canvas>
        </div>
      </div>

      <!-- Detailed Table -->
      <div class="card" *ngIf="!loading">
        <div class="card-title">Crop-wise Breakdown</div>

        <div *ngIf="cropProfits.length === 0" class="empty-state">
          <i class="fa-solid fa-chart-pie"></i>
          <p>Add crops with expenses to see profit data</p>
        </div>

        <div class="table-wrapper" *ngIf="cropProfits.length > 0">
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Season</th>
                <th>Status</th>
                <th>Expenses (₹)</th>
                <th>Revenue (₹)</th>
                <th>Profit (₹)</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cp of cropProfits">
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-size:1.2rem">{{ getEmoji(cp.crop.name) }}</span>
                    <strong>{{ cp.crop.name }}</strong>
                  </div>
                </td>
                <td>{{ cp.crop.season }}</td>
                <td><span class="badge" [class]="getStatusBadge(cp.crop.status)">{{ cp.crop.status }}</span></td>
                <td style="color:#dc2626">{{ cp.expenses.toFixed(2) }}</td>
                <td style="color:#2d6a4f">{{ cp.revenue.toFixed(2) }}</td>
                <td style="font-weight:700" [style.color]="cp.profit >= 0 ? '#2d6a4f' : '#dc2626'">
                  {{ cp.profit >= 0 ? '+' : '' }}{{ cp.profit.toFixed(2) }}
                </td>
                <td>
                  <div class="margin-bar-wrap">
                    <div class="margin-bar" [style.width]="getMarginWidth(cp) + '%'"
                         [style.background]="cp.profit >= 0 ? '#52b788' : '#dc2626'"></div>
                    <span>{{ cp.revenue > 0 ? ((cp.profit/cp.revenue)*100).toFixed(1) : 0 }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .margin-bar-wrap { display: flex; align-items: center; gap: 8px; }
    .margin-bar { height: 6px; border-radius: 3px; min-width: 4px; transition: width 0.5s ease; }
    @media(max-width:768px) { .charts-row { grid-template-columns: 1fr; } }
  `]
})
export class ProfitComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart') barRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieRef!: ElementRef<HTMLCanvasElement>;

  crops: Crop[] = [];
  cropProfits: CropProfit[] = [];
  loading = true;
  chartsReady = false;
  farmerId!: number;

  get totalRevenue() { return this.cropProfits.reduce((s, c) => s + c.revenue, 0); }
  get totalExpenses() { return this.cropProfits.reduce((s, c) => s + c.expenses, 0); }
  get netProfit() { return this.totalRevenue - this.totalExpenses; }
  get margin() { return this.totalRevenue > 0 ? (this.netProfit / this.totalRevenue) * 100 : 0; }

  constructor(
    private auth: AuthService,
    private cropSvc: CropService,
    private expSvc: ExpenseService,
    private orderSvc: OrderService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.farmerId = this.auth.getFarmer()?.id!;
    this.loadData();
  }

  ngAfterViewInit() {
    this.chartsReady = true;
    if (this.cropProfits.length > 0) this.renderCharts();
  }

  loadData() {
    this.cropSvc.getCropsByFarmer(this.farmerId).subscribe(crops => {
      this.crops = crops;
      if (crops.length === 0) { this.loading = false; return; }
      let pending = crops.length;
      this.cropProfits = [];

      crops.forEach(crop => {
        let expenses = 0;
        this.expSvc.getExpensesByCrop(crop.id!).subscribe(exps => {
          expenses = exps.reduce((s, e) => s + e.amount, 0);
          this.cropSvc.getProfit(crop.id!).subscribe({
            next: profit => {
              this.cropProfits.push({
                crop,
                profit,
                expenses,
                revenue: profit + expenses
              });
              if (--pending === 0) {
                this.loading = false;
                if (this.chartsReady) setTimeout(() => this.renderCharts(), 100);
              }
            },
            error: () => {
              this.cropProfits.push({ crop, profit: 0, expenses, revenue: 0 });
              if (--pending === 0) {
                this.loading = false;
                if (this.chartsReady) setTimeout(() => this.renderCharts(), 100);
              }
            }
          });
        });
      });
    });
  }

  renderCharts() {
    if (!this.barRef || !this.pieRef || this.cropProfits.length === 0) return;
    const labels = this.cropProfits.map(c => c.crop.name);
    const revenues = this.cropProfits.map(c => c.revenue);
    const expenses = this.cropProfits.map(c => c.expenses);
    const profits = this.cropProfits.map(c => c.profit);

    // Bar Chart
    new Chart(this.barRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Revenue', data: revenues, backgroundColor: 'rgba(82,183,136,0.8)', borderRadius: 6 },
          { label: 'Expenses', data: expenses, backgroundColor: 'rgba(233,168,0,0.8)', borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });

    // Pie Chart
    new Chart(this.pieRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: profits.map(p => Math.max(p, 0)),
          backgroundColor: ['#52b788','#e9a800','#0ea5e9','#6b4226','#2d6a4f','#dc2626'].slice(0, labels.length)
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'right' } } }
    });
  }

  getMarginWidth(cp: CropProfit): number {
    if (cp.revenue === 0) return 0;
    return Math.min(Math.abs(cp.profit / cp.revenue) * 100, 100);
  }

  getEmoji(name: string) {
    const map: Record<string, string> = { wheat: '🌾', rice: '🌾', corn: '🌽', tomato: '🍅', potato: '🥔', onion: '🧅' };
    return map[name?.toLowerCase()] || '🌱';
  }

  getStatusBadge(s: string) {
    const m: Record<string, string> = { SOWN: 'badge-blue', GROWING: 'badge-green', HARVESTED: 'badge-amber' };
    return m[s] || 'badge-gray';
  }
}
