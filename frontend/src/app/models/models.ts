// ===== models/farmer.model.ts =====
export interface Farmer {
  id?: number;
  name: string;
  email: string;
  password?: string;
  contact: string;
  village: string;
  district: string;
  state: string;
  farmSize: number;
  soilType: string;
  role?: string;
  crops?: Crop[];
}

// ===== models/buyer.model.ts =====
export interface Buyer {
  id?: number;
  name: string;
  email: string;
  password?: string;
  contact: string;
}

// ===== models/crop.model.ts =====
export interface Crop {
  id?: number;
  name: string;
  season: string;
  status: 'SOWN' | 'GROWING' | 'HARVESTED';
  sowingDate: string;
  harvestDate?: string;
  activities?: Activity[];
  expenses?: Expense[];
}

// ===== models/activity.model.ts =====
export interface Activity {
  id?: number;
  type: string;
  date?: string;
  crop?: Crop;
}

// ===== models/expense.model.ts =====
export interface Expense {
  id?: number;
  amount: number;
  type: string;
  date?: string;
  crop?: Crop;
}

// ===== models/product.model.ts =====
export interface Product {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  postedDate?: string;
  crop?: Crop;
}

// ===== models/order.model.ts =====
export interface Order {
  id?: number;
  quantity: number;
  status: string;
  orderDate?: string;
  buyer?: Buyer;
  product?: Product;
}
