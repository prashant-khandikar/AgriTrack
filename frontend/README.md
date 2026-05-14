# 🌾 AgriTrack Frontend — Angular Application

A complete Angular 17 frontend for the AgriTrack Agri Management & Marketplace system.

---

## 📁 Project Structure

```
src/app/
├── models/
│   └── models.ts              # All TypeScript interfaces (Farmer, Buyer, Crop, etc.)
├── services/
│   ├── api.service.ts         # All HTTP services (Farmer, Buyer, Crop, Activity, Expense, Product, Order)
│   ├── auth.service.ts        # Auth + localStorage user management
│   └── toast.service.ts       # Global toast notification service
├── guards/
│   └── auth.guard.ts          # farmerGuard, buyerGuard, guestGuard
├── pages/
│   ├── auth/
│   │   ├── login.component.ts    # Login (Farmer / Buyer toggle)
│   │   └── signup.component.ts   # Signup (Farmer / Buyer forms)
│   ├── farmer/
│   │   ├── farmer-layout.component.ts    # Sidebar layout wrapper
│   │   ├── farmer-dashboard.component.ts # Stats, quick actions, recent data
│   │   ├── crops.component.ts            # CRUD crops + activities + expenses
│   │   ├── farmer-products.component.ts  # List products for sale
│   │   ├── farmer-orders.component.ts    # View & update received orders
│   │   └── profit.component.ts           # Chart.js profit visualization
│   └── buyer/
│       ├── buyer-layout.component.ts     # Sidebar layout wrapper
│       ├── buyer-dashboard.component.ts  # Stats + recent orders + featured products
│       ├── marketplace.component.ts      # Product grid + search/filter + place order
│       └── buyer-orders.component.ts     # Order history + tracking progress bar
├── app.component.ts           # Root component with global toast UI
├── app.config.ts              # Angular providers (router, HttpClient, animations)
└── app.routes.ts              # All routes with lazy loading + guards
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- Angular CLI 17: `npm install -g @angular/cli`

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start backend (Spring Boot on port 8080)
# Make sure your AgriTrack Spring Boot app is running at http://localhost:8080

# 3. Start frontend (with proxy to backend)
npm start
# Runs at http://localhost:4200
```

> The `proxy.conf.json` automatically forwards all `/api` calls to `http://localhost:8080`

---

## 🔗 API Endpoints Used

| Service | Endpoint |
|--------|----------|
| Farmer Signup | `POST /api/farmers/signup` |
| Farmer Login | `POST /api/farmers/login` |
| Buyer Signup | `POST /api/buyers/signup` |
| Buyer Login | `POST /api/buyers/login` |
| Get Crops by Farmer | `GET /api/crops/farmer/{farmerId}` |
| Add Crop | `POST /api/crops/{farmerId}` |
| Mark Harvest | `PUT /api/crops/{cropId}/harvest` |
| Get Crop Profit | `GET /api/crops/{cropId}/profit` |
| Add Activity | `POST /api/activity/{cropId}` |
| Add Expense | `POST /api/expenses/{cropId}` |
| Add Product | `POST /api/products/{cropId}` |
| Get All Products | `GET /api/products` |
| Get Products by Farmer | `GET /api/products/farmer/{farmerId}` |
| Place Order | `POST /api/orders/{buyerId}/{productId}` |
| Get Orders by Buyer | `GET /api/orders/buyer/{buyerId}` |
| Get Orders by Farmer | `GET /api/orders/farmer/{farmerId}` |
| Update Order Status | `PUT /api/orders/{orderId}/status?status=SHIPPED` |

---

## ✨ Features

### 👨‍🌾 Farmer Dashboard
- ✅ Dashboard with stats (crops, harvested, orders, products)
- ✅ Add / view / delete crops with season & sowing date
- ✅ Add activities to crops (SOWING, WATERING, FERTILIZING, etc.)
- ✅ Add expenses to crops (SEED, LABOR, FERTILIZER, etc.)
- ✅ Mark crop as Harvested with harvest date
- ✅ List harvested crops as marketplace products
- ✅ View received orders + update status (Pending → Shipped → Delivered)
- ✅ Profit Report with Chart.js bar + doughnut charts

### 🛍️ Buyer Dashboard
- ✅ Dashboard with spending stats
- ✅ Marketplace product grid with search, filter by price, sort
- ✅ Place orders with quantity validation + live price calculation
- ✅ Order history with status filter tabs (All / Pending / Shipped / Delivered)
- ✅ Visual order progress tracker (step-by-step status bar)
- ✅ Purchase summary (total spent, pending amount, avg order value)

### 🔐 Auth
- ✅ Login/Signup for both Farmer and Buyer
- ✅ Role-based routing guards
- ✅ User stored in localStorage

### 🎨 UI/UX
- ✅ Modern design with green/earth/sky color palette
- ✅ Responsive — works on mobile + desktop
- ✅ Collapsible sidebar on mobile
- ✅ Global toast notifications (success / error / info)
- ✅ Loading spinners + empty states
- ✅ Modals for all forms
- ✅ FontAwesome icons throughout

---

## 🛠️ Tech Stack
- **Angular 17** (standalone components, lazy loading)
- **Reactive Forms** for all input forms
- **HttpClient** with proxy for API calls
- **Chart.js** (via CDN) for profit charts
- **FontAwesome 6** for icons
- **Google Fonts** — Playfair Display + DM Sans
- Pure CSS (no external UI framework — fully custom design system)
