# Backend - server.js (Main Entry Point)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/products', require('./routes/products'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/accounting', require('./routes/accounting'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/forecast', require('./routes/forecast'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

# Backend - package.json

```json
{
  "name": "clothing-erp-backend",
  "version": "1.0.0",
  "description": "Enterprise ERP System for Clothing Store",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node scripts/seedData.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "axios": "^1.3.4",
    "joi": "^17.9.1",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.0",
    "pdfkit": "^0.13.0",
    "exceljs": "^4.3.0",
    "node-cron": "^3.0.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

# Backend - .env.example

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clothing-erp

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# AWS S3 (for product images)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# App Settings
CURRENCY=EGP
VAT_RATE=14
```

---

# Backend - config/database.js

```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
```

---

# Backend - middleware/auth.js

```javascript
import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

export const refreshToken = (req, res) => {
  try {
    const token = req.body.refreshToken;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
```

---

# Backend - middleware/roleCheck.js

```javascript
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Role Constants
export const ROLES = {
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  SALES_EMPLOYEE: 'sales_employee',
  INVENTORY_MANAGER: 'inventory_manager'
};

// Permission Matrix
export const PERMISSIONS = {
  [ROLES.ADMIN]: ['view_all', 'create_all', 'edit_all', 'delete_all'],
  [ROLES.ACCOUNTANT]: ['view_accounting', 'create_entries', 'view_reports', 'export_reports'],
  [ROLES.SALES_EMPLOYEE]: ['create_sales', 'view_customers', 'print_invoice'],
  [ROLES.INVENTORY_MANAGER]: ['manage_inventory', 'stock_transfers', 'view_reports']
};
```

