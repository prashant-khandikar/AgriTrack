import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FarmerService, BuyerService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-logo">🌾</div>
          <h1 class="brand-name">AgriTrack</h1>
          <p class="brand-tagline">Join thousands of farmers and buyers building better food chains</p>
        </div>
        <div class="auth-features">
          <div class="feature-item"><span>🌱</span> Manage your crops efficiently</div>
          <div class="feature-item"><span>💰</span> Track income & expenses</div>
          <div class="feature-item"><span>🤝</span> Connect with buyers directly</div>
          <div class="feature-item"><span>📈</span> Grow your agri business</div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join AgriTrack as a Farmer or Buyer</p>

          <div class="role-toggle">
            <button class="role-btn" [class.active]="role === 'farmer'" (click)="role='farmer'; resetForm()">
              👨‍🌾 Farmer
            </button>
            <button class="role-btn" [class.active]="role === 'buyer'" (click)="role='buyer'; resetForm()">
              🛍️ Buyer
            </button>
          </div>

          <div *ngIf="error" class="alert alert-danger"><i class="fa-solid fa-circle-exclamation"></i> {{ error }}</div>

          <!-- FARMER FORM -->
          <form *ngIf="role === 'farmer'" [formGroup]="farmerForm" (ngSubmit)="signupFarmer()">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input class="form-control" formControlName="name" placeholder="Ramesh Kumar" />
              </div>
              <div class="form-group">
                <label class="form-label">Contact *</label>
                <input class="form-control" formControlName="contact" placeholder="9876543210" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" class="form-control" formControlName="email" placeholder="farmer@example.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input type="password" class="form-control" formControlName="password" placeholder="Min 6 characters" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Village</label>
                <input class="form-control" formControlName="village" placeholder="Your village" />
              </div>
              <div class="form-group">
                <label class="form-label">District</label>
                <input class="form-control" formControlName="district" placeholder="District" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">State</label>
                <input class="form-control" formControlName="state" placeholder="State" />
              </div>
              <div class="form-group">
                <label class="form-label">Farm Size (acres)</label>
                <input type="number" class="form-control" formControlName="farmSize" placeholder="5.0" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Soil Type</label>
              <select class="form-control" formControlName="soilType">
                <option value="">Select soil type</option>
                <option>Black</option>
                <option>Red</option>
                <option>Alluvial</option>
                <option>Sandy</option>
                <option>Clay</option>
                <option>Loamy</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary btn-lg btn-full" [disabled]="loading">
              <span *ngIf="loading" class="btn-spinner"></span>
              <i *ngIf="!loading" class="fa-solid fa-user-plus"></i>
              {{ loading ? 'Creating...' : 'Create Farmer Account' }}
            </button>
          </form>

          <!-- BUYER FORM -->
          <form *ngIf="role === 'buyer'" [formGroup]="buyerForm" (ngSubmit)="signupBuyer()">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input class="form-control" formControlName="name" placeholder="Suresh Mehta" />
            </div>
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" class="form-control" formControlName="email" placeholder="buyer@example.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input type="password" class="form-control" formControlName="password" placeholder="Min 6 characters" />
            </div>
            <div class="form-group">
              <label class="form-label">Contact</label>
              <input class="form-control" formControlName="contact" placeholder="9876543210" />
            </div>
            <button type="submit" class="btn btn-primary btn-lg btn-full" [disabled]="loading">
              <span *ngIf="loading" class="btn-spinner"></span>
              <i *ngIf="!loading" class="fa-solid fa-user-plus"></i>
              {{ loading ? 'Creating...' : 'Create Buyer Account' }}
            </button>
          </form>

          <p class="auth-switch">
            Already have an account?
            <a routerLink="/login" class="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; min-height: 100vh; }
    .auth-left {
      flex: 1;
      background: linear-gradient(145deg, #1a4731 0%, #2d6a4f 50%, #52b788 100%);
      color: white;
      padding: 48px 56px;
      display: flex; flex-direction: column; justify-content: center;
      position: relative; overflow: hidden;
    }
    .auth-left::before {
      content: ''; position: absolute;
      top: -80px; right: -80px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }
    .brand-logo { font-size: 3rem; margin-bottom: 12px; }
    .brand-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 2.8rem; font-weight: 700;
      letter-spacing: -1px; margin-bottom: 12px;
    }
    .brand-tagline { font-size: 1rem; opacity: 0.85; max-width: 320px; line-height: 1.6; margin-bottom: 48px; }
    .auth-features { display: flex; flex-direction: column; gap: 14px; }
    .feature-item { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; opacity: 0.9; }
    .feature-item span { font-size: 1.2rem; }
    .auth-right {
      width: 520px;
      display: flex; align-items: center; justify-content: center;
      padding: 32px; background: #f7f8fa; overflow-y: auto;
    }
    .auth-card {
      width: 100%; background: white;
      border-radius: 20px; padding: 36px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .auth-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.7rem; font-weight: 700;
      color: #1a1a2e; margin-bottom: 6px;
    }
    .auth-subtitle { color: #9090aa; font-size: 0.9rem; margin-bottom: 24px; }
    .role-toggle {
      display: flex; background: #f1f5f9;
      border-radius: 10px; padding: 4px; margin-bottom: 20px; gap: 4px;
    }
    .role-btn {
      flex: 1; padding: 10px; border: none;
      background: none; border-radius: 8px;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
      font-weight: 500; cursor: pointer; color: #64748b;
      transition: all 0.2s;
    }
    .role-btn.active {
      background: white; color: #2d6a4f;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-weight: 600;
    }
    .auth-switch { text-align: center; margin-top: 20px; font-size: 0.88rem; color: #64748b; }
    .auth-link { color: #2d6a4f; font-weight: 600; margin-left: 4px; }
    .btn-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white; border-radius: 50%;
      animation: spin 0.8s linear infinite; display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 900px) { .auth-left { display: none; } .auth-right { width: 100%; } }
  `]
})
export class SignupComponent {
  role: 'farmer' | 'buyer' = 'farmer';
  loading = false;
  error = '';

  farmerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    contact: ['', Validators.required],
    village: [''],
    district: [''],
    state: [''],
    farmSize: [0],
    soilType: [''],
    role: ['FARMER']
  });

  buyerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    contact: ['']
  });

  constructor(
    private fb: FormBuilder,
    private farmerSvc: FarmerService,
    private buyerSvc: BuyerService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  resetForm() { this.error = ''; }

  signupFarmer() {
    if (this.farmerForm.invalid) { this.farmerForm.markAllAsTouched(); return; }
    this.loading = true;
    this.farmerSvc.signup(this.farmerForm.value as any).subscribe({
      next: (f) => {
        this.auth.setFarmer(f);
        this.toast.success(`Account created! Welcome, ${f.name} 🌾`);
        this.router.navigate(['/farmer/dashboard']);
      },
      error: (e) => {
        this.error = e?.error?.message || 'Signup failed. Email may already be in use.';
        this.loading = false;
      }
    });
  }

  signupBuyer() {
    if (this.buyerForm.invalid) { this.buyerForm.markAllAsTouched(); return; }
    this.loading = true;
    this.buyerSvc.signup(this.buyerForm.value as any).subscribe({
      next: (b) => {
        this.auth.setBuyer(b);
        this.toast.success(`Account created! Welcome, ${b.name} 🛒`);
        this.router.navigate(['/buyer/dashboard']);
      },
      error: (e) => {
        this.error = e?.error?.message || 'Signup failed. Email may already be in use.';
        this.loading = false;
      }
    });
  }
}
