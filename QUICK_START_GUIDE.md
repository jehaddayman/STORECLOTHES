# Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js v16+ (download from https://nodejs.org)
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Git

### Step 1: Clone & Install Dependencies (2 min)

```bash
# Clone the project
git clone https://github.com/yourusername/clothing-erp.git
cd clothing-erp

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables (1 min)

**Backend (.env)**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clothing-erp
JWT_SECRET=your-secret-key-here
VAT_RATE=14
```

**Frontend (.env)**
```bash
cd ../frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Step 3: Start the Application (2 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend runs on http://localhost:3000

### Step 4: Seed Demo Data

```bash
cd backend
npm run seed
```

### Step 5: Login!

Open http://localhost:3000 and login with:
- Email: `admin@clothing-erp.com`
- Password: `password123`

---

## 📊 What You'll See Immediately

After login, you'll have access to:

1. **Dashboard** with real-time metrics
2. **100+ Products** across 6 categories
3. **500+ Sales transactions** with full history
4. **50 Customers** with purchase records
5. **20 Suppliers** and purchase orders
6. **300+ Expenses** organized by category
7. **Complete accounting ledgers** and reports

---

## 🔍 Exploring the System

### Try These Features First:

1. **View Dashboard**
   - See KPIs: Revenue, Expenses, Profit
   - Check inventory value
   - View top selling products
   - See low stock alerts

2. **Manage Products**
   - Search by name, SKU, or barcode
   - Filter by category
   - Edit pricing and stock
   - View profit margins

3. **Create a Sale**
   - POS interface with product search
   - Add multiple items with discounts
   - Calculate VAT automatically
   - Choose payment method
   - Print/download invoice

4. **View Reports**
   - Profit & Loss statement
   - Balance sheet
   - Cash flow analysis
   - Inventory reports
   - Export to Excel/PDF

5. **Manage Accounting**
   - View Chart of Accounts
   - Check General Ledger
   - Review Journal Entries
   - Print Trial Balance

---

## 🛠️ Advanced Setup

### Using MongoDB Locally (Optional)

If you don't want to use MongoDB Atlas:

1. Install MongoDB Community Edition
2. Start MongoDB:
   ```bash
   mongod
   ```
3. Update .env:
   ```env
   MONGODB_URI=mongodb://localhost:27017/clothing-erp
   ```

### Production Build

```bash
# Build frontend
cd frontend
npm run build
# Creates optimized dist/ folder

# Production backend
npm run start
```

---

## 📚 File Structure Quick Reference

```
clothing-erp/
│
├── backend/
│   ├── models/          ← Database schemas
│   ├── routes/          ← API endpoints
│   ├── controllers/     ← Business logic
│   ├── middleware/      ← Auth, validation
│   ├── scripts/         ← seedData.js
│   └── server.js        ← Start here
│
├── frontend/
│   └── src/
│       ├── components/  ← React components
│       ├── pages/       ← Page layouts
│       ├── services/    ← API calls
│       ├── store/       ← State management
│       └── App.jsx      ← Main app
│
└── Documentation files
```

---

## 🐛 Troubleshooting

### "Cannot find module 'mongoose'"
```bash
cd backend
npm install
```

### "Connection refused" to MongoDB
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify IP whitelist in MongoDB Atlas

### CORS errors on API calls
- Backend is on different port
- Update VITE_API_URL in frontend/.env

### Port already in use
```bash
# Kill process on port 5000 (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Seed script fails
```bash
# Clear collections and retry
# In MongoDB Atlas interface, delete all collections
npm run seed
```

---

## 🔑 Available Test Accounts

After seeding, use any of these accounts:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@clothing-erp.com | password123 | Everything |
| **Accountant** | accountant@clothing-erp.com | password123 | Accounting, Reports |
| **Sales** | sales@clothing-erp.com | password123 | POS, Invoices, Customers |
| **Inventory** | inventory@clothing-erp.com | password123 | Products, Stock, Transfers |

---

## 📱 Key Features to Try

### 1. Dashboard (`/dashboard`)
- Real-time KPI cards
- Sales and expense charts
- Low stock alerts
- Top products
- Recent transactions

### 2. Products (`/products`)
- Search and filter
- Add new products
- Edit pricing/inventory
- View profit margins
- Barcode display

