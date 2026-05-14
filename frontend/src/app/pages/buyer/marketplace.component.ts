import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService, OrderService } from '../../services/api.service';
import { Product } from '../../models/models';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Marketplace 🌾</h1>
      <p class="page-subtitle">Fresh produce directly from farmers — no middlemen</p>
    </div>

    <div class="page-body">
      <div class="filters-bar">
        <div class="search-bar" style="flex:1;max-width:360px">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input [(ngModel)]="search" placeholder="Search products..." (ngModelChange)="applyFilters()" />
        </div>

        <div class="filter-group">
          <label class="filter-label">Sort by</label>
          <select class="filter-select" [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="qty-desc">Most Available</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Max Price (₹/kg)</label>
          <input type="number" class="filter-select" [(ngModel)]="maxPrice"
                 (ngModelChange)="applyFilters()" placeholder="Any" />
        </div>

        <div class="results-count" *ngIf="!loading">
          {{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }} found
        </div>
      </div>

      <div *ngIf="loading" class="spinner-overlay"><div class="spinner"></div></div>

      <div *ngIf="!loading && filteredProducts.length === 0" class="empty-state">
        <i class="fa-solid fa-store"></i>
        <p>No products match your search</p>
      </div>

      <div class="product-grid" *ngIf="!loading">
        <div class="product-card" *ngFor="let p of filteredProducts">
          <div class="product-card-img">
            <span class="product-big-emoji">{{ getEmoji(p.name) }}</span>
            <div class="product-fresh-tag">🌿 Fresh</div>
          </div>

          <div class="product-card-body">
            <div class="product-card-name">{{ p.name }}</div>
            <div class="product-card-price">₹{{ p.price }}<span class="per-unit">/kg</span></div>

            <div class="product-card-qty">
              {{ p.quantity }} kg available
            </div>

            <div class="product-date" *ngIf="p.postedDate">
              Listed {{ p.postedDate | date:'mediumDate' }}
            </div>

            <div class="crop-badge" *ngIf="p.crop">
              {{ p.crop.name }}
              <span *ngIf="p.crop.season"> • {{ p.crop.season }}</span>
            </div>
          </div>

          <div class="product-card-footer">
            <button class="btn btn-primary btn-full" (click)="openOrder(p)">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div class="modal-backdrop" *ngIf="showOrderModal && selectedProduct">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Place Order</div>
          <button (click)="showOrderModal=false">X</button>
        </div>

        <div class="modal-body">
          <div>
            <b>{{ selectedProduct.name }}</b><br>
            ₹{{ selectedProduct.price }}/kg<br>
            Available: {{ selectedProduct.quantity }} kg
          </div>

          <form [formGroup]="orderForm">
            <input type="number" formControlName="quantity"
                   [max]="selectedProduct.quantity" min="1" />

            <div *ngIf="orderForm.get('quantity')?.invalid && orderForm.get('quantity')?.touched">
              Invalid quantity
            </div>

            <!-- FIXED TOTAL -->
            <div *ngIf="orderForm.get('quantity')?.value">
              Total:
              ₹{{ ((orderForm.get('quantity')?.value || 0) * selectedProduct.price).toFixed(2) }}
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button (click)="showOrderModal=false">Cancel</button>
          <button (click)="placeOrder()" [disabled]="saving">
            {{ saving ? 'Placing...' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class MarketplaceComponent implements OnInit {

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;

  loading = true;
  saving = false;
  showOrderModal = false;

  search = '';
  sortBy = 'default';
  maxPrice: number | null = null;
  buyerId!: number;

  orderForm = this.fb.group({
    quantity: [null, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private productSvc: ProductService,
    private orderSvc: OrderService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.buyerId = this.auth.getBuyer()?.id!;
    this.loadProducts();
  }

  loadProducts() {
    this.productSvc.getAll().subscribe({
      next: p => {
        this.allProducts = p;
        this.filteredProducts = p;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilters() {
    let result = [...this.allProducts];

    if (this.search.trim()) {
      const s = this.search.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(s) ||
        p.crop?.name?.toLowerCase().includes(s)
      );
    }

    if (this.maxPrice !== null && this.maxPrice > 0) {
      result = result.filter(p => p.price <= this.maxPrice!);
    }
    switch (this.sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'qty-desc': result.sort((a, b) => b.quantity - a.quantity); break;
    }

    this.filteredProducts = result;
  }

  openOrder(p: Product) {
    this.selectedProduct = p;
    this.orderForm.reset();
    this.showOrderModal = true;
  }

  placeOrder() {
    if (this.orderForm.invalid || !this.selectedProduct?.id) return;

    this.saving = true;

    // ✅ FIXED TYPE ISSUE
    const qty = Number(this.orderForm.value.quantity || 0);

    this.orderSvc.placeOrder(
      { quantity: qty },
      this.buyerId,
      this.selectedProduct.id
    ).subscribe({
      next: () => {
        this.toast.success('Order placed!');
        this.showOrderModal = false;
        this.saving = false;
      },
      error: () => {
        this.toast.error('Failed');
        this.saving = false;
      }
    });
  }

  getEmoji(name: string) {
    return '🌾';
  }
}