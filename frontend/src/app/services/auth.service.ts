import { Injectable } from '@angular/core';
import { Farmer, Buyer } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly FARMER_KEY = 'agritrack_farmer';
  private readonly BUYER_KEY = 'agritrack_buyer';
  private readonly USER_TYPE_KEY = 'agritrack_user_type';

  setFarmer(farmer: Farmer): void {
    localStorage.setItem(this.FARMER_KEY, JSON.stringify(farmer));
    localStorage.setItem(this.USER_TYPE_KEY, 'farmer');
  }

  setBuyer(buyer: Buyer): void {
    localStorage.setItem(this.BUYER_KEY, JSON.stringify(buyer));
    localStorage.setItem(this.USER_TYPE_KEY, 'buyer');
  }

  getFarmer(): Farmer | null {
    const data = localStorage.getItem(this.FARMER_KEY);
    return data ? JSON.parse(data) : null;
  }

  getBuyer(): Buyer | null {
    const data = localStorage.getItem(this.BUYER_KEY);
    return data ? JSON.parse(data) : null;
  }

  getUserType(): string | null {
    return localStorage.getItem(this.USER_TYPE_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.USER_TYPE_KEY);
  }

  isFarmer(): boolean {
    return this.getUserType() === 'farmer';
  }

  isBuyer(): boolean {
    return this.getUserType() === 'buyer';
  }

  logout(): void {
    localStorage.removeItem(this.FARMER_KEY);
    localStorage.removeItem(this.BUYER_KEY);
    localStorage.removeItem(this.USER_TYPE_KEY);
  }

  getCurrentUserId(): number | null {
    if (this.isFarmer()) return this.getFarmer()?.id ?? null;
    if (this.isBuyer()) return this.getBuyer()?.id ?? null;
    return null;
  }
}