### 3. Sales (`/sales`)
- Create invoice (POS)
- Multiple payment methods
- Automatic VAT calculation
- Print/PDF export
- Payment tracking

### 4. Inventory (`/inventory`)
- Stock in/out
- Inventory transfers
- Damaged items
- Returns management
- Valuation reports

### 5. Reports (`/reports`)
- Financial statements
- P&L analysis
- Cash flow tracking
- Inventory reports
- PDF/Excel export

### 6. Accounting (`/accounting`)
- Chart of Accounts
- Journal entries
- General Ledger
- Trial Balance
- Account reconciliation

### 7. Multi-Branch
- Switch between branches
- Separate inventory per branch
- Branch-specific reports
- Centralized dashboard

---

## 🚀 Next Steps

1. **Customize for Your Business**
   - Update company name/logo
   - Modify tax rates
   - Add your branches
   - Configure payment methods

2. **Add Real Data**
   - Import your product catalog
   - Add existing customers
   - Record supplier information
   - Input historical transactions

3. **Team Setup**
   - Create user accounts for staff
   - Assign appropriate roles
   - Set branch assignments
   - Configure permissions

4. **Deploy to Production**
   - Follow [Deployment Guide](./DEPLOYMENT.md)
   - Set up Railway.app
   - Configure MongoDB Atlas
   - Deploy frontend to Vercel/Netlify

5. **Integrate Systems**
   - Connect payment gateways
   - Setup email notifications
   - Configure barcode scanners
   - Integrate third-party services

---

## 📖 Documentation Index

| Document | Purpose |
|----------|---------|
| [Project Structure](./PROJECT_STRUCTURE.md) | Folder organization and layout |
| [Backend Setup](./BACKEND_SETUP.md) | Server configuration |
| [Database Schemas](./MONGODB_SCHEMAS.md) | MongoDB models |
| [Controllers](./BACKEND_CONTROLLERS.md) | API logic |
| [Frontend Setup](./FRONTEND_SETUP.md) | React configuration |
| [Utilities](./UTILITIES_HELPERS.md) | Helper functions |
| [Deployment](./DEPLOYMENT.md) | Production setup |

---

## 💡 Pro Tips

1. **Keyboard Shortcuts**
   - `Cmd+K` / `Ctrl+K` = Global search
   - `Cmd+Enter` / `Ctrl+Enter` = Save
   - `Escape` = Close modals

2. **Bulk Operations**
   - Import CSV files for products
   - Bulk price updates
   - Batch invoice creation

3. **Reports Export**
   - Generate monthly P&L
   - Export inventory reports
   - Email statements to customers

4. **Mobile Access**
   - Fully responsive design
   - POS works on tablets
   - Reports on mobile

5. **Offline Support**
   - Some features work offline
   - Sync when connection returns
   - Local data caching

---

## ❓ FAQ

**Q: How do I add more users?**
A: As Admin, go to Settings → Users → Add User

**Q: Can I have multiple branches?**
A: Yes! Go to Settings → Branches → Add Branch

**Q: How do I export reports?**
A: Open any report → Click Export → Choose PDF/Excel

**Q: Is there a mobile app?**
A: Currently web-based, fully responsive for mobile

**Q: How do I backup data?**
A: MongoDB Atlas has automatic daily backups

**Q: Can I integrate a payment gateway?**
A: Yes! Update the payment processing section

---

## 🎓 Learning Path

**Day 1:**
- [ ] Understand dashboard
- [ ] Create a test product
- [ ] Create a test invoice
- [ ] View generated reports

**Day 2:**
- [ ] Manage inventory
- [ ] Track expenses
- [ ] Check accounting entries
- [ ] Explore multi-branch features

**Day 3:**
- [ ] Test all user roles
- [ ] Review financial reports
- [ ] Check forecasting
- [ ] Export data

**Day 4-7:**
- [ ] Customize for your business
- [ ] Import real data
- [ ] Train your team
- [ ] Plan deployment

---

## 🆘 Getting Help

1. **Check Documentation** - Most questions answered in guides
2. **GitHub Issues** - Search for similar issues
3. **Community** - Ask in forum/Discord
4. **Email** - support@clothing-erp.com

---

## 🎉 You're All Set!

Your enterprise ERP system is ready to use!

**Next:** Open http://localhost:3000 and login 🚀

---

**Questions?** Refer to the documentation files or create an issue on GitHub.

Happy selling! 👕👗👟

