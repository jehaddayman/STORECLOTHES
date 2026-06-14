# backend/routes.js - جميع الـ Routes والـ Endpoints

إذا كنت تريد توسيع البيك اند، أضف هذه الـ Routes لـ server.js:

---

## 📦 Product Routes

```javascript
// Get all products with pagination
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', category = '' } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    
    const products = await Product.find(filter).skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## 💳 Sales Routes

```javascript
// Get all sales
app.get('/api/sales', async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '', search = '' } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.invoiceNumber = { $regex: search, $options: 'i' };
    
    const sales = await Sales.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Sales.countDocuments(filter);
    
    res.json({
      sales,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create sale
app.post('/api/sales', async (req, res) => {
  try {
    const invoiceNumber = 'INV-' + Date.now();
    const sale = new Sales({
      ...req.body,
      invoiceNumber,
      status: 'completed'
    });
    await sale.save();
    
    // Update product quantities
    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }
    
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales by date range
app.get('/api/sales/date-range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const sales = await Sales.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    
    res.json({
      sales,
      totalRevenue,
      count: sales.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales summary
app.get('/api/sales/summary', async (req, res) => {
  try {
    const totalSales = await Sales.countDocuments();
    const totalRevenue = await Sales.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const monthlySales = await Sales.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totalSales,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlySales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update sale status
app.put('/api/sales/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const sale = await Sales.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## 📊 Dashboard Routes

```javascript
// Get full dashboard
app.get('/api/dashboard/full', async (req, res) => {
  try {
    const totalSales = await Sales.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalRevenue = await Sales.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const topProducts = await Sales.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          quantity: { $sum: '$items.qty' },
          revenue: { $sum: '$items.total' }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 }
    ]);
    
    const recentSales = await Sales.find().sort({ createdAt: -1 }).limit(10);
    
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$quantity', 10] }
    });
    
    res.json({
      totalSales,
      totalProducts,
      totalRevenue: totalRevenue[0]?.total || 0,
      topProducts,
      recentSales,
      lowStockProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Monthly analytics
app.get('/api/dashboard/monthly', async (req, res) => {
  try {
    const { month } = req.query;
    
    const startDate = new Date(month + '-01');
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const monthlyData = await Sales.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          count: { $sum: 1 },
          avgSale: { $avg: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## 👥 Customer Routes

```javascript
// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Sales.aggregate([
      {
        $group: {
          _id: '$customerName',
          totalSpent: { $sum: '$total' },
          purchaseCount: { $sum: 1 },
          lastPurchase: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);
    
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer history
app.get('/api/customers/:name/history', async (req, res) => {
  try {
    const history = await Sales.find({ customerName: req.params.name });
    const totalSpent = history.reduce((sum, sale) => sum + sale.total, 0);
    
    res.json({
      customer: req.params.name,
      purchases: history.length,
      totalSpent,
      history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## 📈 Stats Routes

```javascript
// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = {
      totalProducts: await Product.countDocuments(),
      totalSales: await Sales.countDocuments(),
      totalCustomers: (await Sales.distinct('customerName')).length,
      totalRevenue: (await Sales.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]))[0]?.total || 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get category statistics
app.get('/api/stats/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## 💰 Revenue Routes

```javascript
// Get revenue breakdown
app.get('/api/revenue/breakdown', async (req, res) => {
  try {
    const breakdown = await Sales.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          transactions: { $sum: 1 },
          avgTransaction: { $avg: '$total' }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get revenue by status
app.get('/api/revenue/by-status', async (req, res) => {
  try {
    const revenue = await Sales.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## 🔍 Search Routes

```javascript
// Global search
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    const regex = { $regex: q, $options: 'i' };
    
    const products = await Product.find({ name: regex });
    const sales = await Sales.find({ invoiceNumber: regex });
    const customers = await Sales.find({ customerName: regex }).distinct('customerName');
    
    res.json({
      products: products.length,
      sales: sales.length,
      customers: customers.length,
      results: {
        products,
        sales,
        customers
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## ✅ اختبار الـ Routes

بعد إضافة هذه الـ Routes، جرّب:

```bash
# تشغيل السيرفر
npm start

# اختبر الـ endpoints
curl http://localhost:5000/api/stats
curl http://localhost:5000/api/dashboard/full
curl http://localhost:5000/api/sales/summary
```

---

## 🎯 ملخص الـ Routes

| Method | Endpoint | الوصف |
|--------|----------|------|
| GET | /api/health | فحص الصحة |
| POST | /api/seed | ملء البيانات |
| GET | /api/products | جميع المنتجات |
| POST | /api/products | إنشاء منتج |
| GET | /api/sales | جميع المبيعات |
| POST | /api/sales | إنشاء فاتورة |
| GET | /api/stats | الإحصائيات |
| GET | /api/dashboard/full | لوحة التحكم الكاملة |
| GET | /api/customers | العملاء |
| GET | /api/revenue/breakdown | تفصيل الإيرادات |

---

**الآن لديك API كاملة جاهزة!** 🚀
