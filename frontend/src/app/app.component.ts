import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <router-outlet></router-outlet>

    <!-- Global Toast Container -->
    <div class="toast-container">
      <div class="toast" *ngFor="let t of toasts" [class]="'toast-' + t.type">
        <i class="fa-solid" [class]="getIcon(t.type)"></i>
        <span>{{ t.message }}</span>
        <button class="toast-close" (click)="toastSvc.remove(t.id)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 500;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      pointer-events: all;
      animation: slideInToast 0.3s ease;
      min-width: 280px;
      max-width: 400px;
    }
    .toast span { flex: 1; }
    .toast-close {
      background: none; border: none; cursor: pointer;
      opacity: 0.6; padding: 2px 4px;
    }
    .toast-close:hover { opacity: 1; }
    .toast-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .toast-error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .toast-info { background: #e0f2fe; color: #0c4a6e; border: 1px solid #7dd3fc; }
    .toast-warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    @keyframes slideInToast {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class AppComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(public toastSvc: ToastService) {}

  ngOnInit() {
    this.toastSvc.toasts$.subscribe(t => this.toasts = t);
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'fa-circle-check',
      error: 'fa-circle-exclamation',
      info: 'fa-circle-info',
      warning: 'fa-triangle-exclamation'
    };
    return icons[type] || 'fa-circle-info';
  }
}
