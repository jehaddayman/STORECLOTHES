# backend/server.js - سيرفر كامل

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/clothing-erp?authSource=admin';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err.message));

// ==================== MODELS ====================

// User Model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'accountant', 'sales', 'inventory'] },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Product Model
const productSchema = new mongoose.Schema({
  name: String,
  sku: { type: String, unique: true },
  category: String,
  price: Number,
  cost: Number,
  quantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Sales Model
const salesSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  customerName: String,
  items: Array,
  total: Number,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const Sales = mongoose.model('Sales', salesSchema);

// ==================== ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '✅ ERP System Running',
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Default admin account
    if (email === 'admin@clothing-erp.com' && password === 'password123') {
      return res.json({
        message: 'Login successful',
        user: {
          id: '1',
          email: 'admin@clothing-erp.com',
          role: 'admin',
          name: 'Admin User'
        },
        token: 'demo-token-' + Date.now()
      });
    }
    
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    user: {
      id: '1',
      email: 'admin@clothing-erp.com',
      role: 'admin',
      name: 'Admin User'
    }
  });
});

// Dashboard Routes
app.get('/api/dashboard/summary', async (req, res) => {
  try {
    const totalSales = await Sales.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    res.json({
      totalRevenue: 50000,
      totalExpenses: 15000,
      totalProfit: 35000,
      totalProducts: totalProducts,
      totalSales: totalSales,
      cashBalance: 25000,
      accountsReceivable: 5000,
      accountsPayable: 3000,
      inventoryValue: 75000
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/dashboard/charts', (req, res) => {
  res.json({
    dailySales: [
      { date: '2024-01-01', sales: 100, revenue: 5000 },
      { date: '2024-01-02', sales: 120, revenue: 6000 },
      { date: '2024-01-03', sales: 150, revenue: 7500 }
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 50000 },
      { month: 'Feb', revenue: 55000 },
      { month: 'Mar', revenue: 48000 }
    ],
    expenseBreakdown: [
      { category: 'Rent', amount: 5000 },
      { category: 'Salaries', amount: 8000 },
      { category: 'Utilities', amount: 1500 },
      { category: 'Marketing', amount: 500 }
    ]
  });
});

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().limit(50);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sales Routes
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await Sales.find().sort({ createdAt: -1 }).limit(50);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const invoiceNumber = 'INV-' + Date.now();
    const sale = new Sales({
      ...req.body,
      invoiceNumber,
      status: 'completed'
    });
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed Data Route
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Sales.deleteMany({});

    // Create users
    const users = [
      { firstName: 'Admin', lastName: 'User', email: 'admin@clothing-erp.com', password: 'password123', role: 'admin' },
      { firstName: 'Accountant', lastName: 'User', email: 'accountant@clothing-erp.com', password: 'password123', role: 'accountant' },
      { firstName: 'Sales', lastName: 'Employee', email: 'sales@clothing-erp.com', password: 'password123', role: 'sales' },
      { firstName: 'Inventory', lastName: 'Manager', email: 'inventory@clothing-erp.com', password: 'password123', role: 'inventory' }
    ];

    await User.insertMany(users);

    // Create products
    const products = [
      { name: 'Cotton T-Shirt', sku: 'TS-001', category: 'T-Shirts', price: 299, cost: 100, quantity: 50 },
      { name: 'Blue Jeans', sku: 'JEANS-001', category: 'Jeans', price: 799, cost: 300, quantity: 30 },
      { name: 'Black Jacket', sku: 'JACKET-001', category: 'Jackets', price: 1299, cost: 500, quantity: 20 },
      { name: 'Summer Dress', sku: 'DRESS-001', category: 'Dresses', price: 599, cost: 200, quantity: 40 },
      { name: 'Casual Shoes', sku: 'SHOES-001', category: 'Shoes', price: 699, cost: 250, quantity: 25 },
      { name: 'Red Scarf', sku: 'ACC-001', category: 'Accessories', price: 199, cost: 50, quantity: 100 }
    ];

    await Product.insertMany(products);

    // Create sales
    const salesData = [
      { invoiceNumber: 'INV-001', customerName: 'Ahmed Hassan', items: [{ product: 'TS-001', qty: 2, price: 299 }], total: 598, status: 'completed' },
      { invoiceNumber: 'INV-002', customerName: 'Fatima Ali', items: [{ product: 'JEANS-001', qty: 1, price: 799 }], total: 799, status: 'completed' },
      { invoiceNumber: 'INV-003', customerName: 'Omar Khalil', items: [{ product: 'DRESS-001', qty: 1, price: 599 }], total: 599, status: 'completed' }
    ];

    await Sales.insertMany(salesData);

    res.json({ 
      message: '✅ Database seeded successfully',
      users: users.length,
      products: products.length,
      sales: salesData.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ API available at http://localhost:${PORT}/api`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Seed data: POST http://localhost:${PORT}/api/seed\n`);
});

export default app;
