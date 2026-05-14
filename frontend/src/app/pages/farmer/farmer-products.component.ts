import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService, CropService } from '../../services/api.service';
import { Product, Crop } from '../../models/models';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-farmer-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Products 🛒</h1>
      <p class="page-subtitle">List your harvested crops for sale in the marketplace</p>
    </div>
    <div class="page-body">
      <div class="toolbar">
        <div class="stats-mini">
          <span class="mini-stat"><i class="fa-solid fa-store"></i> {{ products.length }} products listed</span>
        </div>
        <button class="btn btn-primary" (click)="showModal = true">
          <i class="fa-solid fa-plus"></i> Add Product
        </button>
      </div>

      <div *ngIf="loading" class="spinner-overlay"><div class="spinner"></div></div>

      <div *ngIf="!loading && products.length === 0" class="empty-state">
        <i class="fa-solid fa-store"></i>
        <p>No products listed yet. Add harvested crops to sell!</p>
      </div>

      <div class="product-grid" *ngIf="!loading">
        <div class="product-card" *ngFor="let p of products">
          <div class="product-card-img">{{ getEmoji(p.name) }}</div>
          <div class="product-card-body">
            <div class="product-card-name">{{ p.name }}</div>
            <div class="product-card-price">₹{{ p.price }}/kg</div>
            <div class="product-card-qty">Available: {{ p.quantity }} kg</div>
            <div class="product-card-qty" *ngIf="p.postedDate">Listed: {{ p.postedDate | date:'mediumDate' }}</div>
            <div class="crop-tag" *ngIf="p.crop">
              <i class="fa-solid fa-seedling"></i> {{ p.crop.name }}
            </div>
          </div>
          <div class="product-card-footer">
            <button class="btn btn-sm btn-danger btn-full" (click)="deleteProduct(p.id!)">
              <i class="fa-solid fa-trash"></i> Remove Listing
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div class="modal-backdrop" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">🛒 List New Product</div>
          <button class="modal-close" (click)="showModal=false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <form [formGroup]="form">
            <div class="form-group">
              <label class="form-label">Select Crop *</label>
              <select class="form-control" formControlName="cropId">
                <option value="">Choose harvested crop</option>
                <option *ngFor="let c of harvestedCrops" [value]="c.id">{{ c.name }} ({{ c.season }})</option>
              </select>
              <span *ngIf="harvestedCrops.length === 0" style="font-size:0.8rem;color:#e9a800;margin-top:4px;display:block;">
                ⚠️ No harvested crops. Mark a crop as harvested first.
              </span>
            </div>
            <div class="form-group">
              <label class="form-label">Product Name *</label>
              <input class="form-control" formControlName="name" placeholder="e.g., Premium Wheat" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Price (₹/kg) *</label>
                <input type="number" class="form-control" formControlName="price" placeholder="0.00" />
              </div>
              <div class="form-group">
                <label class="form-label">Quantity (kg) *</label>
                <input type="number" class="form-control" formControlName="quantity" placeholder="0" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="showModal=false">Cancel</button>
          <button class="btn btn-primary" (click)="addProduct()" [disabled]="saving">
            {{ saving ? 'Listing...' : 'List Product' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .mini-stat { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #4a4a6a; font-weight: 500; }
    .mini-stat i { color: #2d6a4f; }
    .crop-tag { display: inline-flex; align-items: center; gap: 6px; background: #d8f3dc; color: #1a4731; border-radius: 20px; padding: 3px 10px; font-size: 0.75rem; font-weight: 500; margin-top: 6px; }
  `]
})
export class FarmerProductsComponent implements OnInit {
  products: Product[] = [];
  harvestedCrops: Crop[] = [];
  loading = true;
  saving = false;
  showModal = false;
  farmerId!: number;

  form = this.fb.group({
    cropId: ['', Validators.required],
    name: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0.01)]],
    quantity: [null, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private productSvc: ProductService,
    private cropSvc: CropService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.farmerId = this.auth.getFarmer()?.id!;
    this.loadProducts();
    this.loadCrops();
  }

  loadProducts() {
    this.productSvc.getByFarmer(this.farmerId).subscribe({
      next: p => { this.products = p; this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadCrops() {
    this.cropSvc.getCropsByFarmer(this.farmerId).subscribe(crops => {
      this.harvestedCrops = crops.filter(c => c.status === 'HARVESTED');
    });
  }

  addProduct() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const val = this.form.value;
    const cropId = Number(val.cropId);
    this.saving = true;
    this.productSvc.addProduct({ name: val.name!, price: val.price!, quantity: val.quantity! }, cropId).subscribe({
      next: () => {
        this.toast.success('Product listed in marketplace! 🛒');
        this.form.reset();
        this.showModal = false;
        this.loadProducts();
        this.saving = false;
      },
      error: () => { this.toast.error('Failed to list product'); this.saving = false; }
    });
  }

  deleteProduct(id: number) {
    if (!confirm('Remove this product from marketplace?')) return;
    this.productSvc.delete(id).subscribe({
      next: () => { this.toast.success('Product removed'); this.loadProducts(); },
      error: () => this.toast.error('Failed to remove product')
    });
  }

  getEmoji(name: string) {
    const map: Record<string, string> = {
      wheat: '🌾', rice: '🌾', corn: '🌽', tomato: '🍅', potato: '🥔',
      onion: '🧅', sugarcane: '🎋', cotton: '🪴', soybean: '🫘'
    };
    const key = Object.keys(map).find(k => name?.toLowerCase().includes(k));
    return key ? map[key] : '🥬';
  }
}
