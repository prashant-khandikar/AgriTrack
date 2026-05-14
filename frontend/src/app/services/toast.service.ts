import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts$ = new Subject<Toast[]>();
  private toasts: Toast[] = [];

  private add(type: Toast['type'], message: string) {
    const id = ++this.counter;
    this.toasts = [...this.toasts, { id, type, message }];
    this.toasts$.next(this.toasts);
    setTimeout(() => this.remove(id), 4000);
  }

  success(message: string) { this.add('success', message); }
  error(message: string) { this.add('error', message); }
  info(message: string) { this.add('info', message); }
  warning(message: string) { this.add('warning', message); }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toasts$.next(this.toasts);
  }
}
