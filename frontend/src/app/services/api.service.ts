import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Farmer, Buyer, Crop, Activity, Expense, Product, Order } from '../models/models';

const BASE = '/api';

// ===== Farmer Service =====
@Injectable({ providedIn: 'root' })
export class FarmerService {
  private url = `${BASE}/farmers`;
  constructor(private http: HttpClient) {}

  signup(farmer: Farmer): Observable<Farmer> {
    return this.http.post<Farmer>(`${this.url}/signup`, farmer);
  }
  login(email: string, password: string): Observable<Farmer> {
    return this.http.post<Farmer>(`${this.url}/login`, { email, password });
  }
  getAll(): Observable<Farmer[]> {
    return this.http.get<Farmer[]>(this.url);
  }
  getById(id: number): Observable<Farmer> {
    return this.http.get<Farmer>(`${this.url}/${id}`);
  }
  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}

// ===== Buyer Service =====
@Injectable({ providedIn: 'root' })
export class BuyerService {
  private url = `${BASE}/buyers`;
  constructor(private http: HttpClient) {}

  signup(buyer: Buyer): Observable<Buyer> {
    return this.http.post<Buyer>(`${this.url}/signup`, buyer);
  }
  login(email: string, password: string): Observable<Buyer> {
    return this.http.post<Buyer>(`${this.url}/login`, { email, password });
  }
  getById(id: number): Observable<Buyer> {
    return this.http.get<Buyer>(`${this.url}/${id}`);
  }
}

// ===== Crop Service =====
@Injectable({ providedIn: 'root' })
export class CropService {
  private url = `${BASE}/crops`;
  constructor(private http: HttpClient) {}

  addCrop(crop: Crop, farmerId: number): Observable<Crop> {
    return this.http.post<Crop>(`${this.url}/${farmerId}`, crop);
  }
  getCropsByFarmer(farmerId: number): Observable<Crop[]> {
    return this.http.get<Crop[]>(`${this.url}/farmer/${farmerId}`);
  }
  getById(id: number): Observable<Crop> {
    return this.http.get<Crop>(`${this.url}/${id}`);
  }
  getAll(): Observable<Crop[]> {
    return this.http.get<Crop[]>(this.url);
  }
  markHarvest(cropId: number, data: Partial<Crop>): Observable<Crop> {
    return this.http.put<Crop>(`${this.url}/${cropId}/harvest`, data);
  }
  getProfit(cropId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/${cropId}/profit`);
  }
  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}

// ===== Activity Service =====
@Injectable({ providedIn: 'root' })
export class ActivityService {
  private url = `${BASE}/activity`;
  constructor(private http: HttpClient) {}

  addActivity(activity: Activity, cropId: number): Observable<Activity> {
    return this.http.post<Activity>(`${this.url}/${cropId}`, activity);
  }
  getActivitiesByCrop(cropId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.url}/crop/${cropId}`);
  }
  getAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.url);
  }
  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}

// ===== Expense Service =====
@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private url = `${BASE}/expenses`;
  constructor(private http: HttpClient) {}

  addExpense(expense: Expense, cropId: number): Observable<Expense> {
    return this.http.post<Expense>(`${this.url}/${cropId}`, expense);
  }
  getExpensesByCrop(cropId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.url}/crop/${cropId}`);
  }
  getAll(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.url);
  }
  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}

// ===== Product Service =====
@Injectable({ providedIn: 'root' })
export class ProductService {
  private url = `${BASE}/products`;
  constructor(private http: HttpClient) {}

  addProduct(product: Product, cropId: number): Observable<Product> {
    return this.http.post<Product>(`${this.url}/${cropId}`, product);
  }
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }
  getByFarmer(farmerId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/farmer/${farmerId}`);
  }
  getByCrop(cropId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/crop/${cropId}`);
  }
  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}

// ===== Order Service =====
@Injectable({ providedIn: 'root' })
export class OrderService {
  private url = `${BASE}/orders`;
  constructor(private http: HttpClient) {}

  placeOrder(order: Partial<Order>, buyerId: number, productId: number): Observable<Order> {
    return this.http.post<Order>(`${this.url}/${buyerId}/${productId}`, order);
  }
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }
  getByBuyer(buyerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/buyer/${buyerId}`);
  }
  getByFarmer(farmerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/farmer/${farmerId}`);
  }
  updateStatus(orderId: number, status: string): Observable<Order> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Order>(`${this.url}/${orderId}/status`, null, { params });
  }
}
