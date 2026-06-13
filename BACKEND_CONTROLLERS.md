# Backend Controllers & API Routes

## Auth Controller

```javascript
// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role, branch } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: role || 'sales_employee',
      branch
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        branch: user.branch
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('branch');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## Dashboard Controller

```javascript
// controllers/dashboardController.js
import Sales from '../models/Sales.js';
import Purchase from '../models/Purchase.js';
import Expense from '../models/Expense.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import Inventory from '../models/Inventory.js';

export const getDashboardData = async (req, res) => {
  try {
    const { branchId } = req.query;
    const filter = branchId ? { branch: branchId } : {};

    // Get sales data for current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const salesData = await Sales.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          ...filter
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalSales: { $sum: 1 },
          totalTax: { $sum: '$tax' }
        }
      }
    ]);

    const expenseData = await Expense.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: 'approved',
          ...filter
        }
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' }
        }
      }
    ]);

    const totalRevenue = salesData[0]?.totalRevenue || 0;
    const totalExpenses = expenseData[0]?.totalExpenses || 0;
    const totalProfit = totalRevenue - totalExpenses;

    // Get inventory value
    const inventoryValue = await Product.aggregate([
      {
        $match: filter.branch ? { branch: filter.branch } : {}
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$quantity', '$costPrice'] } },
          totalProducts: { $sum: 1 }
        }
      }
    ]);

    // Get customer & supplier counts
    const totalCustomers = await Customer.countDocuments(filter);
    const totalSuppliers = await Supplier.countDocuments(filter);

    // Get accounts payable & receivable
    const accountsReceivable = await Sales.aggregate([
      {
        $match: { paymentStatus: { $ne: 'paid' }, ...filter }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $subtract: ['$total', '$amountPaid'] } }
        }
      }
    ]);

    const accountsPayable = await Purchase.aggregate([
      {
        $match: { paymentStatus: { $ne: 'paid' }, ...filter }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $subtract: ['$total', '$amountPaid'] } }
        }
      }
    ]);

    res.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      netIncome: totalProfit.toFixed(2),
      totalInventoryValue: inventoryValue[0]?.totalValue || 0,
      totalProducts: inventoryValue[0]?.totalProducts || 0,
      totalCustomers,
      totalSuppliers,
      accountsReceivable: accountsReceivable[0]?.total || 0,
      accountsPayable: accountsPayable[0]?.total || 0,
      cashBalance: totalRevenue - totalExpenses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardCharts = async (req, res) => {
  try {
    const { branchId, period } = req.query; // period: week, month, year
    const filter = branchId ? { branch: branchId } : {};

    // Daily sales chart
    const dailySales = await Sales.aggregate([
      {
        $match: filter
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    // Monthly revenue
    const monthlyRevenue = await Sales.aggregate([
      {
        $match: filter
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Expense breakdown by category
    const expenseBreakdown = await Expense.aggregate([
      {
        $match: { status: 'approved', ...filter }
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      dailySales,
      monthlyRevenue,
      expenseBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const { branchId } = req.query;
    const filter = branchId ? { branch: branchId } : {};

    const topProducts = await Sales.aggregate([
      {
        $match: filter
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      }
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLowStockAlerts = async (req, res) => {
  try {
    const { branchId } = req.query;
    const filter = branchId ? { branch: branchId } : {};

    const lowStock = await Product.find({
      ...filter,
      $expr: { $lte: ['$quantity', '$minimumStock'] }
    }).select('name sku quantity minimumStock');

    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## Product Controller

```javascript
// controllers/productController.js
import Product from '../models/Product.js';
import { generateBarcode } from '../utils/barcodeGenerator.js';

export const getProducts = async (req, res) => {
  try {
    const { search, category, branchId, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (branchId) filter.branch = branchId;

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .populate('supplier', 'name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, brand, costPrice, sellingPrice, minimumStock, supplier, images, branch } = req.body;

    let product = await Product.findOne({ sku });
    if (product) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    const barcode = await generateBarcode(sku);

    product = new Product({
      name,
      sku,
      barcode,
      category,
      brand,
      costPrice,
      sellingPrice,
      minimumStock,
      supplier,
      images,
      branch,
      profitMargin: ((sellingPrice - costPrice) / costPrice * 100).toFixed(2)
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.costPrice || updates.sellingPrice) {
      updates.profitMargin = (
        (updates.sellingPrice - updates.costPrice) / updates.costPrice * 100
      ).toFixed(2);
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await Product.findOne({ barcode }).populate('supplier');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## Sales Controller

```javascript
// controllers/salesController.js
import Sales from '../models/Sales.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Inventory from '../models/Inventory.js';
import { createJournalEntry } from '../utils/journalEntry.js';

export const createSale = async (req, res) => {
  try {
    const { customerId, items, discount, paymentMethod, branchId, salespersonId } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Calculate totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = item.quantity * product.sellingPrice;
      subtotal += itemTotal;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.sellingPrice,
        discount: item.discount || 0,
        total: itemTotal - (item.discount || 0)
      });
    }

    // Calculate tax
    const taxRate = process.env.VAT_RATE / 100;
    const taxAmount = (subtotal - discount) * taxRate;
    const total = subtotal - discount + taxAmount;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Create sale
    const sale = new Sales({
      invoiceNumber,
      customer: customerId,
      items: processedItems,
      subtotal,
      discount: discount || 0,
      tax: taxAmount,
      total,
      paymentMethod,
      branch: branchId,
      salesperson: salespersonId
    });

    await sale.save();

    // Update product quantities
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } }
      );

      // Create inventory record
      new Inventory({
        product: item.product,
        branch: branchId,
        type: 'stock_out',
        quantity: item.quantity,
        reason: 'Sale',
        reference: { model: 'Sales', id: sale._id },
        performedBy: salespersonId
      }).save();
    }

    // Update customer balance
    await Customer.findByIdAndUpdate(
      customerId,
      {
        $inc: {
          totalPurchases: 1,
          outstandingBalance: paymentMethod !== 'cash' ? total : 0
        }
      }
    );

    // Create journal entries
    await createJournalEntry({
      description: `Sales Invoice ${invoiceNumber}`,
      items: [
        { account: '1010', debit: total, credit: 0 }, // Cash/Bank
        { account: '4010', debit: 0, credit: subtotal } // Sales Revenue
      ]
    });

    res.status(201).json({
      message: 'Sale created successfully',
      sale
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const sales = await Sales.find({ customer: customerId })
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## Routes Examples

```javascript
// routes/auth.js
import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

export default router;
```

```javascript
// routes/dashboard.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import { getDashboardData, getDashboardCharts, getTopSellingProducts, getLowStockAlerts } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/summary', auth, getDashboardData);
router.get('/charts', auth, getDashboardCharts);
router.get('/top-products', auth, getTopSellingProducts);
router.get('/low-stock', auth, getLowStockAlerts);

export default router;
```

```javascript
// routes/products.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductByBarcode } from '../controllers/productController.js';

const router = express.Router();

router.get('/', auth, getProducts);
router.post('/', auth, checkRole(['admin', 'inventory_manager']), createProduct);
router.put('/:id', auth, checkRole(['admin', 'inventory_manager']), updateProduct);
router.delete('/:id', auth, checkRole(['admin']), deleteProduct);
router.get('/barcode/:barcode', auth, getProductByBarcode);

export default router;
```

