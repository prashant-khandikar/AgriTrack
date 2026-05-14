# 🌾 AgriTrack – Smart Farming & Marketplace System

AgriTrack is a Full Stack Agriculture Management and Marketplace System developed using **Spring Boot** and **Angular**.
The system helps farmers manage crops, track expenses, monitor farming activities, sell products, and calculate profit.
Buyers can browse products and place orders directly through the platform.

---

# 🚀 Features

## 👨‍🌾 Farmer Dashboard

* Farmer Registration & Login
* Add Crop Details
* Track Crop Activities
* Add Farming Expenses
* Mark Crop as Harvested
* Add Products for Selling
* View Orders
* Calculate Profit

---

## 🛍️ Buyer Dashboard

* Buyer Registration & Login
* View Products
* Place Orders
* Track Order Status
* Purchase History

---

# 🏗️ Project Architecture

```text
Angular Frontend
        ↓
Spring Boot REST API
        ↓
MySQL Database
```

---

# 🛠️ Technology Stack

## Backend

* Java
* Spring Boot
* Spring Data JPA
* Spring Security
* Hibernate
* MySQL

## Frontend

* Angular
* Bootstrap
* TypeScript

## Tools

* Postman
* GitHub
* Eclipse IDE
* VS Code

---

# 📦 Modules

* Farmer Module
* Crop Module
* Activity Module
* Expense Module
* Product Module
* Buyer Module
* Order Module

---

# 🔐 Security

* Password Encryption using BCryptPasswordEncoder
* Spring Security Configuration
* CORS Configuration for Angular Integration

---

# 📊 Profit Calculation

```text
Profit = Total Sales - Total Expenses
```

The system dynamically calculates profit using:

* Crop Expenses
* Product Sales
* Order Details

---

# 🌱 Crop Workflow

```text
Farmer Signup
    ↓
Login
    ↓
Add Crop
    ↓
Add Activities & Expenses
    ↓
Harvest Crop
    ↓
Add Product to Marketplace
    ↓
Buyer Places Order
    ↓
Profit Calculation
```

---

# 🔌 REST APIs

## Farmer APIs

* POST `/api/farmers/signup`
* POST `/api/farmers/login`

## Crop APIs

* POST `/api/crops/{farmerId}`
* GET `/api/crops/farmer/{id}`

## Activity APIs

* POST `/api/activity/addActivity/{cropId}`

## Expense APIs

* POST `/api/expense/addExpense/{cropId}`

## Product APIs

* POST `/api/product/addProduct/{cropId}`

## Order APIs

* POST `/api/order/addorder/{productId}/{buyerId}`

---

# 🗄️ Database

Database used:

```text
MySQL
```

Main Tables:

* Farmer
* Crop
* Activity
* Expense
* Product
* Buyer
* Orders

---

# ▶️ Run Backend Project

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/AgriTrack.git
```

---

## 2️⃣ Configure Database

Update `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/agritrack
spring.datasource.username=root
spring.datasource.password=yourpassword
```

---

## 3️⃣ Run Project

```bash
mvn spring-boot:run
```

OR run directly from Eclipse IDE.

---

# 🧪 API Testing

Use **Postman** to test APIs.

Example:

```http
POST /api/farmers/signup
```

---

# 📈 Future Enhancements

* AI-based Crop Prediction
* Weather Integration
* Online Payment Gateway
* Mobile Application
* JWT Authentication

---

# 👨‍💻 Author

**Prashant Khandikar**

---

# ⭐ Conclusion

AgriTrack provides a digital solution for smart farming management and crop marketplace operations.
The project tracks the complete farming lifecycle from sowing to selling while helping farmers monitor profit and expenses efficiently.
