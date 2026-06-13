# Deployment Guide & README

## DEPLOYMENT.md - Railway Deployment

```markdown
# Deploying to Railway

## Prerequisites
- GitHub account with project repository
- Railway account (https://railway.app)
- MongoDB Atlas account

## Step 1: Prepare GitHub Repository

1. Create a new GitHub repository for your project
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/clothing-erp.git
git push -u origin main
```

## Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/clothing-erp`
5. Whitelist your Railway IP (or use 0.0.0.0/0 for testing)

## Step 3: Deploy Backend on Railway

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Select your repository
5. In the Railway dashboard:
   - Add a new "Empty Service"
   - Set it as your backend service

6. Configure environment variables:
   - Go to project settings
   - Add environment variables:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clothing-erp
JWT_SECRET=your-super-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
CURRENCY=EGP
VAT_RATE=14
```

7. Set up deployment:
   - Railway will auto-detect Node.js project
   - Add start command in package.json: `"start": "node server.js"`

8. Deploy by pushing to main branch

## Step 4: Deploy Frontend on Railway

1. Create a separate Railway service for frontend
2. Configure environment variables:

```env
VITE_API_URL=https://your-backend-railway-url/api
```

3. Build command: `npm run build`
4. Start command: `npm run dev`

Alternatively, deploy frontend to Vercel or Netlify:

### Vercel Deployment:

```bash
npm install -g vercel
vercel
```

### Netlify Deployment:

```bash
npm run build
# Drag and drop the dist folder to Netlify
```

## Step 5: Set Up Database Seeding

After deployment, seed your production database:

```bash
# Via Railway terminal or local:
npm run seed
```

## Step 6: Configure Custom Domain

1. In Railway, go to project settings
2. Add custom domain
3. Update DNS records with your registrar
4. Update frontend API URL to production domain

## Monitoring & Logging

- Railway dashboard shows real-time logs
- Monitor CPU, memory, and bandwidth usage
- Set up alerts for errors

## Scaling

- Horizontal scaling: Add more Railway instances
- Vertical scaling: Increase resource allocation
- Use database indexing for optimization

```

---

## Complete README.md

```markdown
# 🏢 Enterprise ERP System for Clothing Store

A comprehensive, production-ready Enterprise Resource Planning (ERP) system designed specifically for clothing retail businesses. Built with modern MERN stack technologies with features for inventory management, accounting, sales, and financial reporting.

## 🌟 Key Features

### 📊 Dashboard & Analytics
- Real-time KPI monitoring (Revenue, Expenses, Profit, Cash Balance)
- Interactive charts (Daily Sales, Monthly Revenue, Expense Breakdown)
- Low stock alerts and inventory insights
- Top selling products analysis
- Recent transaction feed

### 📦 Inventory Management
- Complete stock in/out tracking
- Inventory transfers between branches
- Damaged and returned items tracking
- Automatic barcode generation and scanning
- Inventory valuation reports
- Low stock alerts

### 💳 Sales Management
- Point of Sale (POS) interface
- Multi-product invoices with discounts
- VAT/Tax calculations
- Multiple payment methods (Cash, Card, Bank Transfer, Mobile Wallet)
- Invoice printing and PDF export
- Customer purchase history and loyalty tracking

### 🛒 Purchase Management
- Purchase order creation and tracking
- Supplier management with payment terms
- Goods receipt and billing
- Supplier payment tracking
- Outstanding dues management

### 👥 Customer & Supplier Management
- Customer profiles with purchase history
- Loyalty points tracking
- Accounts receivable monitoring
- Supplier ledger and payment tracking
- Credit limit management

### 💰 Accounting Module
- Double-entry bookkeeping system
- Chart of Accounts (Assets, Liabilities, Equity, Revenue, Expenses)
- Automatic journal entry generation
- General Ledger
- Trial Balance

### 📈 Financial Reports
- Profit & Loss Statement
- Balance Sheet
- Cash Flow Statement
- Trial Balance
- Sales Reports
- Expense Reports
- Inventory Reports
- VAT/Tax Reports
- PDF & Excel export

### 🏪 Multi-Branch Support
- Separate inventory per branch
- Branch-specific sales and expenses
- Branch-level financial reports
- Centralized dashboard with branch filtering

### 🤖 AI Sales Forecasting
- Statistical sales predictions
- Revenue trend analysis
- Top product forecasting
- Historical data analysis

### 🔐 Security & Access Control
- Role-Based Access Control (Admin, Accountant, Sales Employee, Inventory Manager)
- JWT authentication with refresh tokens
- Secure password hashing
- Activity logging

### 🌓 UI/UX Features
- Dark/Light mode support
- Responsive design
- Modern Shadcn UI components
- Real-time notifications
- Advanced search and filtering
- Loading states and empty states

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Handling**: Multer
- **Reports**: ExcelJS, PDFKit

### Frontend
- **UI Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn UI
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Charts**: Recharts, Chart.js
- **Animations**: Framer Motion

### Deployment
- **Backend**: Railway.app
- **Database**: MongoDB Atlas
- **Frontend**: Vercel / Netlify

## 📋 Requirements

- Node.js v16+ 
- MongoDB 4.4+
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/clothing-erp.git
cd clothing-erp
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend running on http://localhost:3000
```

