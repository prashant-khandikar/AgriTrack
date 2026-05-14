import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FarmerService, BuyerService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-logo">🌾</div>
          <h1 class="brand-name">AgriTrack</h1>
          <p class="brand-tagline">From Field to Market — Smarter Farming Starts Here</p>
        </div>
        <div class="auth-features">
          <div class="feature-item"><span>🌱</span> Track crops & activities</div>
          <div class="feature-item"><span>📊</span> Monitor profits & expenses</div>
          <div class="feature-item"><span>🛒</span> Buy & sell produce</div>
          <div class="feature-item"><span>📦</span> Manage orders easily</div>
        </div>
        <div class="auth-illustration">🏡</div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to your AgriTrack account</p>

          <!-- Role Toggle -->
          <div class="role-toggle">
            <button class="role-btn" [class.active]="role === 'farmer'" (click)="role='farmer'">
              👨‍🌾 Farmer
            </button>
            <button class="role-btn" [class.active]="role === 'buyer'" (click)="role='buyer'">
              🛍️ Buyer
            </button>
          </div>

          <div *ngIf="error" class="alert alert-danger"><i class="fa-solid fa-circle-exclamation"></i> {{ error }}</div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control" formControlName="email" placeholder="you@example.com" />
              <span class="field-error" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
                Valid email is required
              </span>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrap">
                <input [type]="showPwd ? 'text' : 'password'" class="form-control" formControlName="password" placeholder="Your password" />
                <button type="button" class="pwd-toggle" (click)="showPwd = !showPwd">
                  <i class="fa-solid" [class.fa-eye]="!showPwd" [class.fa-eye-slash]="showPwd"></i>
                </button>
              </div>
              <span class="field-error" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
                Password is required
              </span>
            </div>
            <button type="submit" class="btn btn-primary btn-lg btn-full" [disabled]="loading">
              <span *ngIf="loading" class="btn-spinner"></span>
              <i *ngIf="!loading" class="fa-solid fa-right-to-bracket"></i>
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <p class="auth-switch">
            Don't have an account?
            <a routerLink="/signup" class="auth-link">Create one</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      min-height: 100vh;
    }
    .auth-left {
      flex: 1;
      background: linear-gradient(145deg, #1a4731 0%, #2d6a4f 50%, #52b788 100%);
      color: white;
      padding: 48px 56px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .auth-left::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }
    .auth-left::after {
      content: '';
      position: absolute;
      bottom: -60px; left: -60px;
      width: 250px; height: 250px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }
    .brand-logo { font-size: 3rem; margin-bottom: 12px; }
    .brand-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 2.8rem; font-weight: 700;
      letter-spacing: -1px; margin-bottom: 12px;
    }
    .brand-tagline {
      font-size: 1.05rem; opacity: 0.85;
      max-width: 320px; line-height: 1.6;
      margin-bottom: 48px;
    }
    .auth-features { display: flex; flex-direction: column; gap: 14px; }
    .feature-item {
      display: flex; align-items: center; gap: 12px;
      font-size: 0.95rem; opacity: 0.9;
    }
    .feature-item span { font-size: 1.2rem; }
    .auth-illustration {
      position: absolute; bottom: 40px; right: 56px;
      font-size: 8rem; opacity: 0.12;
    }
    .auth-right {
      width: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: #f7f8fa;
    }
    .auth-card {
      width: 100%;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .auth-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.8rem; font-weight: 700;
      color: #1a1a2e; margin-bottom: 6px;
    }
    .auth-subtitle { color: #9090aa; font-size: 0.9rem; margin-bottom: 28px; }
    .role-toggle {
      display: flex;
      background: #f1f5f9;
      border-radius: 10px;
      padding: 4px;
      margin-bottom: 24px;
      gap: 4px;
    }
    .role-btn {
      flex: 1;
      padding: 10px;
      border: none;
      background: none;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s;
    }
    .role-btn.active {
      background: white;
      color: #2d6a4f;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-weight: 600;
    }
    .input-wrap { position: relative; }
    .input-wrap .form-control { padding-right: 44px; }
    .pwd-toggle {
      position: absolute; right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none;
      cursor: pointer; color: #9090aa;
      font-size: 0.9rem;
    }
    .field-error { font-size: 0.78rem; color: #dc2626; margin-top: 4px; display: block; }
    .auth-switch { text-align: center; margin-top: 24px; font-size: 0.88rem; color: #64748b; }
    .auth-link { color: #2d6a4f; font-weight: 600; margin-left: 4px; }
    .btn-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 900px) {
      .auth-left { display: none; }
      .auth-right { width: 100%; }
    }
  `]
})
export class LoginComponent {
  role: 'farmer' | 'buyer' = 'farmer';
  loading = false;
  error = '';
  showPwd = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private farmerSvc: FarmerService,
    private buyerSvc: BuyerService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value as { email: string; password: string };

    if (this.role === 'farmer') {
      this.farmerSvc.login(email, password).subscribe({
        next: (f) => {
          this.auth.setFarmer(f);
          this.toast.success(`Welcome back, ${f.name}! 🌾`);
          this.router.navigate(['/farmer/dashboard']);
        },
        error: () => {
          this.error = 'Invalid email or password. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.buyerSvc.login(email, password).subscribe({
        next: (b) => {
          this.auth.setBuyer(b);
          this.toast.success(`Welcome back, ${b.name}! 🛒`);
          this.router.navigate(['/buyer/dashboard']);
        },
        error: () => {
          this.error = 'Invalid email or password. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}