### 5. Seed Demo Data

```bash
cd backend
npm run seed
```

This creates:
- Test users with different roles
- 100+ Products
- 50 Customers
- 20 Suppliers
- 500+ Sales transactions
- 200+ Purchases
- 300+ Expenses

## 👤 Test Accounts

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clothing-erp.com | password123 |
| Accountant | accountant@clothing-erp.com | password123 |
| Sales Employee | sales@clothing-erp.com | password123 |
| Inventory Manager | inventory@clothing-erp.com | password123 |

## 📁 Project Structure

```
clothing-erp/
├── backend/                 # Express.js server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, validation
│   ├── utils/              # Helpers
│   ├── scripts/            # Seed data
│   └── server.js           # Entry point
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand store
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utilities
│   │   └── App.jsx        # Main app
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/summary` - Get KPI data
- `GET /api/dashboard/charts` - Get chart data
- `GET /api/dashboard/top-products` - Top selling products
- `GET /api/dashboard/low-stock` - Low stock items

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/barcode/:barcode` - Get by barcode

### Sales
- `POST /api/sales` - Create sale/invoice
- `GET /api/sales` - List sales
- `GET /api/sales/:customerId` - Get customer sales

### Reports
- `GET /api/reports/profit-loss` - P&L statement
- `GET /api/reports/balance-sheet` - Balance sheet
- `GET /api/reports/cash-flow` - Cash flow statement
- `GET /api/reports/vat` - VAT report

## 📊 Database Schema Overview

**Users** - Authentication and role management
**Products** - Inventory items with pricing
**Customers** - Customer profiles and purchase history
**Suppliers** - Supplier information and terms
**Sales** - Invoice records with line items
**Purchases** - Purchase orders and receipts
**Inventory** - Stock movements and history
**Expenses** - Business expense tracking
**JournalEntries** - Accounting entries
**Branches** - Multi-branch support
**Tax** - Tax configuration

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Secure headers

## 📱 Responsive Design

Fully responsive and tested on:
- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablet (iPad, 1024x768)
- ✅ Mobile (iPhone, Android)

## 🚀 Performance Optimizations

- Database indexing on frequently queried fields
- Pagination on large datasets
- Image lazy loading
- Code splitting in React
- Server-side caching strategies
- MongoDB aggregation pipelines

## 📖 Documentation

- [Backend Setup](./BACKEND_SETUP.md)
- [Database Schemas](./MONGODB_SCHEMAS.md)
- [Controllers & Routes](./BACKEND_CONTROLLERS.md)
- [Frontend Setup](./FRONTEND_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For support, email support@clothing-erp.com or create an issue in the repository.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced reporting with BI integration
- [ ] Barcode scanner device integration
- [ ] SMS/Email notifications
- [ ] Credit card payment gateway integration
- [ ] Automated recurring expenses
- [ ] Budget management
- [ ] Performance analytics

## 👨‍💻 Authors

**Your Name** - Full Stack Developer
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

**⭐ If you found this helpful, please star the repository!**

Built with ❤️ for retail businesses
```

---

## .env.example

```env
# Backend Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clothing-erp?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_change_this
JWT_REFRESH_EXPIRE=30d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# AWS S3 (Optional - for image uploads)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# Application Settings
CURRENCY=EGP
VAT_RATE=14
TIMEZONE=Africa/Cairo

# Frontend
VITE_API_URL=http://localhost:5000/api
```

---

## .gitignore

```
# Dependencies
node_modules/
*.pnp
.pnp.js

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Misc
.cache/
temp/
tmp/
```

```

